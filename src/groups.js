

export class Group {
    constructor() {
        this.sprites = [];
    }
    get length() {
        return this.sprites.length;
    }

    draw(context, camera) { 
        for (var i = 0; i < this.sprites.length; ++i) {
            let sprite = this.sprites[i];
            sprite.draw(context, camera);
        }
    }

    update(deltaTime) {
        for (var i = 0; i < this.sprites.length; ++i) {
            let sprite = this.sprites[i];
            sprite.update(deltaTime);
        }
    }

    add(sprite) {
        this.sprites.push(sprite);
        sprite.groups.push(this);
    }

    remove(sprite) {
        // Remove the sprite from the group
        var index = this.sprites.findIndex( (element) => element == sprite);
        this.sprites.splice(index, 1);
        
        // Remove the group from the sprite groups
        var index = sprite.groups.findIndex( (element) => element == this);
        sprite.groups.splice(index, 1);

    }

    // Remove all the sprites
    empty() {
        for (var i = this.length - 1; i >= 0; --i) {
            this.remove(this.sprites[i]);
        }
    }
}


export class YSortedGroup extends Group {

    draw(context, camera) { 
        // Sort the sprites
        function sorting_rules(a,b) {
            // Sort by the bottom of the y position
            if (a.y + a.image.height > b.y + b.image.height) return 1;
            else if (a.y + a.image.height < b.y + b.image.height) return -1;
            return 0;
        }
        this.sprites.sort(sorting_rules);

        super.draw(context, camera);
    }
}