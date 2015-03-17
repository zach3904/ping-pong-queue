'use strict';

var Promise = require('promise');
var _ = require("underscore");
var playerDAO = require('../daos/PlayerDAO');

module.exports = {
    name: 'playerResource',
    getPlayerById: _getPlayerById,
    getPlayerByAny: _getPlayerByAny,
    searchPlayers: _searchPlayers,
    addPlayer: _addPlayer,
    updatePlayer: _updatePlayer,
    resolvePlayers: _resolvePlayers
};

function _getPlayerById(playerId) {
    console.log('PROMISE playerResource._getPlayerById ' + playerId);
    return playerDAO.getPlayerById(playerId);
}

function _getPlayerByAny(player) {
    if (player == null) {
        var errMsg = 'Player request may not be null';
        console.log(errMsg);
        return Promise.reject(new Error('Error in PlayerResource.getPlayerByAny: ' + errMsg));
    }

    var criteria = [];
    var params = [];

    try {
        Object.keys(player).forEach(function (key) {
            switch (key) {
                case 'player_key':
                    criteria.push({column_name: key, 'data_type': 'int'});
                    params.push(player[key]);
                    break;
                case 'name':
                case 'hipchat_name':
                case 'email_address':
                    criteria.push({column_name: key, 'data_type': 'text'});
                    params.push(player[key]);
                    break;
                default:
                    var errMsg = 'Unknown player property: ' + key;
                    console.log(errMsg);
                    throw new Error(errMsg);
            }
        });
    } catch (e) {
        return Promise.reject(new Error('Error in PlayerResource.getPlayerByAny: ' + e.message));
    }

    console.log('PROMISE playerResource._getPlayerByAny ' + JSON.stringify(player));
    return playerDAO.getPlayerByAny(criteria, params);
}

function _searchPlayers(query) {
    console.log('PROMISE playerResource._searchPlayers ' + query);
    return playerDAO.searchPlayers(query);
}

function _addPlayer(player) {
    console.log('PROMISE playerResource._addPlayer ' + player);
    return playerDAO.addPlayer(player);
}

function _updatePlayer(player) {
    console.log('PROMISE playerResource._updatePlayer ' + player);
    return playerDAO.updatePlayer(player);
}

function _resolvePlayers(players) {
    // resolvePlayers searches for an exact match on ID, name, hipchat_name, and email_address
    var resolvedPlayerPromises = [];
    for (var i = 0; i < players.length; i++) {
        (function (i) {
            resolvedPlayerPromises.push(
                _getPlayerByAny(players[i])
                    .then(function (resolvedPlayer) {
                        if (resolvedPlayer) {
                            return resolvedPlayer;
                        } else {
                            console.log("No such player. Adding...");
                            _addPlayer(players[i])
                                .then(function (playerKey) {
                                    return {player_key: playerKey};
                                }, function (err) {
                                    throw err;
                                });
                        }
                    }, function (err) {
                        console.log("Error in getPlayerByAny");
                        throw err;
                    })
            );
        })(i);
    }
    console.log("PROMISE playerResource._resolvePlayers " + JSON.stringify(players));
    return Promise.all(resolvedPlayerPromises)
        .then(function (players) {
            // Check uniqueness
            var groupedPlayers = _.toArray(_.groupBy(players, 'player_key'));
            if (groupedPlayers.length != players.length) {
                var err = "Two player requests resolved to the same player";
                console.log("REJECT  playerResource._resolvePlayers " + err);
                reject(err);
                return;
            }
            console.log("RESOLVE playerResource._resolvePlayers " + JSON.stringify(players));
            return players;
        }, function (err) {
            console.log("REJECT  playerResource._resolvePlayers " + err);
            throw err;
        });
}

