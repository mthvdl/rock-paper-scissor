import * as States from './GameState'
import { Game } from './Game'

export default class CountDownState extends States.GameState {

    _timeout: number;

    _countDown: number;

    start() {
        console.log('start CountDownState');
        this._countDown = this._game._countDown;
        this._updateCounter();
    }

    private _updateCounter() {
        console.log(this._countDown + '...');
        this._game.notify({ type: 'COUNT_DOWN_CHANGED', value: this._countDown });

        if (this._countDown <= 0) {
            this._game.changeState(new States.PlayState(this._game));
        } else {
            this._countDown--;
            let self = this;
            this._timeout = setTimeout(function () { self._updateCounter(); }, 1000);
        }


    }

    stop() {
        clearTimeout(this._timeout);
    }

    userInput(playerId: string, weaponId: string) { }

}