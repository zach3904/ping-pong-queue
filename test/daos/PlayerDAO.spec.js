/* global describe, it, before, after, beforeEach, afterEach */

var assert = require("assert");
var testSetup = require('../TestSetup');
var testCases = require('../TestCases');
var playerDAO = require('../../server/daos/PlayerDAO');

var testData;

describe('PlayerDAO', function () {

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
            testCases.expectResult(playerDAO.getPlayerById,
                [testData.players[0].player_key],
                testData.players[0],
                done);
        });

        it('should return null if no players with the given ID exists', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(playerDAO.getPlayerById, [2000000000], done);
        });

        it('should return an error if the given ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.getPlayerById, [], done);
        });

        it('should return an error if the given ID is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.getPlayerById, ['ABC'], done);
        });
    });

    describe('getPlayerByAny', function () {

        it('should return the player with the matching (unique) name', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerDAO.getPlayerByAny,
                [
                    [{column_name: 'name', data_type: 'text'}],
                    [testData.players[0].name]
                ],
                testData.players[0],
                done);
        });

        it('should return the player with the matching (unique) hipchat_name', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerDAO.getPlayerByAny,
                [
                    [{column_name: 'hipchat_name', data_type: 'text'}],
                    [testData.players[0].hipchat_name]
                ],
                testData.players[0],
                done);
        });

        it('should return the player with the matching (unique) email_address', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerDAO.getPlayerByAny,
                [
                    [{column_name: 'email_address', data_type: 'text'}],
                    [testData.players[0].email_address]
                ],
                testData.players[0],
                done);
        });

        it('should return null if no players are found', function (done) {
            console.log('********************************************************************************');
            testCases.expectNoResult(playerDAO.getPlayerByAny, [
                [{
                    column_name: 'name',
                    data_type: 'text'
                }, {
                    column_name: 'hipchat_name',
                    data_type: 'text'
                }, {
                    column_name: 'email_address',
                    data_type: 'text'
                }], [
                    "VALUE_SHOULD_NOT_EXIST",
                    "VALUE_SHOULD_NOT_EXIST",
                    "VALUE_SHOULD_NOT_EXIST"
                ]], done);
        });

        it('should return an error if player request criteria is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.getPlayerByAny, [], done);
        });

        it('should return an error if player request criteria is empty', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.getPlayerByAny, [[]], done);
        });

        it('should return an error if player request params is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.getPlayerByAny, [[{
                column_name: 'name',
                data_type: 'text'
            }], null], done);
        });

        it('should return an error if player request params is empty', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.getPlayerByAny, [[{
                column_name: 'name',
                data_type: 'text'
            }], []], done);
        });
        it('should return an error if player request contains unknown criteria (causes a db error)', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.getPlayerByAny, [[{
                column_name: 'blood_type',
                data_type: 'int'
            }], [12]], done);
        });
    });

    describe('searchPlayers', function () {

        it('should return all players with an identifying property matching the query string', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerDAO.searchPlayers,
                [testData.players[0].name.substr(1, 4)],
                [{
                    player_key: testData.players[0].player_key,
                    matched_on_name: true,
                    matched_on_hipchat_name: true,
                    matched_on_email_address: false
                }],
                done);
        });

        it('should return all players with an identifying property matching the query string', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerDAO.searchPlayers,
                [testData.players[0].hipchat_name.substr(1, 4)],
                [{
                    player_key: testData.players[0].player_key,
                    matched_on_name: true,
                    matched_on_hipchat_name: true,
                    matched_on_email_address: false
                }],
                done);
        });

        it('should return all players with an identifying property matching the query string', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerDAO.searchPlayers,
                [testData.players[0].email_address.substr(1, 4)],
                [{
                    player_key: testData.players[0].player_key,
                    matched_on_name: false,
                    matched_on_hipchat_name: false,
                    matched_on_email_address: true
                }],
                done);
        });

        it('should return an empty array if query does not match any player attributes', function (done) {
            console.log('********************************************************************************');
            testCases.expectResult(playerDAO.searchPlayers, ["VALUE_SHOULD_NOT_EXIST"], [], done);
        });

        it('should return an error if player request query is empty', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.searchPlayers, [""], done);
        });

        it('should return an error if player request query is invalid', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.searchPlayers, [12], done);
        });
    });

    describe('addPlayer', function () {

        it('should insert a new player with the given name', function (done) {
            console.log('********************************************************************************');
            var playerToAdd = {name: "ADDED PLAYER " + Date.now()};
            var expectedResult = {
                name: "ADDED PLAYER " + Date.now(),
                hipchat_name:null,
                email_address:null,
                skill_level:null,
                tagline:null
            };
            testCases.expectResultWithValidKey(playerDAO.addPlayer,
                [playerToAdd], expectedResult, 'player_key', done);
        });

        it('should return an error if the player name is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.addPlayer, [{
                hipchat_name: "@VALID_HIPCHAT_NAME"
            }], done);
        });

        it('should return an error if the player name is empty', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.addPlayer, [{
                name: "",
                hipchat_name: "@VALID_HIPCHAT_NAME"
            }], done);
        });
    });

    describe('updatePlayer', function () {

        it('should update the player with the given ID to reflect the given attribute values', function (done) {
            console.log('********************************************************************************');
            var playerUpdate = {
                player_key: testData.players[0].player_key,
                name: "UPDATED_NAME",
                hipchat_name: "UPDATED_HIPCHAT_NAME",
                email_address: "UPDATED_EMAIL_ADDRESS",
                skill_level: "BEGINNER",
                tagline: "UPDATED_TAGLINE"
            };
            testCases.expectResult(playerDAO.updatePlayer, [playerUpdate], playerUpdate, done);
        });

        it('should return an error if the given player ID is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.updatePlayer, [{
                hipchat_name: "@VALID_HIPCHAT_NAME"
            }], done);
        });

        it('should return an error if the player name is null', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.updatePlayer, [{
                player_key: testData.players[0].player_key,
                hipchat_name: "@VALID_HIPCHAT_NAME"
            }], done);
        });

        it('should return an error if the player name is empty', function (done) {
            console.log('********************************************************************************');
            testCases.expectError(playerDAO.updatePlayer, [{
                player_key: testData.players[0].player_key,
                name: ""
            }], done);
        });
    });
});
