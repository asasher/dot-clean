/// <reference path="../typings/phaser/phaser.comments.d.ts" />
import TitleState = require('./TitleState');
import GameRunningState = require('./GameRunningState');

class Game {
	game: Phaser.Game;

	constructor() {
		this.game = new Phaser.Game('100', '100', Phaser.AUTO, 'game', 
			{ 
				preload: this.preload, 
				create: this.create,
				update: this.update,
				render: this.render
			}
		);
		
		this.game.state.add('TitleState', TitleState, false);
		this.game.state.add('GameRunningState', GameRunningState, false);
		this.game.state.start('TitleState', true, true);
	}

	preload() {
		
	}

	create() {		
		
	}	
	
	update() {
		
	}
	
	render() {
		
	}
}

export = Game;