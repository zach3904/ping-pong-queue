'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'singlePlayerDAO',

    getSinglePlayerById: function (single_player_key) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.single_player_pool WHERE player_key = $1::bigint',
                [single_player_key], function (err, result) {

                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(result.rows[0]);

                    // {
                    //    single_player_key: 1,
                    //    player_key: 1,
                    //    skill_level: 'PRO STATUS',
                    //    match_type: 'SINGLES',
                    //    added_dtm: '2014-02-06 14:00:00'
                    // }
                });
        });
    },

    getSinglePlayers: function () {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM single_player_pool;',
                [], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result.rows);
                });
        });
    },

    addSinglePlayer: function (player_key, match_type, skill_level) {
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.single_player_pool (player_key, match_type, skill_level) VALUES ($1::bigint, $3::match_type, $2::skill_level) RETURNING single_player_key;',
                [player_key, match_type, skill_level], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result.rows[0].single_player_key);
                });
        });
    },

    removeSinglePlayer: function (single_player_key) {
        return new Promise(function (resolve, reject) {
            db.query('DELETE FROM single_player_pool WHERE single_player_key = $1::bigint;',
                [single_player_key], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }

};
