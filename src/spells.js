import { Rect } from "./rect.js";

export class Spell {
    constructor() {
        this.trigger = -1000;
        this.cooldown_time = 0;
        this.mana_cost = 10;
        this.character = null;
        this.image = null;
    }

    get rect() {
        let myrect = new Rect(this.image.width, this.image.height);
    }

    generate_effect() {
        // NULL 
    }

    draw() {
        // NULL
    }

    update() {
        var time = Date.now();
        if (time - this.trigger < this.cooldown_time) {
            // HERE THE EFFECT
            this.generate_effect();
        }
    }
}

