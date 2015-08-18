/// <reference path="../typings/phaser/phaser.comments.d.ts" />

import Global = require('./Global');
import Element = require('./Element');
import Node = require('./Node');
import ElementState = require('./ElementState');

var EdgeColors = {};
EdgeColors[ElementState.BAD] = Global.COLOR_NODE_BAD;
EdgeColors[ElementState.GOOD] = Global.COLOR_NODE;
EdgeColors[ElementState.SELECTED] = Global.COLOR_NODE_SELECT;

class Edge extends Element {
	i: number;
	j: number;
	from: Node;
	to: Node;
	size: number;

	constructor(game: Phaser.Game, i: number, j: number, from: Node, to: Node) {
		var pos = from.pos;
		super(game, pos, ElementState.BAD); //does not matter depends on node		
		
		this.i = i;
		this.j = j;
		this.from = from;
		this.to = to;
		this.size = Global.SIZE_EDGE;
	}

	getState(): number {
		var fromState = this.from.getState();
		var toState = this.to.getState();
		if (fromState == ElementState.BAD || toState == ElementState.BAD) {
			return ElementState.BAD;
		} else if (fromState == ElementState.SELECTED && toState == ElementState.SELECTED) {
			return ElementState.SELECTED;
		} else {
			return ElementState.GOOD;
		}
	}

	draw() {
		super.draw();

		var duration: number = 2000;
		var delay: number = Math.random() * 200;

		this.game.add.tween(this).to({
			x: this.to.x,
			y: this.to.y
		}, duration, Phaser.Easing.Quadratic.Out, true, delay, 0, false)
			.onUpdateCallback(() => {
				this.graphic.clear();
				this.graphic.moveTo(this.from.x, this.from.y);
				this.graphic.lineStyle(this.size, this.getColor(), 1.0);
				this.graphic.lineTo(this.x, this.y);
				
				//caps
				this.graphic.beginFill(this.getColor(), 1.0);
				this.graphic.drawCircle(this.from.x, this.from.y, this.size / 2);
				this.graphic.drawCircle(this.x, this.y, this.size / 2);
			}, this);
	}

	update() {
		var duration: number = 500;
		var delay: number = 0;
		
		var start = {
			x: this.from.x,
			y: this.from.y
		}
		
		var tweenable = {
			x: start.x,
			y: start.y
		}
		
		var end = {
			x: this.to.x,
			y: this.to.y
		}
		
		this.x = start.x;
		this.y = start.y;
		
		this.game.add.tween(tweenable).to(end, duration, Phaser.Easing.Quadratic.InOut, true, delay, 0, false)
			.onUpdateCallback(() => {
				this.graphic.moveTo(start.x, start.y);
				this.graphic.lineStyle(this.size, this.getColor(), 1.0);
				this.graphic.lineTo(tweenable.x, tweenable.y);
			}, this)
			.onComplete.add(() => {
				this.graphic.clear();
				this.graphic.moveTo(start.x, start.y);
				this.graphic.lineStyle(this.size, this.getColor(), 1.0);
				this.graphic.lineTo(end.x, end.y);
				
				this.x = end.x;
				this.y = end.y;
			}, this);
	}
	
	setFromNode(from: Node) {
		var reverse = false;
		if(this.from != from) {
			reverse = true;
		}		
		
		if(reverse) {
			var temp = this.from;
			this.from = this.to;
			this.to = temp;
		}
	}

	getColor() {
		return EdgeColors[this.state];
	}

	destroy() {

	}
}

export = Edge;