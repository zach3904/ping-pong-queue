'use strict';

var Promise = require('promise');
var db = require('../db.js');

module.exports = {

    name: 'matchQueueDAO',

    getQueuedMatchById: function (matchQueueKey) {
        if (matchQueueKey == null || isNaN(matchQueueKey)) {
            return Promise.reject("Invalid or missing matchKey " + matchQueueKey);
        }
        console.log("PROMISE matchQueueDAO.getQueuedMatchById " + matchQueueKey);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.match_queue WHERE match_queue_key = $1::bigint',
                [matchQueueKey], function (err, result) {

                    if (err) {
                        console.log("REJECT  matchQueueDAO.getQueuedMatchById " + err);
                        reject(err);
                        return;
                    }

                    var queuedMatch = null;
                    if (result.rows.length > 0) {
                        queuedMatch = result.rows[0];
                    }
                    
                    console.log("RESOLVE  matchQueueDAO.getQueuedMatchById " + JSON.stringify(queuedMatch));
                    resolve(queuedMatch);

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

    queueMatch: function (matchKey) {
        if (matchKey == null || isNaN(matchKey)) {
            return Promise.reject("Invalid or missing matchKey " + matchKey);
        }
        console.log("PROMISE matchQueueDAO.queueMatch " + matchKey);
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.match_queue (match_key) VALUES ($1::bigint) RETURNING *;',
                [matchKey], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchQueueDAO.queueMatch " + err);
                        reject(err);
                        return;
                    }
                    console.log("RESOLVE matchQueueDAO.queueMatch " + JSON.stringify(result.rows[0]));
                    resolve(result.rows[0]);
                });
        });
    },

    getNextMatch: function () {
        console.log("PROMISE matchQueueDAO.getNextMatch");
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.match_queue WHERE started_dtm IS NULL AND canceled_dtm IS NULL ORDER BY queued_dtm ASC LIMIT 1;',
                [], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchQueueDAO.getNextMatch " + err);
                        reject(err);
                        return;
                    }
                    var queuedMatch = null;
                    if (result.rows.length > 0) {
                        queuedMatch = parseInt(result.rows[0]);
                    }
                    console.log("RESOLVE matchQueueDAO.getNextMatch " + queuedMatch);
                    resolve(queuedMatch);
                });
        });
    },

    getMatches: function () {
        console.log("PROMISE matchQueueDAO.getMatches");
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.match_queue WHERE started_dtm IS NULL AND canceled_dtm IS NULL ORDER BY queued_dtm ASC LIMIT 50;',
                [], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchQueueDAO.getMatches " + err);
                        reject(err);
                        return;
                    }
                    var pendingMatches = null;
                    var pendingMatchCount = 0;
                    if (result.rows.length > 0) {
                        pendingMatches = result.rows;
                        pendingMatchCount = result.rows.length;
                    }
                    console.log("RESOLVE matchQueueDAO.getMatches " + pendingMatchCount + " rows");
                    resolve(pendingMatches);
                });
        });
    },

    cancelMatch: function (matchKey) {
            if (matchKey == null || isNaN(matchKey)) {
                return Promise.reject("Invalid or missing matchKey " + matchKey);
            }
            console.log("PROMISE matchQueueDAO.cancelMatch " + matchKey);
            return new Promise(function (resolve, reject) {
                db.query('UPDATE ping_pong.match_queue SET canceled_dtm = now() WHERE match_key = $1::bigint;',
                    [matchKey], function (err, result) {
                        if (err) {
                            console.log("REJECT  matchQueueDAO.cancelMatch " + err);
                            reject(err);
                            return;
                        }
                        console.log("RESOLVE  matchQueueDAO.cancelMatch");
                        resolve();
                    });
            });
    },

    delayMatch: function (matchKey) {
        if (matchKey == null || isNaN(matchKey)) {
            return Promise.reject("Invalid or missing matchKey " + matchKey);
        }
        console.log("PROMISE matchQueueDAO.delayMatch " + matchKey);
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ping_pong.match_queue SET queued_dtm = now() WHERE match_key = $1::bigint;',
                [matchKey], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchQueueDAO.delayMatch " + err);
                        reject(err);
                        return;
                    }
                    console.log("RESOLVE  matchQueueDAO.delayMatch");
                    resolve();
                });
        });
    },

    startMatch: function (matchKey) {
        if (matchKey == null || isNaN(matchKey)) {
            return Promise.reject("Invalid or missing matchKey " + matchKey);
        }
        console.log("PROMISE matchQueueDAO.startMatch " + matchKey);
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ping_pong.match_queue SET started_dtm = now() WHERE match_key = $1::bigint;',
                [matchKey], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchQueueDAO.startMatch " + err);
                        reject(err);
                        return;
                    }
                    console.log("RESOLVE  matchQueueDAO.startMatch");
                    resolve();
                });
        });
    },

    finishMatch: function (matchKey) {
        if (matchKey == null || isNaN(matchKey)) {
            return Promise.reject("Invalid or missing matchKey " + matchKey);
        }
        console.log("PROMISE matchQueueDAO.finishMatch " + matchKey);
        return new Promise(function (resolve, reject) {
            db.query('UPDATE ping_pong.match_queue SET completed_dtm = now() WHERE match_key = $1::bigint;',
                [matchKey], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchQueueDAO.finishMatch " + err);
                        reject(err);
                        return;
                    }
                    console.log("RESOLVE  matchQueueDAO.finishMatch");
                    resolve();
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
