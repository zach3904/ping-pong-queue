'use strict';

module.exports = {
    name: 'singlePlayerService',
    getSinglePlayerById: function (request, response) {
        response.send({
            single_player_pool_key: 1,
            player_key: 1,
            skill_level: 'PRO STATUS',
            match_type: 'SINGLES',
            added_dtm: '2014-02-06 14:00:00'
        });
    }
}
