'use strict';

var Promise = require('promise');
var matchDAO = require('../daos/MatchDAO');
var playerResource = require('../resources/PlayerResource');

module.exports = {
    name: 'matchResource',
    getMatchById: _getMatchById,
    addMatch: _addMatch
};

function _getMatchById(matchKey) {
    console.log('PROMISE matchResource._getMatchById ' + matchKey);
    return new Promise(function (resolve, reject) {
        Promise.all([
            // Call each async
            matchDAO.getMatchById(matchKey),
            matchDAO.getMatchPlayers(matchKey)
        ]).then(function (results) {
            // Composite results
            var match = {match_key: matchKey, match_type: results[0].match_type, match_players: results[1]};
            console.log("RESOLVE matchResource._getMatchById " + match);
            resolve(match);
        }, function (err) {
            console.error('Error in matchResource._getMatchById: ', err);
        });
    });
}

function _addMatch(matchType, matchTeams) {
    console.log('PROMISE matchResource._addMatch ' + matchType + " " + JSON.stringify(matchTeams));
    return new Promise(function (resolve, reject) {
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
                        return new Promise(function (resolve, reject) {
                            console.log("Aggregate match key " + matchKey + " and match player requests " + JSON.stringify(teamPlayers));
                            resolve({match_key: matchKey, players_by_team: teamPlayers})
                        });
                    }, function (err) {
                        console.error('REJECT  matchResource._addMatch ' + err);
                        reject(err);
                    });
            }, function (err) {
                console.error('REJECT  matchResource._addMatch ' + err);
                reject(err);
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
                        createdMatchPlayerPromises.push(matchDAO.createMatchPlayer(
                            matchWithTeamPlayers.match_key,
                            teamPlayers[team].players[p].player_key,
                            teamPlayers[team].team));
                    }
                }
                console.log("Accumulate createMatchPlayer promises");
                return Promise.all(createdMatchPlayerPromises)
                    .then(function (createdMatchPlayers) {
                        return new Promise(function (resolve, reject) {
                            var createdMatchWithPlayers = {
                                match_key: matchWithTeamPlayers.match_key,
                                match_players: createdMatchPlayers
                            };
                            resolve(createdMatchWithPlayers);
                        });
                    });
            }, function (err) {
                console.error('REJECT  matchResource._addMatch ' + err);
                reject(err);
            })
            .then(function (createdMatch) {
                console.log('RESOLVE matchResource._addMatch ' + JSON.stringify(createdMatch));
                resolve(createdMatch);
            }, function (err) {
                console.error('REJECT  matchResource._addMatch ' + err);
                reject(err);
            });
    });
}
