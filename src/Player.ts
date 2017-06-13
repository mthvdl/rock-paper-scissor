export default class Player {

    /** player's name */
    _name: string;

    /** player or computer */
    _isBot: boolean;

    /** Player score */
    _score: number;

    constructor(name: string, isBot: boolean) {
        this._name = name;
        this._isBot = isBot;
        this._score = 0;
    }

}