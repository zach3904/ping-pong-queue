/* global describe, it, before, after, beforeEach, afterEach */

var _ = require("underscore");
var assert = require("assert");
var testSetup = require('../TestSetup');
var testValidators = require('../TestValidators');
var testCases = require('../TestCases');
var matchResource = require('../../server/resources/MatchResource');

var testData;

describe('MatchResource', function () {

    beforeEach(function (done) {
        console.log('');
        console.log('********************************************************************************');
        console.log('BEGIN TEST SETUP');

        testSetup.clearAll()
            .then(testSetup.setupPlayers, done)
            .then(function (result) {
                testData = result;
                done();
            }, done);
    });

    describe('getMatchById', function () {

        beforeEach(function (done) {
            testSetup.setupMatches(testData)
                .then(function (result) {
                    testData = result;
                    done();
                }, done);
        });

        it('should return a match (with players? with all other data?) if a match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(matchResource.getMatchById,
                [testData.matches[0].match_key],
                testData.matches[0],
                done);
        });

        it('should return null if no match with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(matchResource.getMatchById, [2000000000], done);
        });

        it('should return an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchResource.getMatchById, [], done);
        });

        it('should return an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchResource.getMatchById, ['ABC'], done);
        });
    });

    describe('addMatch', function () {

        // age old question: when to return ids vs full entities
        it('should create and return a new match and matchPlayers with the given matchType and players with teams', function (done) {
            var playerIds = _.pluck(testData.players, 'player_key');
            var playerIdsWithTeams = [];
            playerIdsWithTeams.push({player_key: playerIds[0], team: 'CHALLENGER'});
            playerIdsWithTeams.push({player_key: playerIds[1], team: 'CHALLENGED'});
            console.log('********************************************************************************');
            matchResource.addMatch('SINGLES', playerIdsWithTeams)
                .then(function (result) {
                    testValidators.expectSubsetMatch(result, {match_type: 'SINGLES'});
                    testValidators.expectValidKey(result.match_key, 'match_key');
                    for (var i = 0; i < result.match_players.length; i++) {
                        var expectedMatchPlayer = playerIdsWithTeams[i];
                        testValidators.expectSubsetMatch(result.match_players[i], expectedMatchPlayer);
                        testValidators.expectValidKey(result.match_players[i].match_player_key, 'match_player_key');
                    }
                    done();
                }, done);
        });

        it('should return an error if the given matchType is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchResource.addMatch, [null, testData.players], done);
        });

        it('should return an error if the given matchType is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(matchResource.addMatch, ['BEER PONG', testData.players], done);
        });

        it('should return an error if given fewer than the expected number of players for the given match_type', function (done) {
            var playerIds = _.pluck(testData.players, 'player_key');
            var playerIdsWithTeams = [];
            playerIdsWithTeams.push({player_key: playerIds[0], team: 'CHALLENGER'});
            console.log('********************************************************************************');
            testCases.expectError(matchResource.addMatch, ['SINGLES', playerIdsWithTeams], done);
        });

        it('should return an error if given more than the expected number of players for the given match_type', function (done) {
            var playerIds = _.pluck(testData.players, 'player_key');
            var playerIdsWithTeams = [];
            playerIdsWithTeams.push({player_key: playerIds[0], team: 'CHALLENGER'});
            playerIdsWithTeams.push({player_key: playerIds[1], team: 'CHALLENGED'});
            playerIdsWithTeams.push({player_key: playerIds[2], team: 'CHALLENGED'});
            console.log('********************************************************************************');
            testCases.expectError(matchResource.addMatch, ['SINGLES', playerIdsWithTeams], done);
        });

    });

});
