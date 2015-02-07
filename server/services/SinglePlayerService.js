'use strict';

module.exports = {

    name: 'singlePlayerService',

    getSinglePlayerById: function (request, response) {
        var db = require('../db.js');
        db.query('SELECT * FROM ping_pong.single_player_pool WHERE player_key = $1::int', ['1'], function (err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            response.send(result.rows[0]);
            //response.send({
            //    single_player_pool_key: 1,
            //    player_key: 1,
            //    skill_level: 'PRO STATUS',
            //    match_type: 'SINGLES',
            //    added_dtm: '2014-02-06 14:00:00'
            //});
        });
    },

    addSinglePlayer: function (request, response) {
        var db = require('../db.js');
        db.query('INSERT INTO ping_pong.single_player_pool (player_key, skill_level, match_type) VALUES ($1::bigint, $2::skill_level, $3::match_type) RETURNING single_player_key;', [1, 'PRO STATUS', 'SINGLES'], function (err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            response.send(result.rows[0].single_player_key);
        });
    }
};
