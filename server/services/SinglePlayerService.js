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
    }
}
