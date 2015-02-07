'use strict';

module.exports = {

    name: 'matchQueueService',

    getMatchQueueById: function (request, response) {
        var db = require('../db.js');
        db.query('SELECT * FROM ping_pong.match_queue WHERE match_queue_key = $1::int', ['1'], function (err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            response.send(result.rows[0]);
            //response.send({
            //    match_queue_key: 1,
            //    match_key: 1,
            //    queued_dtm: '2014-02-06 10:30:00',
            //    started_dtm: '2014-02-06 10:40:00',
            //    completed_dtm: '2014-02-06 11:00:00',
            //    cancelled_dtm: null
            //});
        });
    },

    addMatchToQueue: function (request, response) {
        var db = require('../db.js');
        db.query('INSERT INTO ping_pong.match_queue (match_key) VALUES ($1::bigint) RETURNING match_queue_key;', [1], function (err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            response.send(result.rows[0].match_queue_key);
        });
    }
};
