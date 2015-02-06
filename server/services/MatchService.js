'use strict';

module.exports = {
    name: 'matchService',
    getMatchById: function (request, response) {

        var db = require('../db.js');
        db.query('SELECT * FROM ping_pong.matches WHERE match_key = $1::int', ['1'], function (err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            response.send(result.rows[0]);
            //response.send({
            //    match_key: 1,
            //    players: [
            //        {
            //            player_key: 1,
            //            name: 'molsen',
            //            hipchat_name: '@molsen',
            //            email_address: 'matthewo@porch.com',
            //            skill_level: 'INTERMEDIATE',
            //            tagline: 'YeaH BuddY!'
            //        },
            //        {
            //            player_key: 1,
            //            name: 'molsen',
            //            hipchat_name: '@molsen',
            //            email_address: 'matthewo@porch.com',
            //            skill_level: 'INTERMEDIATE',
            //            tagline: 'YeaH BuddY!'
            //        }
            //    ]
            //});
        });
    }
}
