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
    updatePlayer: _updatePlayer
};

function _getPlayerById(playerId) {
    console.log('PROMISE playerResource._getPlayerById ' + playerId);
    return playerDAO.getPlayerById(playerId);
}

function _getPlayerByAny(player) {
    if (player == null) {
        var errMsg = 'Player request may not be null';
        console.log('FAIL    PlayerResource.getPlayerByAny ' + errMsg);
        return Promise.reject(new Error(errMsg));
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
        console.log('FAIL    PlayerResource.getPlayerByAny: ' + e.message);
        return Promise.reject(e);
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
