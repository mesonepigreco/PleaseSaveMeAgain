import {norm} from "./vector_func.js";

export class Camera {
    constructor(follow_object, canvas) {
        this.x = 0;
        this.y = 0;

        this.follow = follow_object;
        this.fixed = true;
        this.canvas = canvas;
        this.speed = 4;

        this.velocity = {x : 0, y : 0};
    }

    get tot_velocity() {
        return norm(this.velocity);
    }

    update(dt) {
        let target_pos = {
            x: this.follow.x - this.canvas.width / 2,
            y: this.follow.y - this.canvas.height / 2
        };

        if (!this.fixed) {
            this.velocity.x = this.camera_speed *(target_pos.x - this.camera.x);
            this.velocity.y = this.camera_speed *(target_pos.y - this.camera.y);
            this.x += this.camera_velocity.x * dt
            this.y += this.camera_velocity.y * dt
        } else {
            this.x = target_pos.x;
            this.y = target_pos.y;
        }
    }
}