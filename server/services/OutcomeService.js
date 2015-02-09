'use strict';

module.exports = {

    name: 'outcomeService',

    getOutcomeById: function (request, response) {
        var db = require('../db.js');
        db.query('SELECT * FROM ping_pong.outcomes WHERE outcome_key = $1::int',
            [request.query.outcome_id], function (err, result) {

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
    },

    addOutcome: function (request, response) {
        var db = require('../db.js');
        db.query('INSERT INTO ping_pong.outcomes (match_key, winning_team, winning_score, losing_score) VALUES ($1::bigint, $2::team, $3::int, $4::int) RETURNING outcome_key;',
            [request.body.match_key, request.body.winning_team, request.body.winning_score, request.body.losing_score], function (err, result) {

            if(err) {
                return console.error('error running query', err);
            }

            response.send(result.rows[0].outcome_key);
        });
    }
};
