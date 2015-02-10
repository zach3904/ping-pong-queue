'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'matchDAO',

    getMatchById: function (match_key) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.matches m' +
                ' LEFT JOIN ping_pong.match_queue mq ON mq.match_key = m.match_key' +
                ' LEFT JOIN ping_pong.challenge c ON c.match_key = m.match_key' +
                ' LEFT JOIN ping_pong.outcomes o ON o.match_key = m.match_key' +
                ' WHERE m.match_key = $1::bigint;',
                [match_key], function (err, result) {

                    if (err) {
                        reject(err);
                    }

                    resolve(result.rows[0]);
                });
        });
    },

    createMatch: function () {
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.matches VALUES (default) RETURNING match_key;',
                [], function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    resolve(result.rows[0].match_key);
                });
        });
    },

    getMatchPlayers: function (match_key) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.players p' +
                ' JOIN ping_pong.match_players mp ON mp.player_key = p.player_key' +
                ' WHERE mp.match_key = $1::bigint;',
                [match_key], function (err, result) {

                    if (err) {
                        reject(err);
                    }

                    resolve(result.rows[0]);

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
                });
        });
    },

    createMatchPlayer: function (match_key, player_key, team) {
        return new Promise(function (resolve, reject) {
            db.query('INSERT into ping_pong.match_players (match_key, player_key, team) VALUES ($1::bigint, $2::bigint, $3::team) RETURNING match_player_key;',
                [match_key, player_key, team], function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    resolve(result.rows.match_player_key);
                });
        });
    }

};
