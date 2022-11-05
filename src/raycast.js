import { distance, segment_rect_intersect } from "./vector_func.js";

export class RayCast {
    constructor(obstacle_group) {
        this.obstacle_group = obstacle_group;

    }

    // Check the field of vision
    project_ray(source, target, max_dist = 1000, angle_start = -Math.PI, angle_end = Math.PI) {
        /*
         * Return true if the ray goes from source to target without hitting obstacles
         * and it remains within the max_distance and projected in the angle specified.
         * 0 starts from horizontal - right
         */

        if (distance(source, target) > max_dist) return false;
        
        let angle = Math.atan2(-(target.y - source.y), target.x - source.x);

        //console.log("ANGLE:", angle);

        if (!((angle >= angle_start && angle <angle_end) || 
            (angle + 2*Math.PI >= angle_start && (angle + 2*Math.PI) < angle_end))) return false;

        //console.log("angle good");
        // Iterate over all the colliders to spot a collision
        for (let i = 0; i < this.obstacle_group.length; ++i) {
            let obstacle = this.obstacle_group.sprites[i];
            for (let j = 0; j < obstacle.colliders.length; ++j) {
                const rect = obstacle.get_global_collider_rect(j);

                
                if (segment_rect_intersect(source, target, rect)) return false;
            }
        }

        // If the target is within the range, and no obstacles are found
        // Then the raytracing hit the object
        return true;
    }
}