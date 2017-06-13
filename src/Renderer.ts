import { IObserver } from './IObserver'
import { Observable } from './Observable'
import { Game } from './Game'
import Player from './Player'
import * as $ from 'jquery';

export default class Renderer implements IObserver {

    private _$canvas: JQuery;

    constructor(canvasId: string) {
        this._$canvas = $('#' + canvasId);
        let that = this;
        $(window).on('resize.renderer', function () {
            that._updatePlayersPosition();
        });
    }

    public update(src: Observable, data: any) {
        switch (data.type) {
            case 'INIT':
                this._init(<Game>src);
                break;
            case 'COUNT_DOWN_CHANGED':
                this._updateCounter(data.value);
                break;
            case 'UPDATE_ROUND':
                this._updateRound(<Game>src, data.result);
                break;
            case 'START_DISPLAY_RESULT':
                $('.player').removeClass('grayed');
                break;
            case 'END_DISPLAY_RESULT':
                $('.player').addClass('grayed');
                this._resetBorders();
                break;
        }
    }

    private _init(game: Game) {

        this._createBoard(game._players);
    }

    public destroy() {
        $(window).off('resize.renderer');
    }

    private _createCounter() {
        let $counter = $('<div/>', {
            class: 'counter'
        });
        this._$canvas.append($counter);
    }

    private _createBoard(players: Player[]) {

        let $board = $('<div/>', {
            id: 'board'
        });

        let $counter = $('<div/>', {
            id: 'counter'
        });

        let $wrapper = $('<div/>', {
            class: 'table-container full-width full-height'
        }).append(
            $('<div/>', {
                class: 'table-row full-width full-height'
            }).append(
                $('<div/>', {
                    class: 'table-cell full-width full-height valign-middle align-center'
                }).append($counter)));

        $board.append($wrapper);
        this._$canvas.append($board);

        for (let i = 0; i < players.length; i++) {
            let $playerDiv = $('<div/>', {
                id: players[i]._name,
                class: 'player'
            });

            let $playerContent = $('<div/>', {
                id: players[i]._name + '-content',
                class: 'player-content'
            });

            let $playerInfo = $('<div/>', {
                id: players[i]._name + '-info',
                class: 'player-info'
            });

            let $playerName = $('<div/>', {
                class: 'player-name'
            }).html(players[i]._name);

            let $playerScore = $('<div/>', {
                class: 'player-score'
            });

            let $playerScoreLabel = $('<span/>', {
                class: 'player-score-label'
            }).html('Score:');

            let $playerScoreValue = $('<span/>', {
                class: 'player-score-value'
            }).html('' + players[i]._score);

            $playerScore.append([$playerScoreLabel, $playerScoreValue]);
            $playerInfo.append($playerName, $playerScore);
            $playerContent.append($playerInfo);
            $playerDiv.append($playerContent);
            this._$canvas.append($playerDiv);
        }
        this._updatePlayersPosition();
    }

    private _updatePlayersPosition() {

        let PI2 = 2 * Math.PI;
        let radius = Math.min(this._$canvas.width(), this._$canvas.height()) / 2;
        let playerRadius = radius / 2.5;
        radius -= playerRadius;
        let $players = $('.player', this._$canvas);
        let self = this;

        $('#board').css({ top: (self._$canvas.innerHeight() / 2) - radius + 'px', left: (self._$canvas.innerWidth() / 2) - radius + 'px', width: radius * 2 + 'px', height: radius * 2 + 'px' });

        $('.player', this._$canvas).each(function (i) {
            let radians = (PI2 / $players.length) * i - Math.PI / 2;
            let degrees = self._degrees(radians);
            let x = self._$canvas.innerWidth() / 2 + (Math.cos(radians) * radius) - playerRadius / 2;
            let y = self._$canvas.innerHeight() / 2 + (Math.sin(radians) * radius) - playerRadius / 2;
            $(this).css({ top: y + 'px', left: x + 'px', width: playerRadius + 'px', height: playerRadius + 'px' });
            self._rotate($(this), degrees);
            self._rotate($('.player-content', $(this)), degrees * -1);
        });
    }

    private _updateRound(game: Game, result: number[][]) {

        let self = this;
        game._players.forEach(function (player, i) {
            let weaponId = game._currentRound.getPlayerWeapon(player._name);
            let $player = $('#' + player._name);

            if (weaponId) {
                let weapon = game._weapons.filter(function (elt) {
                    return elt._name === weaponId;
                })[0];

                $('#' + player._name + '-content').css('background-image', 'url( /assets/' + weapon._image + ')');
            }
            else {
                $('#' + player._name + '-content').css('background-image', 'url( /assets/no-play.png)');
            }

            // Update score
            $('.player-score-value', $player).html('' + player._score);

            // pick previous and next oponent
            let previous: Player = i === 0 ? game._players[game._players.length - 1] : game._players[i - 1];
            let next: Player = i === game._players.length - 1 ? game._players[0] : game._players[i + 1];

            self._setPlayerBorder($player, result[player._name][next._name], result[player._name][previous._name]);
        });
    }

    private _setPlayerBorder($player: JQuery, left: number, right: number) {

        let blue = 'blue';

        let colorLeft = left > 0 ? 'green' : left < 0 ? 'red' : blue;
        let colorRight = right > 0 ? 'green' : right < 0 ? 'red' : blue;

        $player.css({
            'background-image': 'linear-gradient(white, white),linear-gradient(0deg, ' + colorLeft + ' 50%, ' + colorRight + ' 50%)'
        });
    }

    private _resetBorders() {
        $('.player').each(function () {
            $(this).css({
                'background-image': 'linear-gradient(white, white),linear-gradient(0deg, #ccc 50%, #ccc 50%)'
            });
        });
    }

    private _updateCounter(counter: number) {
        $('#counter').html('' + counter);
    }

    // UTILITIES
    // Converts from degrees to radians.
    private _radians(degrees) {
        return degrees * Math.PI / 180;
    };

    // Converts from radians to degrees.
    private _degrees(radians) {
        return radians * 180 / Math.PI;
    };

    private _rotate(elt: JQuery, degrees: number) {
        elt.css({
            '-webkit-transform': 'rotate(' + degrees + 'deg)',
            '-moz-transform': 'rotate(' + degrees + 'deg)',
            '-ms-transform': 'rotate(' + degrees + 'deg)',
            'transform': 'rotate(' + degrees + 'deg)'
        });
    }

}