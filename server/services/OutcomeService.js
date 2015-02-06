'use strict';

module.exports = {
    name: 'outcomeService',
    getOutcomeById: function (request, response) {
        response.send({
            outcome_key: 1,
            match_key: 1,
            winning_team: 'CHALLENGER',
            winning_score: 21,
            losing_score: 19,
            recorded_dtm: '2014-02-06 11:30:00'
        });
    }
}
