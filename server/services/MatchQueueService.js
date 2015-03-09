'use strict';

var matchQueueResource = require('../resources/MatchQueueResource');

module.exports = {

    name: 'matchQueueService',

    getQueuedMatchById: function (request, response) {
        console.log('matchQueueService.getQueuedMatchById');
        matchQueueResource.getQueuedMatchById(request.query.match_queue_id)
            .then(function (queuedMatch) {
                response.send(queuedMatch);
            }, function (err) {
                console.error('Error in getQueuedMatchById: ', err);
            });
    },

    queueMatch: function (request, response) {
        console.log('matchQueueService.queueMatch');
        matchQueueResource.queueMatch(request.query.match_id)
            .then(function (queuedMatch) {
                response.send(queuedMatch);
            }, function (err) {
                console.error('Error in queueMatch: ', err);
            });
    },

    getNextMatch: function (request, response) {
        console.log('matchQueueService.getNextMatch');
        matchQueueResource.getNextMatch()
            .then(function (match) {
                response.send(match);
            }, function (err) {
                console.error('Error in getNextMatch: ', err);
            });
    },

    getMatches: function (request, response) {
        console.log('matchQueueService.getMatches');
        matchQueueResource.getMatches()
            .then(function (queuedMatches) {
                response.send(queuedMatches);
            }, function (err) {
                console.error('Error in getMatches: ', err);
            });
    },

    cancelMatch: function (request, response) {
        console.log('matchQueueService.cancelMatch ' + request.query.match_key);
        matchQueueResource.cancelMatch(request.query.match_key);
        response.sendStatus(200);
    },

    delayMatch: function (request, response) {
        console.log('matchQueueService.delayMatch ' + request.query.match_key);
        matchQueueResource.delayMatch(request.query.match_key);
        response.sendStatus(200);
    },

    getTableState: function (request, response) {
        console.log('matchQueueService.getTableState');
        response.send(matchQueueResource.getTableState());
    },

    startNext: function (request, response) {
        console.log('matchQueueService.startNextMatch');
        matchQueueResource.startNext();
        response.sendStatus(200);
    },

    finishCurrent: function (request, response) {
        console.log('matchQueueService.finishMatch');
        matchQueueResource.finishCurrent();
        response.sendStatus(200);
    },

    addTimeToCurrent: function (request, response) {
        console.log('matchQueueService.addTimeToCurrent');
        matchQueueResource.addTimeToCurrent();
        response.sendStatus(200);
    },

    restartCurrent: function (request, response) {
        console.log('matchQueueService.restartCurrent');
        matchQueueResource.restartCurrent();
        response.sendStatus(200);
    }
};
