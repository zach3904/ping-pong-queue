'use strict';

var _ = require('underscore');
var Promise = require('promise');
var db = require('../db.js');

// This needs to move ... somewhere sharable
// Maybe read from db on app start?
var validMatchTypes = ['SINGLES', 'DOUBLES', 'ROUNDROBIN'];

module.exports = {

    name: 'matchDAO',

    getMatchById: function (matchKey) {
        if (matchKey == null) {
            var err = 'Required match_key may not be null';
            console.log('FAIL    matchDAO.getMatchById ' + err);
            return Promise.reject(err);
        }
        if (isNaN(matchKey) || matchKey < 1) {
            return Promise.reject("Invalid match key " + matchKey);
        }
        console.log('PROMISE matchDAO.getMatchById ' + matchKey);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.matches m' +
                ' LEFT JOIN ping_pong.match_queue mq ON mq.match_key = m.match_key' +
                ' LEFT JOIN ping_pong.challenges c ON c.match_key = m.match_key' +
                ' LEFT JOIN ping_pong.outcomes o ON o.match_key = m.match_key' +
                ' WHERE m.match_key = $1::bigint;',
                [matchKey], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchDAO.getMatchById " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchDAO.getMatchById " + result.rows[0]);
                        resolve(result.rows[0]);
                    }
                });
        });
    },

    createMatch: function (matchType) {
        if (matchType == null) {
            var err = 'Required match_type may not be null';
            console.log('FAIL    matchDAO.createMatch ' + err);
            return Promise.reject(err);
        }
        if (_.intersection(validMatchTypes, matchType).length == -1) {
            var err = 'Invalid match_type ' + matchType;
            console.log('FAIL    matchDAO.createMatch ' + err);
            return Promise.reject(err);
        }
        console.log('PROMISE matchDAO.createMatch ' + matchType);
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.matches (match_type) VALUES ($1::match_type) RETURNING match_key;',
                [matchType], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchDAO.createMatch " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchDAO.createMatch " + result.rows[0].match_key);
                        resolve(result.rows[0].match_key);
                    }
                });
        });
    },

    getMatchPlayers: function (matchKey) {
        console.log('PROMISE matchDAO.getMatchPlayers ' + matchKey);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.players p' +
                ' JOIN ping_pong.match_player mp ON mp.player_key = p.player_key' +
                ' WHERE mp.match_key = $1::bigint;',
                [matchKey], function (err, result) {

                    if (err) {
                        console.log("REJECT  matchDAO.getMatchPlayers " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchDAO.getMatchPlayers " + result.rows);
                        resolve(result.rows);

                        // [
                        //    {
                        //        player_key: 1,
                        //        name: 'molsen',
                        //        hipchat_name: '@molsen',
                        //        email_address: 'matthewo@porch.com',
                        //        skill_level: 'INTERMEDIATE',
                        //        tagline: 'YeaH BuddY!'
                        //    },
                        //    ...
                        // ]
                    }
                });
        });
    },

    createMatchPlayer: function (matchKey, playerKey, team) {
        console.log('PROMISE matchDAO.createMatchPlayer ' + matchKey +" " + playerKey + " " + team);
        return new Promise(function (resolve, reject) {
            db.query('INSERT into ping_pong.match_player (match_key, player_key, team) VALUES ($1::bigint, $2::bigint, $3::team) RETURNING match_player_key;',
                [matchKey, playerKey, team], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchDAO.createMatchPlayer " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchDAO.createMatchPlayer " + result.rows[0].match_player_key);
                        resolve(result.rows[0].match_player_key);
                    }
                });
        });
    }

};
