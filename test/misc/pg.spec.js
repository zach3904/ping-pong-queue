/* global describe, it, before, after, beforeEach, afterEach */

var Promise = require("promise");
var assert = require("assert");
var db = require('../../server/db');
var matchDAO = require('../../server/daos/MatchDAO');

// PG SELECT * AND JOIN ERROR (duplicate column names in result set)
//
// In Result.inlineParser where the row constructor function is built dynamically,
// the row constructor assigns values like so:
//     this.[fieldName] = ... rows[i];
//
// When iterating over a set of results with duplicate fieldNames,
// only the resulting object will have one fieldName property,
// in the position of the first occurrence in the result set,
// with the value of the last occurrence in the result set.
// Fix this by prefixing with table names?

describe.skip('PG Tests', function () {

    var matchKey;

    beforeEach(function (done) {
        matchDAO.createMatch('SINGLES')
            .then(function (result) {
                matchKey = result.match_key;
                done();
            }, done);
    });

    it('should (and does!) return a row with a non null key when querying a single table', function (done) {
        var sql = 'SELECT * FROM ping_pong.matches m' +
            ' WHERE m.match_key = $1::bigint;';
        db.query(sql, [matchKey], function (err, result) {
            if (err) {
                console.log("TEST QUERY FAILED " + err);
                done(err);
            } else {
                console.log("TEST QUERY RETURNED " + JSON.stringify(result.rows[0]));
                if (result.rows[0].match_key == null) {
                    return done(e);
                }
                done();
            }
        });
    });

    it('should (but does not) return a row with a non null key when querying multiple tables', function (done) {
        var sql = 'SELECT * FROM ping_pong.matches m' +
            ' LEFT JOIN ping_pong.match_queue mq ON mq.match_key = m.match_key' +
            ' LEFT JOIN ping_pong.challenges c ON c.match_key = m.match_key' +
            ' LEFT JOIN ping_pong.outcomes o ON o.match_key = m.match_key' +
            ' WHERE m.match_key = $1::bigint;';
        db.query(sql, [matchKey], function (err, result) {
            if (err) {
                console.log("TEST QUERY FAILED " + err);
                done(err);
            } else {
                console.log("TEST QUERY RETURNED " + JSON.stringify(result.rows[0]));
                if (result.rows[0].match_key == null) {
                    return done(new Error("RETURNED A NULL KEY"));
                }
                done();
            }
        });
    });

});
