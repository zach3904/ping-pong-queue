'use strict';

var challengeDAO = require('../daos/ChallengeDAO');

module.exports = {

    name: 'challengeService',

    getChallengeById: function (request, response) {
        var promise = challengeDAO.getChallengeById(request.query.challenge_key);
        promise.then(function (challenge) {
            response.send(challenge);
        }, function (err) {
            console.error('Error in getChallengeById: ', err);
        });
    },

    addChallenge: function (request, response) {
        var promise = challengeDAO.createChallenge(request.body);
        promise.then(function (challengeId) {
            response.send(challengeId);
        }, function (err) {
            console.error('Error in addChallenge: ', err);
        });
    },

    acceptChallenge: function (request, response) {
        var promise = challengeDAO.acceptChallenge(request.query.challenge_key);
        promise.then(function (result) {
            response.sendStatus(200);
        }, function (err) {
            console.error('Error in acceptChallenge: ', err);
        });
    },

    rejectChallenge: function (request, response) {
        var promise = challengeDAO.rejectChallenge(request.query.challenge_key);
        promise.then(function (result) {
            response.sendStatus(200);
        }, function (err) {
            console.error('Error in rejectChallenge: ', err);
        });
    },

    cancelChallenge: function (request, response) {
        var promise = challengeDAO.cancelChallenge(request.query.challenge_key);
        promise.then(function (result) {
            response.sendStatus(200);
        }, function (err) {
            console.error('Error in cancelChallenge: ', err);
        });
    }
};
