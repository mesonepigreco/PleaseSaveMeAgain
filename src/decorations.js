import { Sprite } from "./sprite.js";

export class AnimatedFlower extends Sprite {
    constructor(x, y, groups = []) {
        super(x, y, "flower", groups);

        // The dimension of the flower
        this.loaded  = false;

        let self = this;
        this.load_static_image("assets/decorations/flower.png", () => {
            self.loaded = true;
        });
        this.set_width_height(8,8);
        this.setup_spritesheet_animation("idle", [0,1]);

        this.current_animation = "idle";
        this.frame_rate = 1.2;
    }

    is_loaded() {
        return self.loaded;
    }
}


export class AnimatedGrass extends Sprite {
    constructor(x, y, groups = []) {
        super(x, y, "grass_dec", groups);

        // The dimension of the flower
        this.loaded  = false;

        let self = this;

        // Pick a random color
        let colors = ["yellow", "blue", "red"]
        let filename = "assets/decorations/grass_dec_" + colors[Math.floor(Math.random() * colors.length)] + "2x.png";

        this.load_static_image(filename, () => {
            self.loaded = true;
        });
        this.set_width_height(8,16);
        this.setup_spritesheet_animation("idle", [0,1,2,1]);

        this.current_animation = "idle";
        this.frame_rate = 1.5;
    }

    is_loaded() {
        return self.loaded;
    }
}