'use strict';

module.exports = {
    name: 'matchService',
    getMatchById: function (request, response) {
        response.send({
            match_key: 1,
            players: [
                {
                    player_key: 1,
                    name: 'molsen',
                    hipchat_name: '@molsen',
                    email_address: 'matthewo@porch.com',
                    skill_level: 'INTERMEDIATE',
                    tagline: 'YeaH BuddY!'
                },
                {
                    player_key: 1,
                    name: 'molsen',
                    hipchat_name: '@molsen',
                    email_address: 'matthewo@porch.com',
                    skill_level: 'INTERMEDIATE',
                    tagline: 'YeaH BuddY!'
                }
            ]
        });
    }
}
