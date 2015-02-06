'use strict';

module.exports = {
    name: 'outcomeService',
    getOutcomeById: function (request, response) {

        var db = require('../db.js');
        db.query('SELECT * FROM ping_pong.outcomes WHERE outcome_key = $1::int', ['1'], function (err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            response.send(result.rows[0]);
            //response.send({
            //    outcome_key: 1,
            //    match_key: 1,
            //    winning_team: 'CHALLENGER',
            //    winning_score: 21,
            //    losing_score: 19,
            //    recorded_dtm: '2014-02-06 11:30:00'
            //});
        });
    }
}
