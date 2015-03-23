/* global describe, it, before, after, beforeEach, afterEach */

var assert = require("assert");
var testSetup = require('../TestSetup');
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

        //it('should create and return a new match with the given matchType and playersWithTeams', function (done) {
        //    console.log('********************************************************************************');
        //    testCases.expectResultWithValidKey(matchResource.addMatch,
        //        ['SINGLES', testData.players],
        //        {
        //            match_type: 'SINGLES',
        //            match_players: testData.players
        //        },
        //        'match_key', done);
        //});
        //
        //it('should return an error if the given matchType is null', function (done) {
        //    console.log('********************************************************************************');
        //    testCases.expectError(matchResource.addMatch, [null, testData.players], done);
        //});
        //
        //it('should return an error if the given matchType is invalid', function (done) {
        //    console.log('********************************************************************************');
        //    testCases.expectError(matchResource.addMatch, ['BEER PONG', testData.players], done);
        //});
        // TODO create addMatchPlayer function in MatchResource
        // then call from MatchResource.addMatch
        // and move this test to describe(addMatchPlayer)
        //it('should return an error if the given match already has the max allowed players for it\'s match_type', function (done) {
        //    console.log('********************************************************************************');
        //    done(new Error('NOT IMPLEMENTED'));
        //});

    });

});
