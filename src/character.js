import { Particle, particle_flow } from "./particles.js";
import { Sprite } from "./sprite.js";
import { norm } from "./vector_func.js";

export class Character extends Sprite {
    constructor(x, y, kind, groups, collision_group = null) {
        super(x, y, kind, groups);

        // Here the stats of the character
        this.hp = 100;
        this.current_hp = this.hp;
        this.speed = 5;
        this.strenght = 12;
        this.intelligence = 12;
        this.armor = 0;
        this.mana = 100;
        this.mana_reovery = 1; // per second
    
        this.xp = 0;
        
        // Here additional things about the character
        this.equipment = [];
        this.holding = null;
        this.clothes = [];
        this.spells = [];

        this.invisible = false;
        this.invulnerable = false;
        this.invisibility_trasparency = .6;
        this.invisibility_period = 700;
        this.invisibility_amplitude = .2;
        this.flicker_period = 180; // ms
        this.particle_speed = 30;

        this.use_acceleration = false;
        this.viscosity = 3.5;
        this.acceleration = {x: 0, y: 0};
        this.friction = 10;
        this.stun_trigger = -1000;
        this.stun_timeout = 200;

        this.invunearbility_trigger = -1000;
        this.invulnerablility_timeout = 2000;
        this.invisibility_trigger = -1000;
        this.invisibility_timeout = 6000;


        this.collision_group = collision_group;


        // Load the model for the particles
        this.particle_model = new Particle(this.x, this.y);
        this.particle_model.set_all_animations(["blink"]);
        this.particle_model.load_animation("blink", "assets/blink", 0, 4, 4, ".png");
        this.particle_period = .1;

        this.squish_walk = true;
        this.squish_squosh_period = 0.27;
        this.squish_squosh_xamp = 0.08;
        this.squish_squosh_yamp = 0.1;
        this.squish_squosh_dephase = Math.PI / 2;
    }

    get max_mana() {
        return this.intelligence * 10;
    }

    get stunned(){
        return this.use_acceleration;
    }

    walk_squish() {
        let time = Date.now() / 1000;
        if (norm(this.velocity) > 0.1) {
            let factorx = Math.sin(time * 2 * Math.PI / this.squish_squosh_period);
            let factory = Math.sin(time * 2 * Math.PI / this.squish_squosh_period + this.squish_squosh_dephase);
            this.scale_x = 1 + this.squish_squosh_xamp * factorx;
            this.scale_y = 1 + this.squish_squosh_yamp * factory; 
        } else {
            this.scale_x = 1;
            this.scale_y = 1;
        }
    }

    level_up() {
        this.strenght += Math.random();
        this.intelligence += Math.random();
        this.hp += Math.random()*5;
        this.mana = this.max_mana;
        this.xp = 0;
    }

    set_invulnerability() {
        let time = Date.now();
        this.invulnerable = true;
        this.invunearbility_trigger = time;
    }

    set_invisibility() {
        let time = Date.now();
        this.invisible = true;
        this.invisibility_trigger = time;
    }

    update_all_status() {
        if (this.invulnerable) {
            if (Date.now() - this.invunearbility_trigger > this.invulnerablility_timeout)
                this.invulnerable = false;
        }

        if (this.invisible) {
            if (Date.now() - this.invisibility_trigger > this.invisibility_timeout)
                this.invisible = false;
        }
    }

    update_mana(dt) {
        // Autorecovery
        this.mana += this.mana_reovery * dt;
        if (this.mana > this.max_mana) this.mana = this.max_mana;
    }

    update_acceleration() {
        // Setup the viscosity
        this.acceleration.x = -this.velocity.x * this.viscosity;
        this.acceleration.y = -this.velocity.y * this.viscosity;

        // Setup the static
        //this.acceleration.x -= Math.sign(this.velocity.x) * this.friction;
        //this.acceleration.y -= Math.sign(this.velocity.y) * this.friction;

        //console.log("Acceleration:", this.acceleration);

        // Check if deactivate the trigger
        let time = Date.now();
        if (time - this.stun_trigger > this.stun_timeout) this.use_acceleration = false;
    }

    push_back(direction, momentum) {
        // Push back the character into the desired direction
        let time = Date.now();
        this.use_acceleration = true;
        this.stun_trigger = time;


        let nn = norm(direction);
        this.velocity.x = direction.x * momentum / nn;
        this.velocity.y = direction.y * momentum / nn;
        console.log("PUSH BACK: momentum:", momentum, "velocity:", this.velocity);
    }

    update(dt) {
        super.update(dt);

        // Update the armor
        this.armor = (this.strenght - 12) * 0.2 
        for (var i = 0; i  < this.clothes.length; ++i) this.armor += this.clothes[i].armor;

        // Update velocity
        if (this.use_acceleration) {
            this.update_acceleration();
            this.velocity.x += this.acceleration.x * dt;
            this.velocity.y += this.acceleration.y * dt;
        }

        this.update_all_status();

        this.update_mana(dt);

        // Update the walking squish squosh
        if (this.squish_walk) this.walk_squish();

        // Apply the horizontal moovement
        this.x += this.velocity.x * dt;
        //this.x = Math.floor(this.x);
        this.update_collision(true);

        // Apply the vertical moovement
        this.y += this.velocity.y * dt;
        //this.y = Math.floor(this.y);
        this.update_collision(false);
    }

    draw(context, camera) {
        context.save();
        if (this.invulnerable) {
            context.globalAlpha = Math.sin(Date.now() * Math.PI / this.flicker_period)**2;
        } else if (this.invisible) {
            var variable_alpha = .5*(Math.sin(Date.now() * Math.PI * 2 / this.invisibility_period) + 1);
            context.globalAlpha =  this.invisibility_trasparency + variable_alpha* this.invisibility_amplitude;

        }

        super.draw(context, camera);
        context.restore();
    }


    update_collision(left_right = true) {
        if (this.collision_group === null) {
            console.log("Il lupetto se ne va");
            return;
        }

        let colliders = this.collision_group.sprites;
        var is_ground = false;
        //console.log("Colliders: ", this.collision_group.sprites);
        for (var i = 0; i < colliders.length; ++i) {
            let sprite =  colliders[i];
            let collision = null;
            collision = this.collidewith(sprite);

            if (collision !== null) {

                // Check for the horizontal direction
                if (left_right) {
                    if (this.velocity.x > 0) {
                        this.x = sprite.x + collision.left - this.colliders[0].right - 1e-8;
                    } else if (this.velocity.x < 0) {
                        this.x = sprite.x + collision.right - this.colliders[0].left + 1e-8;
                    }
                    this.velocity.x = 0;
                }
                else {
                    // Check for the vertical direction
                    if (this.velocity.y < 0) {
                        this.y = sprite.y + collision.bottom - this.colliders[0].top + 1e-8;
                        is_ground = true;
                    } else if (this.velocity.y > 0) {
                        this.y = sprite.y + collision.top - this.colliders[0].bottom - 1e-8;
                    }
                    this.velocity.y = 0;
                }
            }
        }
        /*
        if (this.is_ground && !is_ground) {
            this.is_ground = false;
            this.falling_timer = Date.now();
        } else {
            this.is_ground = is_ground;
        }*/
    }
}


