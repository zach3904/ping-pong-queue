/* global describe, it, before, after, beforeEach, afterEach */

var assert = require("assert");
var testSetup = require('../test/TestSetup');
var testCases = require('../test/TestCases');
var matchDAO = require('../server/daos/MatchPlayerDAO');

var testData;

describe('MatchPlayerDAO', function () {

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

    describe('getMatchPlayers', function () {

        it('should return all players linked to the given match, split into multiple arrays by team', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(
                matchDAO.getMatchPlayers,
                [testData.matches[0].match_key],
                {
                    'CHALLENGER': [
                        testData.players[0]
                    ],
                    'CHALLENGED': [
                        testData.players[1]
                    ]
                },
                done);
        });

        it('should return an empty object if no players are linked to the given match', function (done) {
            console.log('********************************************************************************');
            done(new Error('NOT IMPLEMENTED'));
        });

        it('should return an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.getMatchPlayers, [null], done);
        });

        it('should return an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.getMatchPlayers, ['ABC'], done);
        });
    });

    describe('createMatchPlayer', function () {

        it('should link the given player to the given match with the given team', function (done) {
            console.log('********************************************************************************');
            testCases.expectValidKey(matchDAO.createMatchPlayer,
                [testData.matches[0].match_key, testData.players[0].player_key, 'CHALLENGER'], done);
        });

        it('should return an error if the given matchKey does not exist', function (done) {
            console.log('********************************************************************************');
            testSetup.expectError(matchDAO.createMatchPlayer,
                [2000000000, testData.players[0].player_key, 'CHALLENGER'], done);
        });

        it('should return an error if the given playerKey does not exist', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchDAO.createMatchPlayer,
                [testData.matches[0].match_key, 2000000000, 'CHALLENGER'], done);
        });

        // TODO create addMatchPlayer function in MatchResource
        // call the resource method from addMatch instead of the dao method
        // move this test to MatchResourceTest
        it('should return an error if the given match already has the max allowed players for it\'s match_type', function (done) {
            console.log('********************************************************************************');
            done(new Error('NOT IMPLEMENTED'));
        });

    });
});
