import * as States from './GameState'
import { Observable } from './Observable'
import Player from './Player'
import Weapon from './Weapon'
import RulesEngine from './RulesEngine'
import Round from './Round'

export class Game extends Observable {

    _currentState: States.GameState;

    _players: Player[];

    _weapons: Weapon[];

    _rulesEngine: RulesEngine;

    _countDown: number;

    _timeToThink: number;

    _timeToRest: number;

    _currentRound: Round;

    constructor(config: IGameConfig) {

        super();

        this._players = config.players;

        this._weapons = config.weapons;

        this._rulesEngine = config.rulesEngine;

        this._countDown = config.countDown;

        this._timeToThink = config.timeToThink;

        this._timeToRest = config.timeToRest;

        // Init game state as countDownState
        this._currentState = new States.CountDownState(this);

    }

    public init() {
        this.notify({ type: 'INIT', game: this });
    }

    public start() {
        this._currentState.start();
    }

    public stop() {
        this._currentState.stop();
    }

    /**
     *  User input. should map a raw input to a game action normally. For simplicity, we directly map to user and weapon at game manager level
     */
    public userInput(playerId: string, weaponId: string) {
        this._currentState.userInput(playerId, weaponId);
    }

    public changeState(state: States.GameState) {
        this._currentState.stop();
        this._currentState = state;
        this._currentState.start();
    }

    public updateScore(result: number[][]) {
        let self = this;

        this._players.forEach(function (user, i) {
            // pick previous and next oponent
            let previous: Player = i === 0 ? self._players[self._players.length - 1] : self._players[i - 1];
            let next: Player = i === self._players.length - 1 ? self._players[0] : self._players[i + 1];

            // We only count victory
            if (result[user._name][previous._name] > 0) {
                user._score++;
            }
            // If next oponent equals previous oponent, edge case two oponents, only calculate score once
            if (previous !== next && result[user._name][next._name] > 0) {
                user._score++;
            }
        });
    }
}

export interface IGameConfig {
    countDown: number,
    timeToThink: number,
    timeToRest: number,
    players: Player[],
    weapons: Weapon[],
    rulesEngine: RulesEngine
}