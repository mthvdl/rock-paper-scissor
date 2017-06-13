import { Game, IGameConfig } from './Game'
import Renderer from './Renderer'
import Player from './Player'
import Weapon from './Weapon'
import RulesEngine from './RulesEngine'
import * as $ from 'jquery';

class GameManager {

    static _defaultConfig: any = {
        canvasId: 'canvas', // html element id where the game is rendered
        countDown: 3, // CountDown between games
        timeToThink: 1, // Time after first player plays
        timeToRest: 3, // Time between each round where the game displays the scores
        players: [ // Game players, names must be unique
            { name: 'Bob', isBot: false },
            { name: 'Alice', isBot: true },
            { name: 'Tom', isBot: true },
            { name: 'Pat', isBot: true },
            { name: 'John', isBot: true },
            { name: 'Johnny', isBot: true },
            { name: 'Maria', isBot: true }
        ],
        weapons: [ // Weapons, names must be unique
            { name: 'Rock', img: 'rock.png' },
            { name: 'Paper', img: 'paper.png' },
            { name: 'Scissor', img: 'scissors.png' },
            { name: 'Lizard', img: 'lizard.png' },
            { name: 'Spock', img: 'spock.png' }
        ],
        rules: [ // Rules for weapons
            ['Rock', 'Scissor'], // Rock beats scissor
            ['Rock', 'Lizard'],
            ['Scissor', 'Paper'],
            ['Scissor', 'Lizard'],
            ['Paper', 'Rock'],
            ['Paper', 'Spock'],
            ['Lizard', 'Paper'],
            ['Lizard', 'Spock'],
            ['Spock', 'Rock'],
            ['Spock', 'Scissor']
        ],
        inputs: [ // Users inputs
            { user: 'Bob', weapon: 'Rock', keyCode: 65 }, // a
            { user: 'Bob', weapon: 'Paper', keyCode: 83 }, // s
            { user: 'Bob', weapon: 'Scissor', keyCode: 68 }, // d
            { user: 'Bob', weapon: 'Lizard', keyCode: 90 }, // z
            { user: 'Bob', weapon: 'Spock', keyCode: 88 } // x
        ]
    };

    _game: Game;

    _renderer: Renderer;

    public start(config: any) {

        config = $.extend(true, GameManager._defaultConfig, config);

        let players: Player[] = this._createPlayersFromConfig(config.players);
        let weapons: Weapon[] = this._createWeaponsFromConfig(config.weapons);
        let rulesEngine: RulesEngine = this._createRulesEngineFromConfig(config.rules, weapons);

        this._game = new Game({ countDown: config.countDown, timeToThink: config.timeToThink, timeToRest: config.timeToRest, players, weapons, rulesEngine });
        this._renderer = new Renderer(config.canvasId);

        this._game.addObserver(this._renderer);

        this._attachInputs(config.inputs);

        this._game.init();

        this._game.start();
    }

    public stop(config: IGameConfig) {
        this._detachInputs();
        this._game = null;
    }

    private _createPlayersFromConfig(playersConfig: any): Player[] {
        let players = [];
        for (let player of playersConfig) {
            players.push(new Player(player.name, player.isBot));
        }
        return players;
    }

    private _createWeaponsFromConfig(weaponsConfig: any): Weapon[] {
        let weapons = [];
        for (let weapon of weaponsConfig) {
            weapons.push(new Weapon(weapon.name, weapon.img));
        }
        return weapons;
    }

    private _createRulesEngineFromConfig(rules: any, weapons: Weapon[]): RulesEngine {
        let rulesEngine: RulesEngine = new RulesEngine(weapons);

        for (let rule of rules) {
            rulesEngine.addRule(rule[0], rule[1]);
        }

        return rulesEngine;
    }

    private _attachInputs(inputs: any) {

        let self = this;
        $(window).on('keyup.rps', function (e) {
            console.log(e.keyCode + ' pressed');
            let input = inputs.filter(function (elt) {
                return elt.keyCode === e.keyCode;
            })[0];

            if (input) {
                self._game.userInput(input.user, input.weapon);
            }
        })
    }

    private _detachInputs() {
        $(window).off('keypress.rps');
    }
}

export let instance = new GameManager();
