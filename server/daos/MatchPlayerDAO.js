'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'matchPlayerDAO',

    getMatchPlayerById: function (matchPlayerKey) {
        if (matchPlayerKey == null) {
            var err = 'Required match_player_key may not be null';
            console.log('FAIL    matchPlayerDAO.getMatchPlayerById ' + err);
            return Promise.reject(err);
        }
        if (isNaN(matchPlayerKey) || matchPlayerKey < 1) {
            return Promise.reject("Invalid match player key " + matchPlayerKey);
        }
        console.log('PROMISE matchPlayerDAO.getMatchPlayerById ' + matchPlayerKey);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.match_players m WHERE m.match_player_key = $1::bigint;',
                [matchPlayerKey], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchPlayerDAO.getMatchPlayerById " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchPlayerDAO.getMatchPlayerById " + JSON.stringify(result.rows[0]));
                        resolve(result.rows[0]);
                    }
                });
        });
    },

    getMatchPlayers: function (matchKey) {
        if (matchKey == null) {
            var err = 'Required match_key may not be null';
            console.log('FAIL    matchDAO.getMatchById ' + err);
            return Promise.reject(err);
        }
        if (isNaN(matchKey) || matchKey < 1) {
            return Promise.reject("Invalid match key " + matchKey);
        }
        console.log('PROMISE matchPlayerDAO.getMatchPlayers ' + matchKey);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.players p' +
                ' JOIN ping_pong.match_player mp ON mp.player_key = p.player_key' +
                ' WHERE mp.match_key = $1::bigint' +
                ' ORDER BY mp.match_player_key ASC;',
                [matchKey], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchPlayerDAO.getMatchPlayers " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchPlayerDAO.getMatchPlayers " + JSON.stringify(result.rows));
                        resolve(result.rows);
                    }
                });
        });
    },

    createMatchPlayer: function (matchKey, playerKey, team) {
        if (matchKey == null) {
            var matchKeyNullErr = 'Required match_key may not be null';
            console.log('FAIL    matchDAO.createMatchPlayer ' + matchKeyNullErr);
            return Promise.reject(matchKeyNullErr);
        }
        if (isNaN(matchKey) || matchKey < 1) {
            return Promise.reject("Invalid match key " + matchKey);
        }
        if (playerKey == null) {
            var playerKeyNullErr = 'Required player_key may not be null';
            console.log('FAIL    matchDAO.createMatchPlayer ' + playerKeyNullErr);
            return Promise.reject(playerKeyNullErr);
        }
        if (isNaN(playerKey) || playerKey < 1) {
            return Promise.reject("Invalid player key " + playerKey);
        }
        console.log('PROMISE matchDAO.createMatchPlayer ' + matchKey + " " + playerKey + " " + team);
        return new Promise(function (resolve, reject) {
            db.query('INSERT into ping_pong.match_player (match_key, player_key, team) VALUES ($1::bigint, $2::bigint, $3::team) RETURNING *;',
                [matchKey, playerKey, team], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchDAO.createMatchPlayer " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchDAO.createMatchPlayer " + JSON.stringify(result.rows[0]));
                        resolve(result.rows[0]);
                    }
                });
        });
    }

};
