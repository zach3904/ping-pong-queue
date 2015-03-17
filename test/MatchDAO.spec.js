/* global describe, it, before, after, beforeEach, afterEach */

var assert = require("assert");
var testSetup = require('../test/TestSetup');
var testCases = require('../test/TestCases');
var matchDAO = require('../server/daos/MatchDAO');

var testData;

describe('MatchDAO', function () {

    beforeEach(function (done) {
        console.log('');
        console.log('********************************************************************************');
        console.log('BEGIN TEST SETUP');
        testSetup.clearAll()
            .then(testSetup.setupPlayers, done)
            .then(testSetup.setupMatches, done)
            .then(function (result) {
                testData = result;
                done();
            }, done);
    });

    describe('getMatchById', function () {

        it('should return a match if one with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(
                matchDAO.getMatchById,
                [testData.matches[0].match_key],
                testData.matches[0],
                done);
        });

        it('should return null if no match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(matchDAO.getMatchById, [2000000000], done);
        });

        it('should return an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.getMatchById, [null], done);
        });

        it('should return an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.getMatchById, ['ABC'], done);
        });
    });

    describe('getAllMatchDataByMatchId', function () {

        it('should return a match plus all associated queue data, challenges and outcomes', function (done) {
            console.log('********************************************************************************');
            // FAILING
            // If you select m.* instead the match_key is present
            // If you select more than one table, the match_key is null
            // But the match_type is set properly
            // Some problem stemming from the multi-table select
            // (but not simply related to the join because it succeeds/fails based on the SELECTED fields)
            testCases.expectResult(
                matchDAO.getAllMatchDataByMatchId,
                [testData.matches[0].match_key],
                {
                    match_key: testData.matches[0].match_key,
                    match_type: testData.matches[0].match_type,
                    match_queue_key: null,
                    queued_dtm: null,
                    started_dtm: null,
                    completed_dtm: null,
                    canceled_dtm: null,
                    challenge_key: null,
                    challenge_dtm: null,
                    accepted_dtm: null,
                    rejected_dtm: null,
                    outcome_key: null,
                    winning_team: null,
                    winning_score: null,
                    losing_score: null,
                    recorded_dtm: null
                },
                done);
        });

        it('should return null if no match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(matchDAO.getAllMatchDataByMatchId, [2000000000], done);
        });

        it('should return an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.getAllMatchDataByMatchId, [null], done);
        });

        it('should return an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.getAllMatchDataByMatchId, ['ABC'], done);
        });
    });

    describe('createMatch', function () {

        it('should create a new match with the given matchType and return the match ID', function (done) {
            console.log('********************************************************************************');
            testCases.expectValidKey(matchDAO.createMatch, ['SINGLES'])
                 .then(function (key) {
                     console.log('VALIDATE RESULT');
                     testCases.expectResult(matchDAO.getMatchById, [key],
                         {match_key: key, match_type: 'SINGLES'}, done);
                 }, function (err) {
                     done(err);
                 });
        });

        it('should return an error if the given matchType is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.createMatch, [null], done);
        });

        it('should return an error if the given matchType is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.createMatch, ['BEER PONG'], done);
        });
    });

});
