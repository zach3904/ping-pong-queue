'use strict';

var Promise = require('promise');
var matchQueueDAO = require('../daos/MatchQueueDAO');
var playerResource = require('../resources/PlayerResource');
var TableManager = require('../TableManager');

module.exports = {
    name: 'matchResource',
    initTableManager: initTableManager,
    getQueuedMatchById: getQueuedMatchById,
    queueMatch: queueMatch,
    getNextMatch: getNextMatch,
    getMatches: getMatches,
    cancelMatch: cancelMatch,
    delayMatch: delayMatch,
    getTableState: getTableState,
    startNext: startNext,
    finishCurrent: finishCurrent,
    addTimeToCurrent: addTimeToCurrent,
    restartCurrent: restartCurrent,
    cancelCurrent: cancelCurrent
};

var tableManager = new TableManager(
    matchPrepHandler,
    matchStartHandler,
    matchFinishHandler,
    matchCancelHandler,
    getNextMatch
);

function initTableManager() {
    console.log('matchQueueResource.initTableManager');
    tableManager.init();
}

function getQueuedMatchById(matchKey) {
    console.log('PROMISE matchQueueResource.getQueuedMatchById');
    return matchQueueDAO.getQueuedMatchById(matchKey);
}

function queueMatch(matchKey) {
    console.log('PROMISE matchQueueResource.queueMatch');
    return matchQueueDAO.queueMatch(matchKey);
}

function getNextMatch() {
    console.log('PROMISE matchQueueResource.getNextMatch');
    return matchQueueDAO.getNextMatch();
}

function getMatches() {
    console.log('PROMISE matchQueueResource.getMatches');
    return matchQueueDAO.getMatches();
}

function cancelMatch(matchKey) {
    // cancel a queued match (possibly current)
    console.log('matchQueueResource.cancelMatch');
    if (matchKey == tableManager.currentMatch) {
        return tableManager.cancel();
    }
    return matchQueueDAO.cancelMatch(matchKey);
}

function delayMatch(matchKey) {
    // move an unstarted match to the bottom of the queue
    console.log('matchQueueResource.delayMatch');
    return matchQueueDAO.delayMatch(matchKey);
}

function getTableState() {
    console.log('matchQueueResource.getTableState');
    return tableManager.getTableState();
}

function startNext() {
    // skip match prep and start the match timer
    console.log('matchQueueResource.startNext');
    return tableManager.start();
}

function finishCurrent() {
    // manually trigger finish of current match
    console.log('matchQueueResource.finishCurrent');
    tableManager.finish();
}

function addTimeToCurrent(time) {
    // out of scope
    console.log('NOT IMPLEMENTED MatchQueueResource.addTimeToCurrent');
}

function restartCurrent() {
    // reset timer back to default match time
    console.log('matchQueueResource.restartCurrent');
    tableManager.restart();
}

function cancelCurrent() {
    // manually trigger cancel of current match
    console.log('matchQueueResource.cancelCurrent');
    tableManager.cancel();
}

function matchPrepHandler() {
    console.log('MatchQueueResource.matchPrepHandler');
    /* Announce match here? */
    return Promise.resolve();
}

function matchStartHandler(matchKey) {
    console.log('MatchQueueResource.matchStartHandler');
    return matchQueueDAO.startMatch(matchKey);
}

function matchFinishHandler(matchKey) {
    console.log('MatchQueueResource.matchFinishHandler');
    return matchQueueDAO.finishMatch(matchKey);
}

function matchCancelHandler(matchKey) {
    console.log('MatchQueueResource.matchCancelHandler');
    return matchQueueDAO.cancelMatch(matchKey);
}
