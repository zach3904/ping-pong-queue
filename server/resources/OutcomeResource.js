'use strict';

var outcomeDAO = require('../daos/OutcomeDAO');

module.exports = {

    name: 'outcomeResource',

    getOutcomeById: function (outcomeKey) {
        console.log('PROMISE outcomeResource.getOutcomeById: ' + outcomeKey);
        return outcomeDAO.getOutcomeById(outcomeKey)
            .then(function (outcome) {
                console.error('RESOLVE outcomeResource.getOutcomeById: ', outcome);
                return Promise.resolve(outcome);
            }, function (err) {
                console.error('REJECT  outcomeResource.getOutcomeById: ', err);
                return Promise.reject(err);
            });
    },

    addOutcome: function (outcome) {
        console.log('PROMISE outcomeResource.addOutcome: ' + outcome);
        return outcomeDAO.createOutcome(outcome)
            .then(function (outcomeId) {
                console.error('RESOLVE outcomeResource.addOutcome: ', outcomeId);
                return Promise.resolve(outcomeId);
            }, function (err) {
                console.error('REJECT  outcomeResource.addOutcome: ', err);
                return Promise.reject(err);
            });
    }
};
