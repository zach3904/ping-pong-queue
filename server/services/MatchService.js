'use strict';

var Promise = require('promise');
var matchResource = require('../resources/MatchResource');

module.exports = {

    name: 'matchService',

    getMatchById: function (request, response) {
        console.log('matchService.getMatchById');
        matchResource.getMatchById(request.query.match_id)
            .then(function (match) {
                response.send(match);
            }, function (err) {
                console.error('Error in getMatchById: ', err);
            });
    },

    addMatch: function (request, response) {
        console.log('matchService.addMatch');
        matchResource.addMatch(
            request.body.match_type,
            request.body.match_players
        ).then(function (match) {
            response.send(match);
        }, function (err) {
            console.error('Error in matchService.addMatch: ', err);
        });
    }
};
