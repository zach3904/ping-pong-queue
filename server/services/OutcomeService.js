'use strict';

var outcomeResource = require('../resources/OutcomeResource');

module.exports = {

    name: 'outcomeService',

    getOutcomeById: function (request, response) {
        console.log('REQUEST outcomeService.getOutcomeById');
        outcomeResource.getOutcomeById(request.query.outcome_key)
            .then(function (outcome) {
                console.log('RESPONSE outcomeService.getOutcomeById ' + outcome);
                response.send(outcome);
            }, function (err) {
                console.error('ERROR in outcomeService.getOutcomeById: ', err);
                response.send(err);
            });
    },

    addOutcome: function (request, response) {
        console.log('REQUEST outcomeService.addOutcome');
        outcomeResource.createOutcome(request.body)
            .then(function (outcomeId) {
                console.log('REQUEST outcomeService.addOutcome ' + outcomeId);
                response.send(outcomeId);
            }, function (err) {
                console.error('ERROR in outcomeService.addOutcome: ', err);
                response.send(err);
            });
    }
};
