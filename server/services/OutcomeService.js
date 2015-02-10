'use strict';

var outcomeDAO = require('../daos/OutcomeDAO');

module.exports = {

    name: 'outcomeService',

    getOutcomeById: function (request, response) {
        var promise = outcomeDAO.getOutcomeById(request.query.outcome_key);
        promise.then(function (outcome) {
            response.send(outcome);
        }, function (err) {
            console.error('Error in getOutcomeById: ', err);
        });
    },

    addOutcome: function (request, response) {
        var promise = outcomeDAO.createOutcome(request.body);
        promise.then(function (outcomeId) {
            response.send(outcomeId);
        }, function (err) {
            console.error('Error in addOutcome: ', err);
        });
    }
};
