'use strict';

module.exports = {

    name: 'challengeService',

    getChallengeById: function (request, response) {
        var db = require('../db.js');
        db.query('SELECT * FROM ping_pong.challenges WHERE challenge_key = $1::int',
            [request.challenge_id], function (err, result) {

            if(err) {
                return console.error('error running query', err);
            }

            response.send(result.rows[0]);
            //response.send({
            //    challenge_key: 1,
            //    match_key: 1,
            //    challenge_dtm: '2014-02-06 10:15:00',
            //    accepted_dtm: '2014-02-06 10:30:00',
            //    rejected_dtm: null,
            //    cancelled_dtm: null
            //});
        });
    },

    addChallenge: function (request, response) {
        //TODO: NOT WORKING
        var db = require('../db.js');
        db.query('INSERT INTO ping_pong.challenges (match_key) VALUES ($1::bigint) RETURNING challenge_key;',
            [request.body.match_key], function (err, result) {

            if(err) {
                return console.error('error running query', err);
            }

            response.send(result.rows[0].challenge_key);
        });
    }
};
