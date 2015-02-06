'use strict';

module.exports = {
    name: 'playerService',
    getPlayerById: function (request, response) {
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
