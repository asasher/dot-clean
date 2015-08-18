/// <reference path="../typings/phaser/phaser.comments.d.ts" />

import Global = require('./Global');
import Element = require('./Element');
import ElementState = require('./ElementState');

var NodeColors = { };
NodeColors[ElementState.BAD] = Global.COLOR_NODE_BAD;
NodeColors[ElementState.GOOD] = Global.COLOR_NODE;
NodeColors[ElementState.SELECTED] = Global.COLOR_NODE_SELECT;

class Node extends Element {
	i: number;
	radius: number;
	text: Phaser.Text;
	
	constructor(game: Phaser.Game, i: number, pos: number[], state: number) {
		super(game, pos, state);		
		this.i = i;
		this.radius = Global.SIZE_NODE;
	}

	draw() {		
		super.draw();
		
		var duration: number = 1000;
		var delay: number = Math.random() * 200;
		var tweenable = {
			radius: 0
		}
		this.game.add.tween(tweenable).to({ radius: this.radius }, duration, Phaser.Easing.Elastic.Out, true, delay, 0, false)
			.onUpdateCallback(() => {
				this.graphic.clear();				
				this.graphic.beginFill(this.getColor(), 1.0);
				this.graphic.drawCircle(this.x,this.y, tweenable.radius);
			}, this);
	}
	
	update() {
		var duration: number = 300;
		var delay: number = 0;
		var tweenable = {
			radius: 0
		}
		this.game.add.tween(tweenable).to({ radius: this.radius }, duration, Phaser.Easing.Quadratic.Out, true, delay, 0, false)
			.onUpdateCallback(() => {				
				this.graphic.beginFill(this.getColor(), 1.0);
				this.graphic.drawCircle(this.x,this.y, tweenable.radius);
			}, this)
			.onComplete.add(() => {
				this.graphic.clear();
				this.graphic.beginFill(this.getColor(), 1.0);
				this.graphic.drawCircle(this.x,this.y, tweenable.radius);				
			}, this);		
	}
	
	addTouchListener(callback, context) {	
		this.graphic.hitArea = new Phaser.Circle(this.x,this.y,this.radius);
		this.graphic.inputEnabled = true;
		this.graphic.events.onInputOver.add(callback, context, 0, this);		
	}
	
	getColor() {
		return NodeColors[this.state];		
	}
	
	setText(txt: string) {
		var style = { 
			font: "24px Arial", 
			fill: "#" + NodeColors[ElementState.BAD].toString(16), 
			align: "center" 
		}
		if (!this.text) {
			this.text = this.game.add.text(this.x, this.y, '', style);
			this.text.anchor.setTo(0.5, 0.4);			
		}
		
		var was = this.text.text;		
		this.text.setText(txt);
		if(was == '') {
			this.text.alpha = 0;
			this.game.add.tween(this.text).to({
				alpha: 1
			}, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);			
		}		
	}

	destroy() {

	}
}

export = Node;