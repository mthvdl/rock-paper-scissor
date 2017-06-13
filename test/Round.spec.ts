import Round from '../src/Round';
import Player from '../src/Player';
import Weapon from '../src/Weapon';

import * as chai from 'chai';

describe('Round', () => {

    it('should set a player weapon once', () => {

        // GIVEN a round of 2 players
        let player1: Player = new Player('Bob', false);
        let player2: Player = new Player('Alice', false);
        let round = new Round([player1, player2]);
        let rock: Weapon = new Weapon('Rock', 'test.png');
        let paper: Weapon = new Weapon('Paper', 'test.png');

        // WHEN player 1 plays 2 times
        round.setPlayerWeapon(player1._name, rock._name);
        round.setPlayerWeapon(player1._name, paper._name);

        // THEN only first weapon is set
        chai.expect(round.getPlayerWeapon(player1._name)).to.be.equal(rock._name);
    });

    it('should return true if all players played', () => {

        // GIVEN a round of 2 players
        let player1: Player = new Player('Bob', false);
        let player2: Player = new Player('Alice', false);
        let round = new Round([player1, player2]);
        let rock: Weapon = new Weapon('Rock', 'test.png');
        let paper: Weapon = new Weapon('Paper', 'test.png');

        // WHEN 2 players plays
        round.setPlayerWeapon(player1._name, rock._name);
        round.setPlayerWeapon(player2._name, paper._name);

        // THEN expects allPlayerPlayed to return true
        chai.expect(round.allPlayerPlayed()).to.be.true;

    });

    it('should throw exception when a playerNumber is not correct', () => {

        // GIVEN a round of 2 players
        let player1: Player = new Player('Bob', false);
        let player2: Player = new Player('Alice', false);
        let round = new Round([player1, player2]);
        let rock: Weapon = new Weapon('Rock', 'test.png');

        // WHEN player 2 plays THEN expect exception
        try {
            chai.expect(round.setPlayerWeapon('bad uid', rock._name)).to.throw();
        } catch (err) {
            chai.expect(err).to.be.an.instanceof(RangeError);
        }

    });

});