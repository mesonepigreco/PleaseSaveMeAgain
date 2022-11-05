import { Camera } from "./camera.js";
import { Group, YSortedGroup } from "./groups.js"
import { Player } from "./player.js";
import { TileMap } from "./tilemap.js";
import { draw_color_circle } from "./color_effects.js";
import { Particle, particle_flow } from "./particles.js";
import { RayCast } from "./raycast.js";
import { UI } from "./ui.js";
import { AnimatedFlower, AnimatedGrass } from "./decorations.js"

export class World {
    constructor(canvas, context) {
        this.background_group = new Group();
        this.visible_group = new YSortedGroup();
        this.collision_group = new Group();
        this.tilemap = null;
        this.canvas = canvas;
        this.context = context;
        this.raycast = new RayCast(this.collision_group);

        this.player = new Player(70, 100, [], this.collision_group);
        this.ui = new UI(this.player, canvas);
        this.camera = new Camera(this.player, canvas);
        this.visible_group.add(this.player);

        // Load the model of the particles for the blod
        this.blood_particles = new Particle(0,0);
        this.blood_particles.set_all_animations(["blood"]);
        this.blood_particles.load_animation("blood", "assets/blood", 0, 4, 4, ".png");
    }

    draw() {
        this.background_group.draw(this.context, this.camera);
        this.visible_group.draw(this.context, this.camera);


        // Draw the color circle
        const center = this.player.imagerect.center;
        const position = {
            x :  this.player.x + center.x - this.camera.x,
            y :  this.player.y + center.y - this.camera.y
        };

        //draw_color_circle(this.context, this.canvas, position, 60);

        // Draw the UI
        this.ui.draw(this.context);
    }

    update_player_in_enemies() {
        for (let i = 0; i < this.visible_group.length; ++i) {
            let sprite = this.visible_group.sprites[i];
            if (sprite.kind === "enemy") {
                sprite.target = this.player;
                sprite.collision_group = this.collision_group;

                sprite.blood_particle_model = this.blood_particles;
                sprite.visible_group = this.visible_group;
            }
        }

        // Add also the visible group
        this.player.visible_group = this.visible_group;
    }


    update(dt) {
        this.update_player_in_enemies();
        this.visible_group.update(dt);
        this.camera.update(dt);

        if (this.player.invisible) {
            particle_flow(this.player.center, 
                this.player.particle_speed, 
                this.player.particle_model, 
                this.player.particle_period, 
                dt, 
                this.visible_group);
        }
    }

    is_loaded() {
        if (!this.tilemap.full_loaded) return false;
        if (!this.player.is_loaded()) return false;
        
        // Check that all the sprites have an image
        for (let i = 0; i < this.visible_group; ++i) {
            let sprite = this.visible_group.sprites[i];
            if (!sprite.is_loaded()) return false;
        }
        return true;
    }

    create_from_tilemap(url) {
        this.tilemap = new TileMap(url, this.background_group, this.visible_group, this.collision_group, 
            this.add_flowers_ground.bind(this));
    }

    add_flowers_ground(flower_rate = 0.2, grass_rate = 0.17) {
        // Add some random flower
        for (let i = 0; i < this.background_group.length; ++i) {
            // Extract how many flowers
            let bgsprite = this.background_group.sprites[i];
            if (bgsprite.kind == "grass") {
                let n_flowers = Math.floor( Math.log(Math.random()) / Math.log(flower_rate));
                for (let j = 0; j < n_flowers; ++j) {
                    let x_value = bgsprite.x + Math.floor(Math.random() * 28);
                    let y_value = bgsprite.y + Math.floor(Math.random() * 28);
                    let flower = new AnimatedFlower(x_value, y_value);
                    this.visible_group.add(flower);
                }

                let n_grass = Math.floor( Math.log(Math.random()) / Math.log(grass_rate));
                for (let j = 0; j < n_grass; ++j) {
                    let x_value = bgsprite.x + Math.floor(Math.random() * 28);
                    let y_value = bgsprite.y + Math.floor(Math.random() * 24);
                    let grass = new AnimatedGrass(x_value, y_value);
                    this.visible_group.add(grass);
                }
            }


        }
    }
}