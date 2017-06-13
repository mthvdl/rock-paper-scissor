import Round from './Round';
import Weapon from './Weapon';

export default class RulesEngine {

    /** Rules matrix */
    _rules: number[][];

    constructor(weapons: Weapon[]) {
        this._initRulesMatrix(weapons);
    }

    /** zero filled matrix */
    private _initRulesMatrix(weapons: Weapon[]) {

        this._rules = [];
        for (let i of weapons) {
            this._rules[i._name] = [];
            for (let j of weapons) {
                this._rules[i._name][j._name] = 0;
            }
        }
    }

    /**
     * Add rule to the RulesEngine
     */
    public addRule(winnerWeaponUid: string, loserWeaponUid: string) {

        /** Add rule only if valid weapons uids */
        if (this._rules[winnerWeaponUid] !== undefined && this._rules[loserWeaponUid] !== undefined) {

            if (this._rules[loserWeaponUid][winnerWeaponUid] === 0) {
                this._rules[winnerWeaponUid][loserWeaponUid] = 1;
            }
            else {
                throw new Error('New rule is violating another rule');
            }

        } else {
            throw new RangeError();
        }
    }

    public getRoundResult(round: Round) {

        let result = [];
        for (let i = 0; i < round._players.length; i++) {

            let player1Uid = round._players[i]._name;
            let player1WeaponUid = round.getPlayerWeapon(player1Uid);

            // Init result for player i if not exist
            if (!result[player1Uid]) {
                result[player1Uid] = [];
            }

            for (let j = i + 1; j < round._players.length; j++) {


                let player2Uid = round._players[j]._name;
                let player2WeaponUid = round.getPlayerWeapon(player2Uid);

                // Init result for player j if not exist
                if (!result[player2Uid]) {
                    result[player2Uid] = [];
                }

                let player1Result = 0;

                // Handling round not played by players
                if (!player1WeaponUid || !player2WeaponUid) {

                    // Player 1 not played but player 2 did
                    if (!player1WeaponUid && player2WeaponUid) {
                        player1Result = -1;
                    }
                    // Player 2 not played but player 1 did
                    else if (player1WeaponUid && !player2WeaponUid) {
                        player1Result = 1;
                    }

                    // Last case result to a draw, do nothing
                }
                // Calculate result
                else {
                    player1Result = this._rules[player1WeaponUid][player2WeaponUid] - this._rules[player2WeaponUid][player1WeaponUid];
                }

                // Save result
                result[player1Uid][player2Uid] = player1Result;
                result[player2Uid][player1Uid] = player1Result * -1;
            }
        }



        return result;
    }
}