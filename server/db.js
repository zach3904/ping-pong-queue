'use strict';

module.exports = {
    query: function (sql, params, cb) {
        var pg = require('pg');
        var conString = "postgres://pingpong:pingpong@docker.lvh.me/pingpong";
        if (process.env.NODE_ENV == "test") {
            conString = "postgres://pingpong:pingpong@docker.lvh.me/pingpong_test";
        }
        pg.connect(conString, function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(sql, params, function(err, result) {
                // call `done()` to release the client back to the pool
                done();
                // send error/result to callback
                cb(err, result);
            });
        });
    }
};
