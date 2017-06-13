import * as States from './GameState'
import { Game } from './Game'

export default class DisplayScoreState extends States.GameState {

    _timeout: number;

    start() {
        console.log('start DisplayScoreState');

        this._game.notify({ type: 'START_DISPLAY_RESULT' });
        this._game.notify({ type: 'COUNT_DOWN_CHANGED', value: 'RESULT!' });

        let self = this;

        // Calculate round result
        let result = this._game._rulesEngine.getRoundResult(this._game._currentRound);

        // Update scores
        this._game.updateScore(result);

        this._game._players.forEach(function (elt) {
            console.log(elt._name + ' score:' + elt._score);
        })

        this._game.notify({ type: 'UPDATE_ROUND', result: result });

        this._timeout = setTimeout(function () { self._game.changeState(new States.CountDownState(self._game)) }, this._game._timeToRest * 1000);
    }

    stop() {
        this._game.notify({ type: 'END_DISPLAY_RESULT' });
        clearTimeout(this._timeout);
    }

    userInput(playerId: string, weaponId: string) { }

}