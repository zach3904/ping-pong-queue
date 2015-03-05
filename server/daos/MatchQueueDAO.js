'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'matchQueueDAO',

    getQueuedMatchById: function (match_queue_key) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.match_queue WHERE match_queue_key = $1::bigint',
                [match_queue_key], function (err, result) {

                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(result.rows[0]);

                    // {
                    //    match_queue_key: 1,
                    //    match_key: 1,
                    //    queued_dtm: '2014-02-06 10:30:00',
                    //    started_dtm: '2014-02-06 10:40:00',
                    //    completed_dtm: '2014-02-06 11:00:00',
                    //    canceled_dtm: null
                    // }
                });
        });
    },

    getPendingMatches: function () {
        console.log('getPendingMatches is not implemented');
        // SELECT * FROM match_queue WHERE started_dtm IS NULL AND canceled_dtm IS NULL ORDER BY queued_dtm ASC LIMIT 50;
    },

    delayMatch: function (match_key) {
        console.log('delayMatch is not implemented');
        // UPDATE match_queue SET queued_dtm = now() WHERE match_key = ?;
    },

    queueMatch: function (match_key) {
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.match_queue (match_key) VALUES ($1::bigint) RETURNING match_queue_key;',
                [match_key], function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result.rows[0].match_queue_key);
                });
        });
    },


    getEstimatedMatchTime: function (match_queue_key) {
        console.log('getEstimatedMatchTime is not implemented');
        // select current match state
        // select count of matches queued before the given match
        // return now + current match time remaining + queued matches * default match time)
    },

    getRecentMatches: function () {
        console.log('getRecentMatches is not implemented');
        // SELECT * FROM match_queue WHERE completed_dtm IS NOT NULL ORDER BY completed_dtm DESC LIMIT 10;
    }

};
