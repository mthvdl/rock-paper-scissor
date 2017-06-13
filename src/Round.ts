import Player from './Player';

/**
 * Round class
 */
export default class Round {

    /**
     * Round players
     */
    _players: Player[];

    /** Weapons played by players */
    _playerWeapons: string[];

    /** Is round ended */
    _isEnded: boolean;

    constructor(players: Player[]) {
        this._players = players;
        this._playerWeapons = [];
        this._isEnded = false;
    }

    /**
     * Set the weapon played by the given player
     */
    public setPlayerWeapon(playerUid: string, weaponUid: string) {

        // Set weapon only if player has not already played
        if (this._playerExists(playerUid)) {
            if (!this.hasPlayed(playerUid) && !this.allPlayerPlayed()) {

                console.log('Player ' + playerUid + ' plays ' + weaponUid);

                this._playerWeapons[playerUid] = weaponUid;
            }
        }
        // throw error if user does not exist
        else {
            throw new RangeError();
        }

    }

    /**
     * Return true if playerUid is a playing player
     */
    private _playerExists(playerUid: string): boolean {
        return this._players.some(function (item) {
            return item._name === playerUid;
        });
    }

    /**
     * Return true if given player has played, false otherwise
     */
    public hasPlayed(playerUid: string): boolean {
        return this._playerWeapons[playerUid] !== undefined;
    }

    /**
     * Return true if all players played, false otherwise
     */
    public allPlayerPlayed(): boolean {
        return this._players.length === Object.keys(this._playerWeapons).length;
    }

    /**
     * Return Weapon uid for a given Player uid
     */
    public getPlayerWeapon(playerUid: string): string {
        return this._playerWeapons[playerUid];
    }
}