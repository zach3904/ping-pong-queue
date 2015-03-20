'use strict';

var Promise = require('promise');
var matchDAO = require('../daos/MatchDAO');
var matchPlayerDAO = require('../daos/MatchPlayerDAO');
var playerResource = require('../resources/PlayerResource');

module.exports = {
    name: 'matchResource',
    getMatchById: _getMatchById,
    addMatch: _addMatch
};

function _getMatchById(matchKey) {
    console.log('PROMISE matchResource._getMatchById ' + matchKey);
    return matchDAO.getMatchById(matchKey);
}

function _getAllMatchDataByMatchId(matchKey) {
    console.log('PROMISE matchResource._getAllMatchDataByMatchId ' + matchKey);
    return Promise.all([
        // Call each async
        matchDAO.getAllMatchDataByMatchId(matchKey),
        matchPlayerDAO.getMatchPlayers(matchKey)
    ]).then(function (results) {
        // Composite results
        var matchData = {match_key: matchKey, match_type: results[0].match_type, match_players: results[1]};
        console.log("RESOLVE matchResource._getAllMatchDataByMatchId " + matchData);
        return matchData;
    }, function (err) {
        console.error('Error in matchResource._getAllMatchDataByMatchId: ', err);
        throw err;
    });
}

function _addMatch(matchType, playerIdsWithTeams) {
    console.log('PROMISE matchResource._addMatch ' + matchType + " " + JSON.stringify(playerIdsWithTeams));
    var addMatchData = {};
    return matchDAO.createMatch(matchType)
        .then(function (match) {
            addMatchData.match = match;
            console.log("Adding match players");
            var matchPlayerPromises = [];
            for (var p = 0; p < playerIdsWithTeams.length; p++) {
                console.log("REQUEST matchDAO.createMatchPlayer " + match.match_key
                + " " + playerIdsWithTeams[p].player_key + " " + playerIdsWithTeams[p].team);
                matchPlayerPromises.push(matchPlayerDAO.createMatchPlayer(
                    match.match_key,
                    playerIdsWithTeams[p].player_key,
                    playerIdsWithTeams[p].team));
            }
            console.log("Accumulate createMatchPlayer promises");
            return Promise.all(matchPlayerPromises)
        }, function (err) {
            console.error('REJECT  matchResource._addMatch ' + err);
            throw err;
        })
        .then(function (matchPlayers) {
            var result = addMatchData.match;
            result.match_players =  matchPlayers;
            console.log('RESOLVE matchResource._addMatch ' + JSON.stringify(result));
            return result;
        }, function (err) {
            console.error('REJECT  matchResource._addMatch ' + err);
            throw err;
        });
}
