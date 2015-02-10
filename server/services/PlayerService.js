'use strict';

var playerDAO = require('../daos/PlayerDAO');

module.exports = {

    name: 'playerService',

    getPlayerById: function (request, response) {
        var promise = playerDAO.getPlayerById(request.query.player_id);
        promise.then(function (playerById) {
            response.send(playerById);
        }, function (err) {
            console.error('Error in getPlayerById: ', err);
        });
    },

    getPlayerByAny: function (request, response) {

        var criteria = [];
        var params = [];

        if (request.query.player_key) {
            criteria.push({column_name: 'player_key', 'data_type': 'int'});
            params.push(request.query.player_key);
        }
        if (request.query.name) {
            criteria.push({column_name: 'name', 'data_type': 'text'});
            params.push(request.query.name);
        }
        if (request.query.hipchat_name) {
            criteria.push({column_name: 'hipchat_name', 'data_type': 'text'});
            params.push(request.query.hipchat_name);
        }
        if (request.query.email_address) {
            criteria.push({column_name: 'email_address', 'data_type': 'text'});
            params.push(request.query.email_address);
        }
        if (request.query.skill_level) {
            criteria.push({column_name: 'skill_level', 'data_type': 'text'});
            params.push(request.query.skill_level);
        }

        var promise = playerDAO.getPlayerByAny(criteria, params);
        promise.then(function (players) {
            response.send(players);
        }, function (err) {
            console.error('Error in getPlayerByAny: ', err);
        });
    },

    searchPlayers: function (request, response) {
        var promise = playerDAO.searchPlayers(request.query.query);
        promise.then(function (matchedPlayers) {
            response.send(matchedPlayers);
        }, function (err) {
            console.error('Error in searchPlayers: ', err);
        });
    },

    addPlayer: function (request, response) {
        var promise = playerDAO.addPlayer(request.body);
        promise.then(function (insertedPlayerId) {
            response.send(insertedPlayerId);
            //response.sendStatus(200);
        }, function (err) {
            console.error('Error in addPlayer: ', err);
        });
    },

    updatePlayer: function (request, response) {
        var promise = playerDAO.updatePlayer(request.body);
        promise.then(function (updatedPlayer) {
            response.send(updatedPlayer);
            //response.sendStatus(200);
        }, function (err) {
            console.error('Error in updatePlayer: ', err);
        });
    },

    resolvePlayers: function (request, response) {
        var resolvedPlayers = [];
        for (var player in request.body.players) {
            var resolvedPlayer = getPlayerByAny(player);
            if (!resolvedPlayer) {
                resolvedPlayer = addPlayer(player);
            }
            resolvedPlayers += resolvedPlayer;
        }
        response.send(resolvedPlayers);
    }
};
