/// <reference path="../typings/phaser/phaser.comments.d.ts" />

import Global = require('./Global');

class Element {
	game: Phaser.Game;
	graphic: Phaser.Graphics;
	state: number;
	pos: number[];
	x: number;
	y: number;

	constructor(game: Phaser.Game, pos: number[], state: number) {
		this.game = game;
		this.setPos(pos);
		this.setState(state);
	}

	draw() {
		if (!this.graphic) {
			this.graphic = this.game.add.graphics(0, 0);
		}
	}
	
	update() { }

	destroy() { }

	setPos(pos: number[]) {
		this.pos = pos;

		var w: number = this.game.world.width;
		var h: number = this.game.world.height;
		var d: number = Math.min(w, h);
		
		var oX: number = this.game.world.centerX - d / 2; 
		var oY: number = this.game.world.centerY - d / 2;
		
		this.x = pos[0] * d + oX;
		this.y = pos[1] * d - oY;
	}

	setState(state: number) {
		this.state = state;	
	}	
	
	getState() : number {
		return this.state;
	}
	
	getGraphic() : Phaser.Graphics {
		return this.graphic;
	}
}

export = Element;