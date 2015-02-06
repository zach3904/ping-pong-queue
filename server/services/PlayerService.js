'use strict';

module.exports = {
    name: 'playerService',
    getPlayerById: function (request, response) {

        var db = require('../db.js');
        db.query('SELECT * FROM ping_pong.players WHERE player_key = $1::int', ['1'], function (err, result) {
            if(err) {
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

    }
};
