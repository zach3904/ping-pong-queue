'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'outcomeDAO',

    getOutcomeById: function (outcome_key) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.outcomes WHERE outcome_key = $1::bigint',
                [outcome_key], function (err, result) {

                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(result.rows[0]);

                    // {
                    //    outcome_key: 1,
                    //    match_key: 1,
                    //    winning_team: 'CHALLENGER',
                    //    winning_score: 21,
                    //    losing_score: 19,
                    //    recorded_dtm: '2014-02-06 11:30:00'
                    // }
                });
        });
    },

    createOutcome: function (match_key, winning_team, winning_score, losing_score) {
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.outcomes (match_key, winning_team, winning_score, losing_score)' +
                ' VALUES ($1::bigint, $2::team, $3::int, $4::int) RETURNING outcome_key;',
                [match_key, winning_team, winning_score, losing_score], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result.rows[0].outcome_key);
                });
        });
    }

};
