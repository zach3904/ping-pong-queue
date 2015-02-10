'use strict';

module.exports = {

    name: 'playerDAO',

    getPlayerById: function (player_key) {
        var db = require('../db.js');
        db.query('SELECT * FROM ping_pong.players WHERE player_key = $1::int',
            [player_key], function (err, result) {

                if (err) {
                    return console.error('error running query', err);
                }

                response.send(result.rows[0]);
                //response.send({
                //    player_key: 1,
                //    name: result.rows[0].name,
                //    hipchat_name: result.rows[0].hipchat_name,
                //    email_address: result.rows[0].email_address,
                //    skill_level: result.rows[0].skill_level,
                //    tagline: result.rows[0].tagline
                //});
            });
    },

    getPlayerByAny: function (criteria, params) {

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
                query += criteria[i].column_name + '=$' + i + '::' + criteria[i].data_type;
            }
        }

        var db = require('../db.js');

        db.query(query, params, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            return result.rows[0];
        });
    },

    searchPlayers: function (query) {
        var db = require('../db.js');
        db.query('SELECT' +
            '   player_key,' +
            '   (name ILIKE \'%$1::text%\') AS matched_on_name' +
            '   (hipchat_name ILIKE \'%$1::text%\') AS matched_on_hipchat_name' +
            '   (email_address ILIKE \'%$1::text%\') AS matched_on_email_address' +
            ' FROM ping_pong.players' +
            ' WHERE name ILIKE \'%$1::text%\'' +
            '   OR hipchat_name ILIKE \'%$1::text%\'' +
            '   OR email_address ILIKE \'%$1::text%\'',
            [query], function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                return result.rows;
            });
    },

    addPlayer: function (player) {
        var db = require('../db.js');
        db.query('INSERT INTO ping_pong.players (name, hipchat_name, email_address, skill_level, tagline) VALUES ($1::text, $2::text, $3::text, $4::skill_level, $5::text) RETURNING player_key;',
            [player.name, player.hipchat_name, player.email_address, player.skill_level, player.tagline], function (err, result) {

                if (err) {
                    return console.error('error running query', err);
                }

                return result.rows[0].player_key;
            });
    },

    updatePlayer: function (player) {
        var db = require('../db.js');
        db.query('UPDATE ping_pong.players (name, hipchat_name, email_address, skill_level, tagline) VALUES ($1::text, $2::text, $3::text, $4::skill_level, $5::text) WHERE player_key = $1::int;',
            [player.name, player.hipchat_name, player.email_address, player.skill_level, player.tagline], function (err, result) {

                if (err) {
                    return console.error('error running query', err);
                }

                return result.rows[0].player_key;
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
