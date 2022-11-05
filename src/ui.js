import { Rect } from "./rect.js";

export class UI {
    constructor(player, canvas) {
		this.player = player;
		this.canvas = canvas;

		this.rel_life_pos = {
			x: .2,
			y: .85
		};
		this.rel_mana_pos = {
			x: .2,
			y: .9
		};
		this.height_ratio = .05;
		this.width_ratio = .4;

		this.spell_pos = {x : .8, y:.935};
    }

    get_back_rect() {
		let back_rect = new Rect(this.canvas.width* this.width_ratio,
					this.canvas.height * this.height_ratio*2);
		back_rect.x = this.canvas.width * this.rel_life_pos.x;
		back_rect.y = this.canvas.height * this.rel_life_pos.y;
		return back_rect.inflate_absolute(5, 5); 
    }

    get_life_rect() {
		let width = this.canvas.width* this.width_ratio* this.player.current_hp / this.player.hp;
			
		let life_rect = new Rect(width,
					this.canvas.height * this.height_ratio);
		life_rect.x = this.canvas.width * this.rel_life_pos.x;
		life_rect.y = this.canvas.height * this.rel_life_pos.y;
		return life_rect;
    }
	
	get_mana_rect() {
		let width = this.canvas.width* this.width_ratio* this.player.mana / this.player.max_mana;
			
		let rect = new Rect(width,
					this.canvas.height * this.height_ratio);
		rect.x = this.canvas.width * this.rel_mana_pos.x;
		rect.y = this.canvas.height * this.rel_mana_pos.y;
		return rect;
	}

	write_selected_spell(context) {
		const text = 'Spell: ' + this.player.spells[this.player.selected_spell];
		
		context.save();
		context.fillStyle = '#222';
		context.fillText(text, this.spell_pos.x * this.canvas.width, this.spell_pos.y * this.canvas.height);
		context.restore();
	}

	draw_life(context) {
		context.save();
		context.fillStyle = "#000";
		let black_rect = this.get_back_rect();
		context.fillRect(black_rect.x, black_rect.y, black_rect.width, black_rect.height);

		context.fillStyle = "#f00";
		let red_rect = this.get_life_rect();
		context.fillRect(red_rect.x, red_rect.y, red_rect.width, red_rect.height);

		context.fillStyle = "#00e";
		let manarect = this.get_mana_rect();
		context.fillRect(manarect.x, manarect.y, manarect.width, manarect.height);

		// Add the text of the life
		// TODO specify the font
		const text = "HP: " + String(Math.floor(this.player.current_hp)) + "/" + String(Math.floor(this.player.hp));
		const text_size = context.measureText(text);
		const height = text_size.actualBoundingBoxAscent - text_size.actualBoundingBoxDescent;
		const pos = {
			x : black_rect.right + 20,
			y : black_rect.top + black_rect.height / 2 + height / 2
		}; 
		context.fillStyle = "#eee";
		context.fillText(text, pos.x, pos.y);
		context.fillStyle = "#000";
		context.strokeText(text, pos.x, pos.y);

		this.write_selected_spell(context);

		context.restore();
	}

	draw(context) {
		this.draw_life(context);
	}
}
