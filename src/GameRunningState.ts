/// <reference path="../typings/phaser/phaser.comments.d.ts" />

import Global = require('./Global');
import GameState = require('./GameState');
import ElementState = require('./ElementState');
import Node = require('./Node');
import Ripple = require('./Ripple');
import Edge = require('./Edge');
import Agent = require('./Agent');
import GameInfo = require('./GameInfo');

interface Level {
	nodes: number[][],
	adjMatrix: number[][],
	immunityNumber: number
}

class GameRunningState extends Phaser.State {
	game: Phaser.Game;
	gameState: GameState;
	levelData: Level;
	nodes: Node[];
	ripples: Ripple[];
	edges: Edge[][];
	agent: Agent;
	moves: Node[];

	constructor() {
		super();		
	}

	preload() {
	}

	create() {
		var allLevelsData = this.game.cache.getJSON('level-data');
		var gI = GameInfo.getInstance();
		var cLevel = gI.getLevel();
		this.levelData = allLevelsData[cLevel];
		gI.setLevel((cLevel + 1) % allLevelsData.length);

		this.gameState = new GameState(this.levelData.adjMatrix, this.levelData.immunityNumber);

		this.agent = null;
		this.moves = new Array();
		this.createGraph();
	}

	update() {
		if (this.agent && !this.agent.moving && this.moves.length > 0) {
			var to = this.moves.shift();
			this.agent.move(to, () => {
				this.gameState.updateNodeStates(to.i);
				this.updateGraph();	
			}, this);
		}		
		if (!this.gameState.existsContaminatedNode()) {
			this.destroyGraph();
			this.game.state.start('GameRunningState', true, false);
		}
	}

	updateGraph() {
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.gameState.nodeStates[i] < 0) {
				this.nodes[i].setState(ElementState.BAD);
				this.ripples[i].setState(ElementState.BAD);				
			} else {
				this.nodes[i].setState(ElementState.GOOD);
				this.ripples[i].setState(ElementState.GOOD);
				if(this.gameState.nodeStates[i] == 0) {
					this.nodes[i].setText('');					
				} else {
					this.nodes[i].setText((this.levelData.immunityNumber - this.gameState.nodeStates[i]).toString());					
				}	
				this.agent.bringToTop();
			}
			this.nodes[i].update();
			this.ripples[i].update();

			for (var j = 0; j < i; j++) {
				if (this.levelData.adjMatrix[i][j]) {
					if (this.gameState.nodeStates[i] > -1 &&
						this.gameState.nodeStates[j] > -1) {
						this.edges[i][j].setState(ElementState.GOOD);
						this.edges[i][j].setFromNode(this.agent.at);
						this.edges[i][j].update();
					} else {
						this.edges[i][j].setState(ElementState.BAD);
						this.edges[i][j].setFromNode(this.nodes[i]);
						this.edges[i][j].update();
					}
				}
			}
		}
	}

	destroyGraph() { }

	createRipples() {
		for (var i = 0; i < this.nodes.length; i++) {
			var pos: number[] = this.levelData.nodes[i];
			var n = new Ripple(this.game, i, pos, ElementState.BAD);
			this.ripples[i] = n;
		}
	}

	drawRipples() {
		for (var i = 0; i < this.nodes.length; i++) {
			this.ripples[i].draw();
		}
	}

	createNodes() {
		for (var i = 0; i < this.nodes.length; i++) {
			var pos: number[] = this.levelData.nodes[i];
			var n = new Node(this.game, i, pos, ElementState.BAD);
			this.nodes[i] = n;
		}
	}

	drawNodes() {
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].draw();
			this.nodes[i].addTouchListener((caller, pointer, node) => {
				if (!this.agent) {
					this.gameState.updateNodeStates(node.i);
					this.agent = new Agent(this.game, node);
					this.agent.draw();
					this.updateGraph();
				}
				else {
					var at: Node = this.agent.at;
					var to: Node = node;

					var i: number = at.i;
					var j: number = node.i;

					if (this.levelData.adjMatrix[i][j]) {
						this.moves.push(to);
					}
				}
			}, this);
		}
	}

	createGraph() {
		var n = this.levelData.nodes.length;
		this.nodes = new Array(n);
		this.ripples = new Array(n);
		this.edges = new Array(n);
		for (var i = 0; i < n; i++) {
			this.edges[i] = new Array(n);
		}

		this.createNodes();
		this.createRipples();
		this.createEdges();

		this.drawRipples();
		this.drawEdges();
		this.drawNodes();
	}

	createEdges() {
		for (var i = 0; i < this.nodes.length; i++) {
			for (var j = 0; j < i; j++) {
				if (this.levelData.adjMatrix[i][j]) {
					var n1 = this.nodes[i];
					var n2 = this.nodes[j];
					var e = new Edge(this.game, i, j, n1, n2);
					this.edges[i][j] = e;
				}
			}
		}
	}

	drawEdges() {
		for (var i = 0; i < this.nodes.length; i++) {
			for (var j = 0; j < i; j++) {
				if (this.levelData.adjMatrix[i][j]) {
					this.edges[i][j].draw();
				}
			}
		}
	}
}

export = GameRunningState;