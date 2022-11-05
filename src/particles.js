import { Sprite } from "./sprite.js";
import { norm, random_poisson } from "./vector_func.js";

export class Particle extends Sprite {
    constructor(x, y, groups = []) {
        super(x, y, "particle", groups);


        this.lifetime = 1; // Time in seconds
        this.total_lifetime = -1;
        this.radius_factor = 20;

        this.start_alpha = 1;
        this.end_alpha = 0.7;
    }

    update(dt) {
        super.update(dt);

        if (this.total_lifetime < this.lifetime) this.total_lifetime = this.lifetime;

        // Update the speed
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;

        // Reuce the lifetime
        this.lifetime -= dt;
        if (this.lifetime < 0) this.kill();
    }

    get_alpha() {
        let linear =  this.lifetime/ this.total_lifetime;
        return this.end_alpha + (this.start_alpha-this.end_alpha) * Math.sqrt(Math.sqrt(linear));
    }

    draw(context, canvas) {
        context.save();
        context.globalAlpha = this.get_alpha();
        super.draw(context, canvas);
        context.restore();
    }
}


export function particle_flow(pos, velocity, particle_model, rate, dt, visible_group) {

    var mean = dt / rate;
    var n_particles = random_poisson(mean);

    for (var i  = 0;  i < n_particles; ++i) {
        let particle = new Particle(pos.x, pos.y);
        particle_model.paste_animation(particle);

        // Add a random size of the sprite
        particle.scale_x = Math.sqrt(Math.random());
        particle.scale_y = Math.sqrt(Math.random());
        
        // extract the velocity
        let vel = {
            x : Math.random()*2 - 1,
            y : Math.random()*2 - 1
        };
        let nn = norm(vel);
        vel.x *= velocity/nn;
        vel.y *= velocity/nn;

        particle.velocity = vel;
        visible_group.add(particle);
    }
}

export function particle_burst(pos, velocity, particle_model, n_particles, visible_group) {
    for (let i = 0; i < n_particles; ++i) {
        let particle = new Particle(pos.x, pos.y);
        particle_model.paste_animation(particle);

        // Add a random size of the sprite
        particle.scale_x = Math.sqrt(Math.random());
        particle.scale_y = Math.sqrt(Math.random());
        

        // extract the velocity
        let vel = {
            x : Math.random()*2 - 1,
            y : Math.random()*2 - 1
        };
        let nn = norm(vel);
        let factor = (1 + .2 * (Math.random()*2 - 1))
        vel.x *= velocity * factor /nn;
        vel.y *= velocity * factor /nn;

        particle.velocity = vel ;
        visible_group.add(particle);   
    }
}

