'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'challengeDAO',

    getChallengeById: function (challenge_key) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.challenges WHERE challenge_key = $1::bigint',
                [challenge_key], function (err, result) {

                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(result.rows[0]);

                    // {
                    //    challenge_key: 1,
                    //    match_key: 1,
                    //    challenge_dtm: '2014-02-06 10:15:00',
                    //    accepted_dtm: '2014-02-06 10:30:00',
                    //    rejected_dtm: null,
                    //    canceled_dtm: null
                    // }
                });
        });
    },

    createChallenge: function (match_key) {
        //TODO: NOT WORKING
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.challenges (match_key) VALUES ($1::bigint) RETURNING challenge_key;',
                [match_key], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result.rows[0].challenge_key);
                });
        });
    },

    acceptChallenge: function (challenge_key) {
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ping_pong.challenges SET accepted_dtm=now() WHERE challenge_key = $1::bigint;',
                [challenge_key], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    },

    rejectChallenge: function (challenge_key) {
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ping_pong.challenges SET rejected_dtm=now() WHERE challenge_key = $1::bigint;',
                [challenge_key], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    },

    cancelChallenge: function (challenge_key) {
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ping_pong.challenges SET canceled_dtm=now() WHERE challenge_key = $1::bigint;',
                [challenge_key], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }

};
