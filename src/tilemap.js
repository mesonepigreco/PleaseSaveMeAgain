import { Sprite } from "./sprite.js";
import {File} from "./filesystem.js"
import { Rect } from "./rect.js";
import { Wolf } from "./enemies.js";
import { RayCast } from "./raycast.js";
import { point_rect_collision } from "./vector_func.js";

export class TileMap {
    constructor(json_url, background_group, visible_group, obstacle_group, callback) {

        this.background_group = background_group
        this.visible_group = visible_group;
        this.obstacle_group = obstacle_group;

        this.raycast = new RayCast(obstacle_group);

        this.total_width = 0;
        this.total_height = 0;
        this.tilewidth = 0;
        this.full_loaded = false;
        this.callback = callback;

        this.tileset = [];

        this.file = new File(json_url, "json", this.init.bind(this));
        this.base_url = get_basename(json_url);
    }

    get_background_kind(x, y) {
        for (let i = 0; i < this.background_group.length; ++i) {
            let bgsprite = this.background_group.sprites[i];
            if (point_rect_collision({x:x, y:y}, bgsprite.get_global_imagerect())) {
                return bgsprite.kind;
            }
        }
        return null;
    }

    init() {
        let data =  this.file.data;
        this.total_height = data.height;
        this.total_width = data.width;
        this.tilewidth = data.tilewidth;

        // Load the tilesets
        var current_index;
        var start_id = 0;
        for (var i = 0; i < data.tilesets.length; ++i) {
            let tset = data.tilesets[i];
            start_id = tset.firstgid;

            for (var j = 0; j < tset.tiles.length; ++j) {
                let tile = new MapTile(this.base_url + "/" + tset.tiles[j].image, 
                    tset.tiles[j].id + start_id,
                    tset.tiles[j].imagewidth,
                    tset.tiles[j].imageheight,
                    tset.tiles[j]);
                
                // TODO: Add here the colliers of the object
                this.tileset.push(tile);
            }
        }

        for (var i = 0; i < data.layers.length; ++i) {
            let layer = data.layers[i];
            var lheight = layer.height;
            var lwidth = layer.width;
            for (var j = 0; j < layer.data.length; ++j) {
                var x = (j % lwidth) * this.tilewidth;
                var y = Math.floor(j / lwidth) * this.tilewidth;

                let tile = this.get_tile(layer.data[j]);
                if (tile === null) {
                    console.log("ERROR while loading tile: id = ", layer.data[j], " layer ",  i, "position", j);
                } else if (tile !== 0) {
                    let tile_sprite = tile.generate_sprite(x, y, "map", this.raycast);
                    if (layer.name.toLowerCase() === "background")
                        this.background_group.add(tile_sprite);
                    else {
                        this.visible_group.add(tile_sprite);
                    }
                    // Check if the tile has any collider, and add the rect colliders
                    if (tile.colliders.length !== 0) {
                        this.obstacle_group.add(tile_sprite);
                    }
                }
            }
        }
        this.callback();
        this.full_loaded = true;
    }

    get_tile(id) {
        if (id === 0) return 0;
        for (var i = 0; i < this.tileset.length; ++i) {
            if (this.tileset[i].reference_id === id) return this.tileset[i];
        }
        return null;
    }
}


function get_basename(url) {
    var index = 0;
    for (var i = 0; i < url.length; ++i) {
        if (url[i] === "/") index = i;
    }
    return url.substring(0, index);
}

export class MapTile {
    constructor(img_src, reference_id, width, height, total_info) {

        // Load the image
        this.loaded = false;
        let self = this;
        this.image = new Image();
        console.log("Loading image at:", img_src);
        this.image.src = img_src;
        this.image.addEventListener("load", function() {
            self.loaded = true;
        }, false);
        this.reference_id = reference_id

        this.custom_type = null;

        // Load eventual colliders
        this.colliders = [];
        if ("objectgroup" in total_info) {
            for (var i = 0; i < total_info.objectgroup.objects.length; ++i) {
                let obj =  total_info.objectgroup.objects[i];
                if (obj.class.toLowerCase() === "collision") {
                    let rect = new Rect(Math.floor(obj.width), Math.floor(obj.height));
                    rect.x = Math.floor(obj.x);
                    rect.y =  Math.floor(obj.y);
                    this.colliders.push(rect);
                    console.log("ADDING COLLIDER:", rect);
                }
            }
        }

        // Check if it is a wolf
        if ("class" in total_info) {
            this.custom_type = total_info.class;
        }
    }

    generate_sprite(x, y, kind, raycast=null) {
        if (this.custom_type === "wolf") {
            let sprite = new Wolf(x, y+16, raycast);
            return sprite;
        }

        if (this.custom_type !== null) kind = this.custom_type;

        let sprite = new Sprite(x, y, kind);
        sprite.image = this.image;
        sprite.colliders = this.colliders;
        return sprite;
    }
}