/// <reference path="../typings/phaser/phaser.comments.d.ts" />

import Global = require('./Global');

class TitleState extends Phaser.State {
	game: Phaser.Game;
	logoDotClean: Phaser.Sprite;
	playBtnCircle: Phaser.Graphics;
	playBtnTri: Phaser.Graphics;

	constructor() {
		super();
	}

	preload() {
		this.game.load.image('logo-dot-clean', 'assets/logo.png');
		this.game.stage.backgroundColor = Global.COLOR_BG;
		this.game.load.json('level-data', 'assets/levels.json', true);
	}

	create() {
		this.logoDotClean = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo-dot-clean');
		this.logoDotClean.alpha = 0;
		this.logoDotClean.anchor.setTo(0.5, 1.0);

		var h = this.logoDotClean.height;
		var w = this.logoDotClean.width;

		this.logoDotClean.y = this.game.world.centerY - h;
		this.game.add.tween(this.logoDotClean).to({ alpha: 1 }, 1000, Phaser.Easing.Quadratic.In, true, 0, 0, false);

		this.playBtnCircle = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY + h / 2);
		this.playBtnCircle.scale.set(0, 0);
		this.playBtnCircle.beginFill(Global.COLOR_NODE_SELECT, 1.0);
		this.playBtnCircle.drawCircle(0, 0, w);
		this.game.add.tween(this.playBtnCircle.scale).to({ x: 1, y: 1 }, 3000, Phaser.Easing.Elastic.Out, true, 500, 0, false);

		var d = h / 3;
		var off = d / 4;
		this.playBtnTri = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY + h / 2);
		this.playBtnTri.scale.set(0, 0);
		this.playBtnTri.beginFill(Global.COLOR_NODE, 1.0);
		var points: Phaser.Point[] = [
			new Phaser.Point(off + d, 0),
			new Phaser.Point(-d + off, d),
			new Phaser.Point(-d + off, -d)
		];
		this.playBtnTri.drawTriangle(points, false);
		this.game.add.tween(this.playBtnTri.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true, 400, 0, false);
		this.playBtnTri.hitArea = new Phaser.Circle(0, 0, w);
		this.playBtnTri.inputEnabled = true;
		this.playBtnTri.events.onInputDown.add(this.playClicked, this);
	}
	
	playClicked(data) {		
		console.log('BAM!!');
		this.game.add.tween(this.playBtnTri.scale).to(
			{x: 0, y: 0},
			1000,
			Phaser.Easing.Elastic.In,
			true, 0, 0, false			
		);
		
		this.game.add.tween(this.playBtnCircle.scale).to(
			{x: 2, y: 2},
			1500,
			Phaser.Easing.Elastic.In,
			true, 500, 0, false
		);
		
		var h = this.logoDotClean.height;
		var w = this.logoDotClean.width;
		
		var bgCircle = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY + h / 2);
		bgCircle.scale.set(0, 0);
		bgCircle.beginFill(Global.COLOR_BG, 1.0);
		bgCircle.drawCircle(0, 0, w);
		this.game.add.tween(bgCircle.scale).to(
			{ x: 10, y: 10 },
			 1000, Phaser.Easing.Quadratic.In,
			 true, 1000, 0, false )
			 .onComplete.add(() => {
				 this.game.state.start('GameRunningState', true, false);
			 }, this);
	}	
}

export = TitleState;