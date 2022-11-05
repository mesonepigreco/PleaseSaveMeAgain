export class Rect {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
    }


    get midbottom() {
        return {
            x : this.x + this.width / 2,
            y: this.y + this.height
        };
    }

    set midbottom(vector) {
        this.x = vector.x - this.width / 2;
        this.y = vector.y - this.height;
    }

    get center() {
        return {
            x: this.x + this.width / 2, 
            y: this.y + this.height / 2
        };
    }

    set center(vector) {
        this.x = vector.x - this.width/2;
        this.y = vector.y - this.height/2; 
    }

    get bottomleft() {
        return {
            x: this.x,
            y: this.y + this.height
        };
    }


    get midtop() {
        return {
            x : this.x + this.width / 2,
            y : this.y
        };
    }

    get midright() {
        return {
            x: this.x + this.width,
            y : this.y + this.height /2
        };
    }

    get topleft() {
        return {
            x: this.x, y: this.y
        };
    }
    get topright() {
        return {
            x: this.x + this.width, y: this.y
        };
    }

    get bottomright() {
        return {
            x: this.x + this.width, y: this.y + this.height
        };
    }

    get left() {
        return this.x;
    }
    get right() {
        return this.x + this.width;
    }
    get bottom() {
        return this.y +this.height;
    }
    get top() {
        return this.y;
    }

    copy() {
        let cp = new Rect(this.width, this.height);
        cp.x = this.x;
        cp.y = this.y;
        return cp;
    }

    colliderect(rect, offset = {x: 0, y:0}, left_right = 0) {
        // Return true if there is a collision between this and the other sprite
        //console.log("COLLISION BETWEEN:", this, rect, offset);
        
        var collide_left = (this.right + offset.x > rect.left && 
            this.left + offset.x < rect.right);
        var collider_top = (this.bottom + offset.y > rect.top && 
        this.top + offset.y< rect.bottom );

        if (left_right === 1) return collide_left;
        if (left_right === -1) return collider_top;
        return (collider_top && collide_left);
    }

    inflate(x_ratio, y_ratio) {
        /* Generate a new rect centered in the same position but with rescaled dimension */
        let new_rect = new Rect(this.width * x_ratio, this.height * y_ratio);
        new_rect.center = this.center;
        return new_rect;
    }

    inflate_absolute(x_offset, y_offset) {
        /* Generate a new rect centered in the same position but with rescaled dimension */
        let new_rect = new Rect(this.width + x_offset, this.height + y_offset);
        new_rect.center = this.center;
        return new_rect;
    }
}