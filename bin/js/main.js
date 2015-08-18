(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/phaser/phaser.comments.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Global = require('./Global');
var Node = require('./Node');
var ElementState = require('./ElementState');
var AgentColor = Global.COLOR_NODE_SELECT;
var Agent = (function (_super) {
    __extends(Agent, _super);
    function Agent(game, at) {
        _super.call(this, game, -1, at.pos, ElementState.SELECTED); //state does not matter
        this.at = at;
        this.radius = Global.SIZE_AGENT;
        this.moving = false;
    }
    Agent.prototype.draw = function () {
        _super.prototype.draw.call(this);
    };
    Agent.prototype.getColor = function () {
        return AgentColor;
    };
    Agent.prototype.bringToTop = function () {
        this.game.world.bringToTop(this.graphic);
    };
    Agent.prototype.move = function (to, callback, cbContext) {
        var _this = this;
        this.at = to;
        this.moving = true;
        this.game.add.tween(this).to({
            x: to.x,
            y: to.y
        }, 600, Phaser.Easing.Linear.None, true, 0, 0, false)
            .onUpdateCallback(function () {
            _this.graphic.clear();
            _this.graphic.beginFill(_this.getColor(), 1.0);
            _this.graphic.drawCircle(_this.x, _this.y, _this.radius);
        }, this)
            .onComplete.add(function () {
            _this.moving = false;
            _this.graphic.clear();
            _this.graphic.beginFill(_this.getColor(), 1.0);
            _this.graphic.drawCircle(_this.x, _this.y, _this.radius);
            if (callback)
                callback.apply(cbContext);
        }, this);
    };
    Agent.prototype.destroy = function () {
    };
    return Agent;
})(Node);
module.exports = Agent;
},{"./ElementState":4,"./Global":9,"./Node":10}],2:[function(require,module,exports){
/// <reference path="../typings/phaser/phaser.comments.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Global = require('./Global');
var Element = require('./Element');
var ElementState = require('./ElementState');
var EdgeColors = {};
EdgeColors[ElementState.BAD] = Global.COLOR_NODE_BAD;
EdgeColors[ElementState.GOOD] = Global.COLOR_NODE;
EdgeColors[ElementState.SELECTED] = Global.COLOR_NODE_SELECT;
var Edge = (function (_super) {
    __extends(Edge, _super);
    function Edge(game, i, j, from, to) {
        var pos = from.pos;
        _super.call(this, game, pos, ElementState.BAD); //does not matter depends on node		
        this.i = i;
        this.j = j;
        this.from = from;
        this.to = to;
        this.size = Global.SIZE_EDGE;
    }
    Edge.prototype.getState = function () {
        var fromState = this.from.getState();
        var toState = this.to.getState();
        if (fromState == ElementState.BAD || toState == ElementState.BAD) {
            return ElementState.BAD;
        }
        else if (fromState == ElementState.SELECTED && toState == ElementState.SELECTED) {
            return ElementState.SELECTED;
        }
        else {
            return ElementState.GOOD;
        }
    };
    Edge.prototype.draw = function () {
        var _this = this;
        _super.prototype.draw.call(this);
        var duration = 2000;
        var delay = Math.random() * 200;
        this.game.add.tween(this).to({
            x: this.to.x,
            y: this.to.y
        }, duration, Phaser.Easing.Quadratic.Out, true, delay, 0, false)
            .onUpdateCallback(function () {
            _this.graphic.clear();
            _this.graphic.moveTo(_this.from.x, _this.from.y);
            _this.graphic.lineStyle(_this.size, _this.getColor(), 1.0);
            _this.graphic.lineTo(_this.x, _this.y);
            //caps
            _this.graphic.beginFill(_this.getColor(), 1.0);
            _this.graphic.drawCircle(_this.from.x, _this.from.y, _this.size / 2);
            _this.graphic.drawCircle(_this.x, _this.y, _this.size / 2);
        }, this);
    };
    Edge.prototype.update = function () {
        var _this = this;
        var duration = 500;
        var delay = 0;
        var start = {
            x: this.from.x,
            y: this.from.y
        };
        var tweenable = {
            x: start.x,
            y: start.y
        };
        var end = {
            x: this.to.x,
            y: this.to.y
        };
        this.x = start.x;
        this.y = start.y;
        this.game.add.tween(tweenable).to(end, duration, Phaser.Easing.Quadratic.InOut, true, delay, 0, false)
            .onUpdateCallback(function () {
            _this.graphic.moveTo(start.x, start.y);
            _this.graphic.lineStyle(_this.size, _this.getColor(), 1.0);
            _this.graphic.lineTo(tweenable.x, tweenable.y);
        }, this)
            .onComplete.add(function () {
            _this.graphic.clear();
            _this.graphic.moveTo(start.x, start.y);
            _this.graphic.lineStyle(_this.size, _this.getColor(), 1.0);
            _this.graphic.lineTo(end.x, end.y);
            _this.x = end.x;
            _this.y = end.y;
        }, this);
    };
    Edge.prototype.setFromNode = function (from) {
        var reverse = false;
        if (this.from != from) {
            reverse = true;
        }
        if (reverse) {
            var temp = this.from;
            this.from = this.to;
            this.to = temp;
        }
    };
    Edge.prototype.getColor = function () {
        return EdgeColors[this.state];
    };
    Edge.prototype.destroy = function () {
    };
    return Edge;
})(Element);
module.exports = Edge;
},{"./Element":3,"./ElementState":4,"./Global":9}],3:[function(require,module,exports){
/// <reference path="../typings/phaser/phaser.comments.d.ts" />
var Element = (function () {
    function Element(game, pos, state) {
        this.game = game;
        this.setPos(pos);
        this.setState(state);
    }
    Element.prototype.draw = function () {
        if (!this.graphic) {
            this.graphic = this.game.add.graphics(0, 0);
        }
    };
    Element.prototype.update = function () { };
    Element.prototype.destroy = function () { };
    Element.prototype.setPos = function (pos) {
        this.pos = pos;
        var w = this.game.world.width;
        var h = this.game.world.height;
        var d = Math.min(w, h);
        var oX = this.game.world.centerX - d / 2;
        var oY = this.game.world.centerY - d / 2;
        this.x = pos[0] * d + oX;
        this.y = pos[1] * d - oY;
    };
    Element.prototype.setState = function (state) {
        this.state = state;
    };
    Element.prototype.getState = function () {
        return this.state;
    };
    Element.prototype.getGraphic = function () {
        return this.graphic;
    };
    return Element;
})();
module.exports = Element;
},{}],4:[function(require,module,exports){
var ElementState = {
    BAD: 0,
    GOOD: 1,
    SELECTED: 2
};
module.exports = ElementState;
},{}],5:[function(require,module,exports){
/// <reference path="../typings/phaser/phaser.comments.d.ts" />
var TitleState = require('./TitleState');
var GameRunningState = require('./GameRunningState');
var Game = (function () {
    function Game() {
        this.game = new Phaser.Game('100', '100', Phaser.AUTO, 'game', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
        this.game.state.add('TitleState', TitleState, false);
        this.game.state.add('GameRunningState', GameRunningState, false);
        this.game.state.start('TitleState', true, true);
    }
    Game.prototype.preload = function () {
    };
    Game.prototype.create = function () {
    };
    Game.prototype.update = function () {
    };
    Game.prototype.render = function () {
    };
    return Game;
})();
module.exports = Game;
},{"./GameRunningState":7,"./TitleState":12}],6:[function(require,module,exports){
var GameInfo = (function () {
    function GameInfo() {
        this.level = 0;
        if (GameInfo.instance) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        GameInfo.instance = this;
    }
    GameInfo.getInstance = function () {
        return GameInfo.instance;
    };
    GameInfo.prototype.setLevel = function (value) {
        this.level = value;
    };
    GameInfo.prototype.getLevel = function () {
        return this.level;
    };
    GameInfo.instance = new GameInfo();
    return GameInfo;
})();
module.exports = GameInfo;
},{}],7:[function(require,module,exports){
/// <reference path="../typings/phaser/phaser.comments.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameState = require('./GameState');
var ElementState = require('./ElementState');
var Node = require('./Node');
var Ripple = require('./Ripple');
var Edge = require('./Edge');
var Agent = require('./Agent');
var GameInfo = require('./GameInfo');
var GameRunningState = (function (_super) {
    __extends(GameRunningState, _super);
    function GameRunningState() {
        _super.call(this);
    }
    GameRunningState.prototype.preload = function () {
    };
    GameRunningState.prototype.create = function () {
        var allLevelsData = this.game.cache.getJSON('level-data');
        var gI = GameInfo.getInstance();
        var cLevel = gI.getLevel();
        this.levelData = allLevelsData[cLevel];
        gI.setLevel((cLevel + 1) % allLevelsData.length);
        this.gameState = new GameState(this.levelData.adjMatrix, this.levelData.immunityNumber);
        this.agent = null;
        this.moves = new Array();
        this.createGraph();
    };
    GameRunningState.prototype.update = function () {
        var _this = this;
        if (this.agent && !this.agent.moving && this.moves.length > 0) {
            var to = this.moves.shift();
            this.agent.move(to, function () {
                _this.gameState.updateNodeStates(to.i);
                _this.updateGraph();
            }, this);
        }
        if (!this.gameState.existsContaminatedNode()) {
            this.destroyGraph();
            this.game.state.start('GameRunningState', true, false);
        }
    };
    GameRunningState.prototype.updateGraph = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.gameState.nodeStates[i] < 0) {
                this.nodes[i].setState(ElementState.BAD);
                this.ripples[i].setState(ElementState.BAD);
            }
            else {
                this.nodes[i].setState(ElementState.GOOD);
                this.ripples[i].setState(ElementState.GOOD);
                if (this.gameState.nodeStates[i] == 0) {
                    this.nodes[i].setText('');
                }
                else {
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
                    }
                    else {
                        this.edges[i][j].setState(ElementState.BAD);
                        this.edges[i][j].setFromNode(this.nodes[i]);
                        this.edges[i][j].update();
                    }
                }
            }
        }
    };
    GameRunningState.prototype.destroyGraph = function () { };
    GameRunningState.prototype.createRipples = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            var pos = this.levelData.nodes[i];
            var n = new Ripple(this.game, i, pos, ElementState.BAD);
            this.ripples[i] = n;
        }
    };
    GameRunningState.prototype.drawRipples = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            this.ripples[i].draw();
        }
    };
    GameRunningState.prototype.createNodes = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            var pos = this.levelData.nodes[i];
            var n = new Node(this.game, i, pos, ElementState.BAD);
            this.nodes[i] = n;
        }
    };
    GameRunningState.prototype.drawNodes = function () {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw();
            this.nodes[i].addTouchListener(function (caller, pointer, node) {
                if (!_this.agent) {
                    _this.gameState.updateNodeStates(node.i);
                    _this.agent = new Agent(_this.game, node);
                    _this.agent.draw();
                    _this.updateGraph();
                }
                else {
                    var at = _this.agent.at;
                    var to = node;
                    var i = at.i;
                    var j = node.i;
                    if (_this.levelData.adjMatrix[i][j]) {
                        _this.moves.push(to);
                    }
                }
            }, this);
        }
    };
    GameRunningState.prototype.createGraph = function () {
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
    };
    GameRunningState.prototype.createEdges = function () {
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
    };
    GameRunningState.prototype.drawEdges = function () {
        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < i; j++) {
                if (this.levelData.adjMatrix[i][j]) {
                    this.edges[i][j].draw();
                }
            }
        }
    };
    return GameRunningState;
})(Phaser.State);
module.exports = GameRunningState;
},{"./Agent":1,"./Edge":2,"./ElementState":4,"./GameInfo":6,"./GameState":8,"./Node":10,"./Ripple":11}],8:[function(require,module,exports){
var GameState = (function () {
    function GameState(adjacencyMatrix, immunity) {
        this.adjacencyMatrix = adjacencyMatrix;
        this.nodeStates = new Array(adjacencyMatrix.length);
        this.agentPos = -1;
        this.immunity = immunity;
        this.setInitNodeState();
    }
    GameState.prototype.setInitNodeState = function () {
        for (var i = 0; i < this.nodeStates.length; i++) {
            this.nodeStates[i] = -1;
        }
        this.numDirtyNodes = this.nodeStates.length;
    };
    GameState.prototype.hasContaminatedNeighbour = function (node, toExclude) {
        for (var neighbour in this.adjacencyMatrix[node]) {
            if (this.nodeStates[neighbour] == -1)
                return true;
        }
        return false;
    };
    GameState.prototype.getUpdatedState = function (node, move) {
        var nodeState = this.nodeStates[node];
        if (node == move || node == this.agentPos) {
            this.numDirtyNodes--;
            return 0;
        }
        else if (this.nodeStates[node] > -1 && this.hasContaminatedNeighbour(node, -1)) {
            if (nodeState + 1 >= this.immunity) {
                this.numDirtyNodes++;
                return -1;
            }
            else if (this.hasContaminatedNeighbour(node, move))
                return nodeState + 1;
            else
                return -2;
        }
        else
            return nodeState;
    };
    GameState.prototype.updateNodeStates = function (move) {
        var toCheckLater;
        for (var i = 0; i < this.nodeStates.length; i++) {
            var temp = this.getUpdatedState(i, move);
            if (temp == -2)
                toCheckLater.push(i);
            else
                this.nodeStates[i] = temp;
        }
        for (var node in toCheckLater) {
            if (this.hasContaminatedNeighbour(node, -1))
                this.nodeStates[node] += 1;
            else {
                this.nodeStates[node] = 0;
                this.numDirtyNodes--;
            }
        }
    };
    GameState.prototype.existsContaminatedNode = function () {
        return (this.numDirtyNodes > 0);
    };
    GameState.prototype.getAvailableMoves = function () {
        return this.adjacencyMatrix[this.agentPos];
    };
    return GameState;
})();
module.exports = GameState;
},{}],9:[function(require,module,exports){
var Global = {
    COLOR_BG: 0x131D23,
    COLOR_NODE: 0xF9F9F9,
    COLOR_NODE_SELECT: 0x126DA0,
    COLOR_NODE_BAD: 0xFF6347,
    COLOR_RIPPLE_BAD: 0x160E0E,
    COLOR_RIPPLE_BAD_2: 0xED7A24,
    COLOR_RIPPLE: 0x101819,
    SIZE_NODE: 40,
    SIZE_RIPPLE: 80,
    SIZE_EDGE: 5,
    SIZE_AGENT: 20
};
module.exports = Global;
},{}],10:[function(require,module,exports){
/// <reference path="../typings/phaser/phaser.comments.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Global = require('./Global');
var Element = require('./Element');
var ElementState = require('./ElementState');
var NodeColors = {};
NodeColors[ElementState.BAD] = Global.COLOR_NODE_BAD;
NodeColors[ElementState.GOOD] = Global.COLOR_NODE;
NodeColors[ElementState.SELECTED] = Global.COLOR_NODE_SELECT;
var Node = (function (_super) {
    __extends(Node, _super);
    function Node(game, i, pos, state) {
        _super.call(this, game, pos, state);
        this.i = i;
        this.radius = Global.SIZE_NODE;
    }
    Node.prototype.draw = function () {
        var _this = this;
        _super.prototype.draw.call(this);
        var duration = 1000;
        var delay = Math.random() * 200;
        var tweenable = {
            radius: 0
        };
        this.game.add.tween(tweenable).to({ radius: this.radius }, duration, Phaser.Easing.Elastic.Out, true, delay, 0, false)
            .onUpdateCallback(function () {
            _this.graphic.clear();
            _this.graphic.beginFill(_this.getColor(), 1.0);
            _this.graphic.drawCircle(_this.x, _this.y, tweenable.radius);
        }, this);
    };
    Node.prototype.update = function () {
        var _this = this;
        var duration = 300;
        var delay = 0;
        var tweenable = {
            radius: 0
        };
        this.game.add.tween(tweenable).to({ radius: this.radius }, duration, Phaser.Easing.Quadratic.Out, true, delay, 0, false)
            .onUpdateCallback(function () {
            _this.graphic.beginFill(_this.getColor(), 1.0);
            _this.graphic.drawCircle(_this.x, _this.y, tweenable.radius);
        }, this)
            .onComplete.add(function () {
            _this.graphic.clear();
            _this.graphic.beginFill(_this.getColor(), 1.0);
            _this.graphic.drawCircle(_this.x, _this.y, tweenable.radius);
        }, this);
    };
    Node.prototype.addTouchListener = function (callback, context) {
        this.graphic.hitArea = new Phaser.Circle(this.x, this.y, this.radius);
        this.graphic.inputEnabled = true;
        this.graphic.events.onInputOver.add(callback, context, 0, this);
    };
    Node.prototype.getColor = function () {
        return NodeColors[this.state];
    };
    Node.prototype.setText = function (txt) {
        var style = {
            font: "24px Arial",
            fill: "#" + NodeColors[ElementState.BAD].toString(16),
            align: "center"
        };
        if (!this.text) {
            this.text = this.game.add.text(this.x, this.y, '', style);
            this.text.anchor.setTo(0.5, 0.4);
        }
        var was = this.text.text;
        this.text.setText(txt);
        if (was == '') {
            this.text.alpha = 0;
            this.game.add.tween(this.text).to({
                alpha: 1
            }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
        }
    };
    Node.prototype.destroy = function () {
    };
    return Node;
})(Element);
module.exports = Node;
},{"./Element":3,"./ElementState":4,"./Global":9}],11:[function(require,module,exports){
/// <reference path="../typings/phaser/phaser.comments.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Global = require('./Global');
var Node = require('./Node');
var ElementState = require('./ElementState');
var RippleColors = {};
RippleColors[ElementState.BAD] = Global.COLOR_RIPPLE_BAD;
RippleColors[ElementState.GOOD] = Global.COLOR_RIPPLE;
var Ripple = (function (_super) {
    __extends(Ripple, _super);
    function Ripple(game, i, pos, state) {
        _super.call(this, game, i, pos, state);
        this.radius = Global.SIZE_RIPPLE;
    }
    Ripple.prototype.setState = function (state) {
        if (state != ElementState.SELECTED) {
            this.state = state;
        }
    };
    Ripple.prototype.getColor = function () {
        return RippleColors[this.state];
    };
    return Ripple;
})(Node);
module.exports = Ripple;
},{"./ElementState":4,"./Global":9,"./Node":10}],12:[function(require,module,exports){
/// <reference path="../typings/phaser/phaser.comments.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Global = require('./Global');
var TitleState = (function (_super) {
    __extends(TitleState, _super);
    function TitleState() {
        _super.call(this);
    }
    TitleState.prototype.preload = function () {
        this.game.load.image('logo-dot-clean', 'assets/logo.png');
        this.game.stage.backgroundColor = Global.COLOR_BG;
        this.game.load.json('level-data', 'assets/levels.json', true);
    };
    TitleState.prototype.create = function () {
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
        var points = [
            new Phaser.Point(off + d, 0),
            new Phaser.Point(-d + off, d),
            new Phaser.Point(-d + off, -d)
        ];
        this.playBtnTri.drawTriangle(points, false);
        this.game.add.tween(this.playBtnTri.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true, 400, 0, false);
        this.playBtnTri.hitArea = new Phaser.Circle(0, 0, w);
        this.playBtnTri.inputEnabled = true;
        this.playBtnTri.events.onInputDown.add(this.playClicked, this);
    };
    TitleState.prototype.playClicked = function (data) {
        var _this = this;
        console.log('BAM!!');
        this.game.add.tween(this.playBtnTri.scale).to({ x: 0, y: 0 }, 1000, Phaser.Easing.Elastic.In, true, 0, 0, false);
        this.game.add.tween(this.playBtnCircle.scale).to({ x: 2, y: 2 }, 1500, Phaser.Easing.Elastic.In, true, 500, 0, false);
        var h = this.logoDotClean.height;
        var w = this.logoDotClean.width;
        var bgCircle = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY + h / 2);
        bgCircle.scale.set(0, 0);
        bgCircle.beginFill(Global.COLOR_BG, 1.0);
        bgCircle.drawCircle(0, 0, w);
        this.game.add.tween(bgCircle.scale).to({ x: 10, y: 10 }, 1000, Phaser.Easing.Quadratic.In, true, 1000, 0, false)
            .onComplete.add(function () {
            _this.game.state.start('GameRunningState', true, false);
        }, this);
    };
    return TitleState;
})(Phaser.State);
module.exports = TitleState;
},{"./Global":9}],13:[function(require,module,exports){
var Game = require('./Game');
window.onload = function () {
    var game = new Game();
};
},{"./Game":5}]},{},[13]);
