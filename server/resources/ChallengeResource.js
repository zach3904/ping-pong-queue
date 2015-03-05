'use strict';

var challengeDAO = require('../daos/ChallengeDAO');

module.exports = {

    name: 'challengeResource',

    getChallengeById: function (challengeKey) {
        console.log('PROMISE challengeResource.getChallengeById');
        return challengeDAO.getChallengeById(challengeKey)
            .then(function (challenge) {
                console.log('RESOLVE challengeResource.getChallengeById');
                return Promise.resolve(challenge);
            }, function (err) {
                console.error('REJECT  challengeResource.getChallengeById: ', err);
                return Promise.reject(err);
            });
    },

    addChallenge: function (challenge) {
        console.log('PROMISE challengeResource.addChallenge');
        return challengeDAO.createChallenge(challenge)
            .then(function (challengeId) {
                console.log('RESOLVE challengeResource.addChallenge');
                return Promise.resolve(challengeId);
            }, function (err) {
                console.error('REJECT  challengeResource.addChallenge: ', err);
                return Promise.reject(err);
            });
    },

    acceptChallenge: function (challengeKey) {
        console.log('PROMISE challengeResource.acceptChallenge');
        return challengeDAO.acceptChallenge(challengeKey)
            .then(function () {
            console.log('RESOLVE challengeResource.acceptChallenge');
            return Promise.resolve();
        }, function (err) {
            console.error('REJECT  challengeResource.acceptChallenge: ', err);
            return Promise.reject(err);
        });
    },

    rejectChallenge: function (challengeKey) {
        console.log('PROMISE challengeResource.rejectChallenge');
        return challengeDAO.rejectChallenge(challengeKey)
            .then(function () {
            console.log('RESOLVE challengeResource.rejectChallenge');
            return Promise.resolve();
        }, function (err) {
            console.error('REJECT  challengeResource.rejectChallenge: ', err);
            return Promise.reject(err);
        });
    },

    cancelChallenge: function (challengeKey) {
        console.log('PROMISE challengeResource.cancelChallenge');
        return challengeDAO.cancelChallenge(challengeKey)
            .then(function () {
            console.log('RESOLVE challengeResource.cancelChallenge');
            return Promise.resolve();
        }, function (err) {
            console.error('REJECT  challengeResource.cancelChallenge: ', err);
            return Promise.reject(err);
        });
    }
};
