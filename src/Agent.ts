/// <reference path="../typings/phaser/phaser.comments.d.ts" />

import Global = require('./Global');
import Node = require('./Node');
import ElementState = require('./ElementState');

var AgentColor = Global.COLOR_NODE_SELECT; 

class Agent extends Node {
	at: Node;
	moving: boolean;
	
	constructor(game: Phaser.Game, at: Node) {
		super(game, -1, at.pos, ElementState.SELECTED); //state does not matter
		this.at = at;
		this.radius = Global.SIZE_AGENT;
		this.moving = false;
	}

	draw() {		
		super.draw();		
	}
	
	getColor() {
		return AgentColor;		
	}
	
	bringToTop() {
		this.game.world.bringToTop(this.graphic);		
	}
	
	move(to: Node, callback?: Function, cbContext?: Object) {
		this.at = to;		
		this.moving = true;
		this.game.add.tween(this).to({
			x: to.x,
			y: to.y
		}, 600, Phaser.Easing.Linear.None, true, 0, 0, false)
		.onUpdateCallback(() => {
			this.graphic.clear();
			this.graphic.beginFill(this.getColor(), 1.0);
			this.graphic.drawCircle(this.x, this.y, this.radius);			
		}, this)
		.onComplete.add(() => {
			this.moving = false;
			
			this.graphic.clear();
			this.graphic.beginFill(this.getColor(), 1.0);
			this.graphic.drawCircle(this.x, this.y, this.radius);
						
			if (callback) callback.apply(cbContext);
		}, this);
	}

	destroy() {

	}
}

export = Agent;