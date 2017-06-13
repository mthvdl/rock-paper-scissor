import * as States from './GameState'
import { Game } from './Game'
import Round from './Round'
import IA from './IA'

export default class PlayState extends States.GameState {

    _firstPlayerPlayed: boolean;

    _ia: IA;

    _timeout: number;

    start() {
        console.log('start PlayState');

        this._firstPlayerPlayed = false;

        // Start round
        this._game._currentRound = new Round(this._game._players);

        // Start IA
        this._ia = new IA(this._game);
        this._ia.start();


        this._game.notify({ type: 'COUNT_DOWN_CHANGED', value: 'PLAY!' });


    }

    stop() {
        this._ia.stop();
        this._game._currentRound._isEnded = true;
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }

    userInput(playerId: string, weaponId: string) {
        if (this._game._currentRound && !this._game._currentRound._isEnded) {

            let self = this;
            this._game._currentRound.setPlayerWeapon(playerId, weaponId);

            if (!this._firstPlayerPlayed) {

                this._firstPlayerPlayed = true;

                // End round at the end of the timeToThink
                this._timeout = setTimeout(function () { self._game.changeState(new States.DisplayScoreState(self._game)) }, this._game._timeToThink * 1000);

            } else if (this._game._currentRound.allPlayerPlayed()) {
                if (this._timeout) {
                    clearTimeout(this._timeout);
                    this._timeout = null;
                }
                self._game.changeState(new States.DisplayScoreState(self._game));
            }
        }
    }

}