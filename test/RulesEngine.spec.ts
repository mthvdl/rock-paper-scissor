import RulesEngine from '../src/RulesEngine';
import Round from '../src/Round';
import Weapon from '../src/Weapon';
import Player from '../src/Player';
import * as chai from 'chai';

describe('Round', () => {

    let rock: Weapon, paper: Weapon, scissor: Weapon, player1: Player, player2: Player, player3: Player, player4: Player, rulesEngine: RulesEngine;

    beforeEach(() => {
        rock = new Weapon('Rock', 'test.png');
        paper = new Weapon('Paper', 'test.png');
        scissor = new Weapon('Scissor', 'test.png');

        player1 = new Player('Bob', false);
        player2 = new Player('Alice', false);
        player3 = new Player('Tom', false);
        player4 = new Player('Emma', false);

        rulesEngine = new RulesEngine([rock, paper, scissor]);

        rulesEngine.addRule(rock._name, scissor._name);
        rulesEngine.addRule(paper._name, rock._name);
        rulesEngine.addRule(scissor._name, paper._name);
    });

    it('should calculate correct round result if player 1 plays rock and player 2 plays scissor', () => {

        // GIVEN
        let round = new Round([player1, player2]);

        // WHEN
        round.setPlayerWeapon(player1._name, rock._name);
        round.setPlayerWeapon(player2._name, scissor._name);
        let result = rulesEngine.getRoundResult(round);

        // THEN
        chai.expect(result[player1._name][player2._name]).to.be.equal(1);
        chai.expect(result[player2._name][player1._name]).to.be.equal(-1);
    });

    it('should calculate correct round result if player 1 does not play and player 2 plays scissor', () => {

        // GIVEN
        let round = new Round([player1, player2]);

        // WHEN
        round.setPlayerWeapon(player2._name, scissor._name);
        let result = rulesEngine.getRoundResult(round);

        // THEN
        chai.expect(result[player1._name][player2._name]).to.be.equal(-1);
        chai.expect(result[player2._name][player1._name]).to.be.equal(1);
    });

    it('should calculate correct round result if both players do not play', () => {

        // GIVEN
        let round = new Round([player1, player2]);

        // WHEN
        let result = rulesEngine.getRoundResult(round);

        // THEN
        chai.expect(result[player1._name][player2._name]).to.be.equal(0);
        chai.expect(result[player2._name][player1._name]).to.be.equal(0);
    });

    it('should calculate correct round result when more than 2 players play', () => {

        // GIVEN
        let round = new Round([player1, player2, player3, player4]);

        // WHEN
        round.setPlayerWeapon(player1._name, rock._name);
        round.setPlayerWeapon(player2._name, scissor._name);
        round.setPlayerWeapon(player3._name, paper._name);

        let result = rulesEngine.getRoundResult(round);

        // THEN
        chai.expect(result[player1._name][player2._name]).to.be.equal(1);
        chai.expect(result[player1._name][player3._name]).to.be.equal(-1);
        chai.expect(result[player1._name][player4._name]).to.be.equal(1);

        chai.expect(result[player2._name][player1._name]).to.be.equal(-1);
        chai.expect(result[player2._name][player3._name]).to.be.equal(1);
        chai.expect(result[player2._name][player4._name]).to.be.equal(1);

        chai.expect(result[player3._name][player1._name]).to.be.equal(1);
        chai.expect(result[player3._name][player2._name]).to.be.equal(-1);
        chai.expect(result[player3._name][player4._name]).to.be.equal(1);

        chai.expect(result[player4._name][player1._name]).to.be.equal(-1);
        chai.expect(result[player4._name][player2._name]).to.be.equal(-1);
        chai.expect(result[player4._name][player3._name]).to.be.equal(-1);
    });

    it('should throw error when rules are malformed', () => {

        try {
            chai.expect(rulesEngine.addRule(scissor._name, rock._name)).to.throw();
        } catch (err) {
            chai.expect(err).to.be.an.instanceof(Error);
        }
    });
});