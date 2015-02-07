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
    },

    addPlayer: function (request, response) {

        var db = require('../db.js');
        db.query('INSERT INTO ping_pong.players (name, hipchat_name, email_address, skill_level, tagline) VALUES ($1::text, $2::text, $3::text, $4::skill_level, $5::text) RETURNING player_key;', ['Test Player', '@testplayer', 'testplayer@porch.com', 'BEGINNER', 'Hello World'], function (err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            response.send(result.rows[0].player_key);
            //response.sendStatus(200);
        });
    }
};
