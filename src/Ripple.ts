/// <reference path="../typings/phaser/phaser.comments.d.ts" />

import Global = require('./Global');
import Node = require('./Node');
import ElementState = require('./ElementState');

var RippleColors = { };
RippleColors[ElementState.BAD] = Global.COLOR_RIPPLE_BAD;
RippleColors[ElementState.GOOD] = Global.COLOR_RIPPLE;

class Ripple extends Node {
	i: number;
	radius: number;
	
	constructor(game: Phaser.Game, i: number, pos: number[], state: number) {
		super(game, i, pos, state);		
		this.radius = Global.SIZE_RIPPLE;
	}
	
	setState(state: number) {
		if (state != ElementState.SELECTED) {
			this.state = state;			
		}			
	}
	
	getColor() {
		return RippleColors[this.state];
	}
}

export = Ripple;