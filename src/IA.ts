import Player from './Player'
import Weapon from './Weapon'
import { Game } from './Game'
import Round from './Round'

export default class IA {

    _game: Game;

    _interval: number;

    constructor(game: Game) {
        this._game = game;
    }

    public start() {
        let self = this;
        this._interval = setInterval(function () { self._play(); }, (this._game._timeToThink / 5) * 1000);
    }

    private _play() {
        let self = this;
        this._game._players.filter(function (elt) {
            return elt._isBot && !self._game._currentRound.hasPlayed(elt._name);
        }).forEach(function (elt) {
            // One out of two chance to play
            if (Math.random() < 0.5) {
                self._game.userInput(elt._name, self._game._weapons[Math.floor(Math.random() * self._game._weapons.length)]._name); // pick a random weapon
            }
        });
    }

    public stop() {
        clearInterval(this._interval);
    }

}