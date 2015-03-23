/* global describe, it, before, after, beforeEach, afterEach */

var assert = require("assert");
var testSetup = require('../TestSetup');
var testCases = require('../TestCases');
var matchPlayerDAO = require('../../server/daos/MatchPlayerDAO');

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

        describe('with matchPlayers setup', function () {

            beforeEach(function (done) {
                testSetup.setupMatchPlayers(testData)
                    .then(function (result) {
                        testData = result;
                        done();
                    }, done);
            });

            it('should return all players linked to the given match, with teams', function (done) {
                console.log('********************************************************************************');
                testCases.expectResult(
                    matchPlayerDAO.getMatchPlayers,
                    [testData.matches[0].match_key],
                    testData.getExpectedMatchPlayers(testData.matches[0].match_key),
                    done);
            });

            it('should return an error if the given match ID is null', function (done) {
                console.log('********************************************************************************');
                testCases.expectError(matchPlayerDAO.getMatchPlayers, [null], done);
            });

            it('should return an error if the given match ID is invalid', function (done) {
                console.log('********************************************************************************');
                testCases.expectError(matchPlayerDAO.getMatchPlayers, ['ABC'], done);
            });

        });

        describe('without matchPlayers setup', function () {

            it('should return an empty array if no players are linked to the given match', function (done) {
                console.log('********************************************************************************');
                testCases.expectEmptyArray(matchPlayerDAO.getMatchPlayers, [testData.matches[0].match_key], done);
            });

        });

    });

    describe('createMatchPlayer', function () {

        it('should link the given player to the given match with the given team', function (done) {
            console.log('********************************************************************************');
            testCases.expectResultWithValidKey(matchPlayerDAO.createMatchPlayer,
                [testData.matches[0].match_key, testData.players[0].player_key, 'CHALLENGER'],
                {
                    match_key: testData.matches[0].match_key,
                    player_key: testData.players[0].player_key,
                    team: 'CHALLENGER'
                }, 'match_player_key', done);
        });

        it('should return an error if the given matchKey does not exist', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchPlayerDAO.createMatchPlayer,
                [2000000000, testData.players[0].player_key, 'CHALLENGER'], done);
        });

        it('should return an error if the given playerKey does not exist', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchPlayerDAO.createMatchPlayer,
                [testData.matches[0].match_key, 2000000000, 'CHALLENGER'], done);
        });

    });
});
