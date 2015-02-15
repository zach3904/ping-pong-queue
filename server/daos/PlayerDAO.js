'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'playerDAO',

    getPlayerById: function (playerKey) {
        console.log("PROMISE playerDAO.getPlayerById " + playerKey);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.players WHERE player_key = $1::bigint',
                [playerKey], function (err, result) {

                    if (err) {
                        console.log("REJECT  playerDAO.getPlayerById " + err);
                        reject(err);
                    }

                    console.log("RESOLVE  playerDAO.getPlayerById " + JSON.stringify(result.rows[0]));
                    resolve(result.rows[0]);

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
        console.log("PROMISE playerDAO.getPlayerByAny " + JSON.stringify(criteria) + " " + JSON.stringify(params));

        if (criteria.length != params.length) {
            console.log('Error in PlayerDAO.getPlayerByAny: criteria length must match params length');
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

        return new Promise(function (resolve, reject) {
            db.query(query, params, function (err, result) {
                if (err) {
                    console.log("REJECT  playerDAO.getPlayerByAny " + err);
                    reject(err);
                }
                console.log("RESOLVE  playerDAO.getPlayerByAny " + JSON.stringify(result.rows[0]));
                resolve(result.rows[0]);
            });
        });
    },

    searchPlayers: function (query) {
        console.log("PROMISE playerDAO.searchPlayers " + query);
        return new Promise(function (resolve, reject) {

            var queryStr = 'SELECT' +
                '   player_key,' +
                '   (name ILIKE \'%$1::text%\') AS matched_on_name,' +
                '   (hipchat_name ILIKE \'%$1::text%\') AS matched_on_hipchat_name,' +
                '   (email_address ILIKE \'%$1::text%\') AS matched_on_email_address' +
                ' FROM ping_pong.players' +
                ' WHERE name ILIKE \'%$1::text%\'' +
                '   OR hipchat_name ILIKE \'%$1::text%\'' +
                '   OR email_address ILIKE \'%$1::text%\'';

            //console.log(queryStr);

            db.query(queryStr, [query], function (err, result) {
                if (err) {
                    console.log("REJECT  playerDAO.searchPlayers " + err);
                    reject(err);
                }
                console.log("RESOLVE  playerDAO.searchPlayers " + JSON.stringify(result.rows));
                resolve(result.rows);
            });
        });
    },

    addPlayer: function (player) {
        console.log("PROMISE playerDAO.addPlayer " + JSON.stringify(player));
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.players (name, hipchat_name, email_address, skill_level, tagline)' +
                ' VALUES ($1::text, $2::text, $3::text, $4::skill_level, $5::text) RETURNING player_key;',
                [player.name, player.hipchat_name, player.email_address, player.skill_level, player.tagline], function (err, result) {
                    if (err) {
                        console.log("REJECT  playerDAO.addPlayer " + err);
                        reject(err);
                    }
                    console.log("RESOLVE  playerDAO.addPlayer " + result.rows[0].player_key);
                    resolve(result.rows[0].player_key);
                });
        });
    },

    updatePlayer: function (player) {
        console.log("PROMISE playerDAO.updatePlayer " + JSON.stringify(player));
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ping_pong.players (name, hipchat_name, email_address, skill_level, tagline)' +
                ' VALUES ($1::text, $2::text, $3::text, $4::skill_level, $5::text) WHERE player_key = $1::bigint; RETURNING *',
                [player.name, player.hipchat_name, player.email_address, player.skill_level, player.tagline], function (err, result) {
                    if (err) {
                        console.log("REJECT  playerDAO.updatePlayer " + err);
                        reject(err);
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
