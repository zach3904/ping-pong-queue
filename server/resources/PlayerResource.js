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
    console.log('PROMISE playerResource._getPlayerByAny ' + JSON.stringify(player));
    var criteria = [];
    var params = [];

    if (player.player_key) {
        criteria.push({column_name: 'player_key', 'data_type': 'int'});
        params.push(player.player_key);
    }
    if (player.name) {
        criteria.push({column_name: 'name', 'data_type': 'text'});
        params.push(player.name);
    }
    if (player.hipchat_name) {
        criteria.push({column_name: 'hipchat_name', 'data_type': 'text'});
        params.push(player.hipchat_name);
    }
    if (player.email_address) {
        criteria.push({column_name: 'email_address', 'data_type': 'text'});
        params.push(player.email_address);
    }
    if (player.skill_level) {
        criteria.push({column_name: 'skill_level', 'data_type': 'text'});
        params.push(player.skill_level);
    }

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
    for (var i=0; i < players.length; i++) {
        (function (i) {
            resolvedPlayerPromises.push(
                new Promise(function (resolve, reject) {
                    _getPlayerByAny(players[i]).then(function (resolvedPlayer) {
                        if (resolvedPlayer) {
                            resolve(resolvedPlayer);
                        } else {
                            console.log("No such player. Adding...");
                            _addPlayer(players[i]).then(function (playerKey) {
                                resolve({player_key: playerKey});
                            }, function (err) {
                                reject(err);
                            });
                        }
                    }, function (err) {
                        console.log("Error in getPlayerByAny");
                        reject(err);
                    });
                })
            );
        })(i);
    }
    console.log("PROMISE playerResource._resolvePlayers " + JSON.stringify(players));
    return new Promise (function (resolve, reject) {
        Promise.all(resolvedPlayerPromises)
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
                resolve(players);
            }, function (err) {
                console.log("REJECT  playerResource._resolvePlayers " + err);
                reject(err);
            });
    });
}

