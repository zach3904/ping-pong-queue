'use strict';

module.exports = {
    name: 'playerService',
    getPlayerById: function (request, response) {

        var db = require('../db.js');
        db.query('SELECT $1::int AS number', ['1'], function (err, result) {
            console.log(result.rows[0].number);
        });

        response.send({
            player_key: 1,
            name: 'molsen',
            hipchat_name: '@molsen',
            email_address: 'matthewo@porch.com',
            skill_level: 'INTERMEDIATE',
            tagline: 'YeaH BuddY!'
        });
    }
}
