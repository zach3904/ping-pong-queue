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

function _addMatch(matchType, matchTeams) {
    console.log('PROMISE matchResource._addMatch ' + matchType + " " + JSON.stringify(matchTeams));
    var teamPlayersPromises = [];
    for (var team in matchTeams) {
        if (matchTeams.hasOwnProperty(team)) {
            // Capture team value in closure
            (function (team) {
                teamPlayersPromises.push(
                    new Promise(function (resolve, reject) {
                        playerResource.resolvePlayers(matchTeams[team])
                            .then(function (resolvedTeamPlayers) {
                                resolve({team: team, players: resolvedTeamPlayers});
                            }, function (err) {
                                console.error('Error resolving team players in matchResource._addMatch: ', err);
                                reject(err);
                            });
                    })
                );
            }(team));
        }
    }
    return Promise.all(teamPlayersPromises)
        .then(function (teamPlayers) {
            console.log("REQUEST matchDAO.createMatch " + matchType);
            return matchDAO.createMatch(matchType)
                .then(function (matchKey) {
                    console.log("Aggregate match key " + matchKey + " and match player requests " + JSON.stringify(teamPlayers));
                    return {match_key: matchKey, players_by_team: teamPlayers};
                }, function (err) {
                    console.error('REJECT  matchResource._addMatch ' + err);
                    throw err;
                });
        }, function (err) {
            console.error('REJECT  matchResource._addMatch ' + err);
            throw err;
        })
        .then(function (matchWithTeamPlayers) {
            console.log("Adding match players " + JSON.stringify(matchWithTeamPlayers));
            var teamPlayers = matchWithTeamPlayers.players_by_team;
            var createdMatchPlayerPromises = [];
            // For each team
            for (var team = 0; team < teamPlayers.length; team++) {
                // For each player on each team
                for (var p = 0; p < teamPlayers[team].players.length; p++) {
                    console.log("REQUEST matchDAO.createMatchPlayer " + matchWithTeamPlayers.match_key
                    + " " + teamPlayers[team].players[p].player_key + " " + teamPlayers[team].team);
                    createdMatchPlayerPromises.push(matchPlayerDAO.createMatchPlayer(
                        matchWithTeamPlayers.match_key,
                        teamPlayers[team].players[p].player_key,
                        teamPlayers[team].team));
                }
            }
            console.log("Accumulate createMatchPlayer promises");
            return Promise.all(createdMatchPlayerPromises)
                .then(function (createdMatchPlayers) {
                    return {
                        match_key: matchWithTeamPlayers.match_key,
                        match_players: createdMatchPlayers
                    };
                }, function (err) {
                    console.error('REJECT  matchResource._addMatch ' + err);
                    throw err;
                });
        }, function (err) {
            console.error('REJECT  matchResource._addMatch ' + err);
            throw err;
        })
        .then(function (createdMatch) {
            console.log('RESOLVE matchResource._addMatch ' + JSON.stringify(createdMatch));
            return createdMatch;
        }, function (err) {
            console.error('REJECT  matchResource._addMatch ' + err);
            throw err;
        });
}
