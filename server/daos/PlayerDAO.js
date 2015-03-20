'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'playerDAO',

    getPlayerById: function (playerKey) {
        // Validate input
        if (isNaN(playerKey) || playerKey < 1) {
            var errMsg = 'Invalid PlayerKey ' + playerKey;
            console.log(errMsg);
            return Promise.reject(new Error('Error in playerDAO.getPlayerById: ' + errMsg));
        }
        console.log("PROMISE playerDAO.getPlayerById " + playerKey);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.players WHERE player_key = $1::bigint',
                [playerKey], function (err, result) {

                    if (err) {
                        console.log("REJECT  playerDAO.getPlayerById " + err);
                        reject(err);
                        return;
                    }

                    var player = null;
                    if (result.rows.length > 0) {
                        player = result.rows[0]
                    }

                    console.log("RESOLVE  playerDAO.getPlayerById " + JSON.stringify(player));
                    resolve(player);

                    // {
                    //    player_key: 1,
                    //    name: result.rows[0].name,
                    //    hipchat_name: result.rows[0].hipchat_name,
                    //    email_address: result.rows[0].email_address,
                    //    skill_level: result.rows[0].skill_level,
                    //    tagline: result.rows[0].tagline
                    // }
                });
        });
    },

    getPlayerByAny: function (criteria, params) {
        // Validate input
        if (criteria == null || criteria == undefined || criteria.length < 1) {
            return Promise.reject('Error in PlayerDAO.getPlayerByAny: missing criteria')
        }
        else if (params == null || params == undefined || params.length < 1) {
            return Promise.reject('Error in PlayerDAO.getPlayerByAny: missing params');
        }
        else if (criteria.length != params.length) {
            return Promise.reject('Error in PlayerDAO.getPlayerByAny: criteria length ('
            + criteria.length + ') must match params length (' + params.length + ')');
        }

        var query = 'SELECT * FROM ping_pong.players';
        if (criteria.length > 0) {
            for (var i = 0; i < criteria.length; i++) {
                if (i == 0) {
                    query += ' WHERE '
                } else {
                    query += ' AND '
                }
                query += criteria[i].column_name + '=$' + (i + 1) + '::' + criteria[i].data_type;
            }
        }

        //console.log(query);

        console.log("PROMISE playerDAO.getPlayerByAny " + JSON.stringify(criteria) + " " + JSON.stringify(params));
        return new Promise(function (resolve, reject) {
            db.query(query, params, function (err, result) {
                if (err) {
                    console.log("REJECT  playerDAO.getPlayerByAny " + err);
                    reject(err);
                    return;
                }
                var player = null;
                if (result.rows.length > 0) {
                    if (result.rows.length > 1) {
                        var err = "Expected 0 or 1 player results; received " + result.rows.length;
                        console.log("REJECT  playerDAO.getPlayerById " + err);
                        reject(err);
                        return;
                    }
                    player = result.rows[0];
                }
                console.log("RESOLVE playerDAO.getPlayerByAny " + JSON.stringify(player));
                resolve(player);
            });
        });
    },

    searchPlayers: function (query) {
        if (query == null || typeof query != 'string' || query.length < 1) {
            return Promise.reject('Query is invalid or undefined');
        }
        console.log("PROMISE playerDAO.searchPlayers " + query);
        return new Promise(function (resolve, reject) {

            var queryStr = 'SELECT' +
                '   player_key,' +
                '   (name ILIKE $1::text) AS matched_on_name,' +
                '   (hipchat_name ILIKE $1::text) AS matched_on_hipchat_name,' +
                '   (email_address ILIKE $1::text) AS matched_on_email_address' +
                ' FROM ping_pong.players' +
                ' WHERE name ILIKE $1::text' +
                '   OR hipchat_name ILIKE $1::text' +
                '   OR email_address ILIKE $1::text';

            //console.log(queryStr);

            db.query(queryStr, ['%'+query+'%'], function (err, result) {
                if (err) {
                    console.log("REJECT  playerDAO.searchPlayers " + err);
                    reject(err);
                    return;
                }
                console.log("RESOLVE  playerDAO.searchPlayers " + JSON.stringify(result.rows));
                resolve(result.rows);
            });
        });
    },

    addPlayer: function (player) {
        if (player.name == null || typeof player.name != 'string' || player.name.length < 1) {
            return Promise.reject("Missing required player name " + player);
        }
        console.log("PROMISE playerDAO.addPlayer " + JSON.stringify(player));
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.players (name, hipchat_name, email_address, skill_level, tagline)' +
                ' VALUES ($1::text, $2::text, $3::text, $4::skill_level, $5::text) RETURNING *;',
                [player.name, player.hipchat_name, player.email_address, player.skill_level, player.tagline], function (err, result) {
                    if (err) {
                        console.log("REJECT  playerDAO.addPlayer " + err);
                        reject(err);
                        return;
                    }
                    console.log("RESOLVE  playerDAO.addPlayer " + JSON.stringify(result.rows[0]));
                    resolve(result.rows[0]);
                });
        });
    },

    updatePlayer: function (player) {
        if (player.player_key == null) {
            var err = 'Required player_key may not be null';
            console.log('FAIL    playerDAO.updatePlayer ' + err);
            return Promise.reject(err);
        }
        if (isNaN(player.player_key) || player.player_key < 1) {
            return Promise.reject("Invalid player key " + player.player_key);
        }
        if (player.name == null || typeof player.name != 'string' || player.name.length < 1) {
            return Promise.reject("Missing or invalid required player name " + JSON.stringify(player));
        }
        console.log("PROMISE playerDAO.updatePlayer " + JSON.stringify(player));
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ping_pong.players SET name=$2::text, hipchat_name=$3::text, email_address=$4::text, skill_level=$5::skill_level, tagline=$6::text WHERE player_key = $1::bigint RETURNING *',
                [player.player_key, player.name, player.hipchat_name, player.email_address, player.skill_level, player.tagline], function (err, result) {
                    if (err) {
                        console.log("REJECT  playerDAO.updatePlayer " + err);
                        reject(err);
                        return;
                    }
                    console.log("RESOLVE  playerDAO.updatePlayer " + JSON.stringify(result.rows[0]));
                    resolve(result.rows[0]);
                });
        });
    },

    getMatchHistory: function (player_key) {
        console.log('getMatchHistory is not implemented');
    },

    getCompletedMatchCount: function (player_key) {
        console.log('getCompletedMatchCount is not implemented');
    },

    getPlayerRecord: function (player_key) {
        console.log('getPlayerRecord is not implemented');
    }

};
