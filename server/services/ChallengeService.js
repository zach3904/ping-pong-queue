'use strict';

var challengeResource = require('../resources/ChallengeResource');

module.exports = {

    name: 'challengeService',

    getChallengeById: function (request, response) {
        console.log('challengeService.getChallengeById');
        challengeResource.getChallengeById(request.query.challenge_key)
            .then(function (challenge) {
                response.send(challenge);
            }, function (err) {
                console.error('Error in getChallengeById: ', err);
                response.send(err);
            });
    },

    addChallenge: function (request, response) {
        console.log('challengeService.addChallenge');
        challengeResource.createChallenge(request.body)
            .then(function (challengeId) {
                response.send(challengeId);
            }, function (err) {
                console.error('Error in addChallenge: ', err);
                response.send(err);
            });
    },

    acceptChallenge: function (request, response) {
        console.log('challengeService.acceptChallenge');
        challengeResource.acceptChallenge(request.query.challenge_key)
            .then(function (result) {
                response.sendStatus(200);
            }, function (err) {
                console.error('Error in acceptChallenge: ', err);
                response.send(err);
            });
    },

    rejectChallenge: function (request, response) {
        console.log('challengeService.rejectChallenge');
        challengeResource.rejectChallenge(request.query.challenge_key)
            .then(function (result) {
                response.sendStatus(200);
            }, function (err) {
                console.error('Error in rejectChallenge: ', err);
                response.send(err);
            });
    },

    cancelChallenge: function (request, response) {
        console.log('challengeService.cancelChallenge');
        challengeResource.cancelChallenge(request.query.challenge_key)
            .then(function (result) {
                response.sendStatus(200);
            }, function (err) {
                console.error('Error in cancelChallenge: ', err);
                response.send(err);
            });
    }
};
