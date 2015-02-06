'use strict';

module.exports = {
    name: 'challengeService',
    getChallengeById: function (request, response) {
        response.send({
            challenge_key: 1,
            match_key: 1,
            challenge_dtm: '2014-02-06 10:15:00',
            accepted_dtm: '2014-02-06 10:30:00',
            rejected_dtm: null,
            cancelled_dtm: null
        });
    }
}
