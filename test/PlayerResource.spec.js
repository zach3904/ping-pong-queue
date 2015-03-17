/* global describe, it, before, after, beforeEach, afterEach */

var assert = require("assert");
var testSetup = require('../test/TestSetup');
var testCases = require('../test/TestCases');
var playerResource = require('../server/resources/PlayerResource');

var testData;

describe('PlayerResource', function () {

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

    describe('getPlayerById', function () {

        it('should return a player if a player with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerResource.getPlayerById,
                [testData.players[0].player_key],
                testData.players[0],
                done);
        });

        it('should return null if no players with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(playerResource.getPlayerById, [2000000000], done);
        });

        it('should return an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerResource.getPlayerById, [], done);
        });

        it('should return an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerResource.getPlayerById, ['ABC'], done);
        });
    });

    describe('getPlayerByAny', function () {

        it('should return the player with the matching (unique) name', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerResource.getPlayerByAny,
                [
                    {name: testData.players[0].name}
                ],
                testData.players[0],
                done);
        });

        it('should return the player with the matching (unique) hipchat_name', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerResource.getPlayerByAny,
                [
                    {hipchat_name: testData.players[0].hipchat_name}
                ],
                testData.players[0],
                done);
        });

        it('should return the player with the matching (unique) email_address', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerResource.getPlayerByAny,
                [
                    {email_address: testData.players[0].email_address}
                ],
                testData.players[0],
                done);
        });

        it('should return null if no players are found', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(playerResource.getPlayerByAny, [
                {
                    name: 'VALUE_SHOULD_NOT_EXIST'
                }], done);
        });

        it('should return null if no players are found', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(playerResource.getPlayerByAny, [
                {
                    hipchat_name: 'VALUE_SHOULD_NOT_EXIST'
                }], done);
        });

        it('should return null if no players are found', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(playerResource.getPlayerByAny, [
                {
                    email_address: 'VALUE_SHOULD_NOT_EXIST'
                }], done);
        });

        it('should return null if no players are found', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(playerResource.getPlayerByAny, [
                {
                    name: 'VALUE_SHOULD_NOT_EXIST',
                    hipchat_name: 'VALUE_SHOULD_NOT_EXIST',
                    email_address: 'VALUE_SHOULD_NOT_EXIST'
                }], done);
        });

        it('should return an error if the player request is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerResource.getPlayerByAny, [], done);
        });

        it('should return an error if the player request contains non unique player properties', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerResource.getPlayerByAny, [{
                name: testData.players[0].name,
                skill_level: 'INTERMEDIATE'
            }], done);
        });

        it('should return an error if player request contains unknown properties', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerResource.getPlayerByAny, [{
                name: testData.players[0].name,
                blood_type: 'Z+'
            }], done);
        });
    });

    describe('searchPlayers', function () {
        // Black-box: Nothing to test
        // Gray-box: Just test that it calls the DAO
    });

    describe('addPlayer', function () {
        // Black-box: Nothing to test
        // Gray-box: Just test that it calls the DAO
    });

    describe('updatePlayer', function () {
        // Black-box: Nothing to test
        // Gray-box: Just test that it calls the DAO
    });

    describe('resolvePlayers', function () {

        it('should return an array of players with size equal to the size of the given player request array', function (done) {
            console.log('********************************************************************************');
            var playersRequest = [{name: testData.players[0].name}, {name: testData.players[1].name}];
            playerResource.resolvePlayers(playersRequest)
                .then(function (players) {
                    try {
                        assert(players != null);
                        assert(players instanceof Array);
                        assert(players.length == playersRequest.length);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });

        it('should return an error if more than one player request resolves to the same player', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerResource.resolvePlayers, [
                {name: 'molsen'},
                {hipchat_name: '@molsen'}
            ], done);
        });

        it('should return an error if any player request does not contain at least one unique identifier', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerResource.resolvePlayers, [
                {tagline: 'Tag line is not a unique identifier (nor is it a searchable field), so this should fail'}
            ], done);
        });

        it('should return an error if creating a player fails', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerResource.resolvePlayers, [
                {
                    name: 'PLAYER NAME THAT DOES NOT EXIST',
                    skill_level: 'INVALID SKILL LEVEL'
                }
            ], done);
        });
    });
});
