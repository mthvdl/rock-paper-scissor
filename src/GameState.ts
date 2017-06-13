import { Game } from './Game'

export abstract class GameState {

    _game: Game;

    constructor(game: Game) {
        this._game = game;
    }

    abstract start();
    abstract stop();
    abstract userInput(playerId: string, weaponId: string);

}

export { default as CountDownState } from './CountDownState';
export { default as DisplayScoreState } from './DisplayScoreState';
export { default as PlayState } from './PlayState';