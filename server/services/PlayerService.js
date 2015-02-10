'use strict';

module.exports = {

    name: 'playerService',

    getPlayerById: function (request, response) {
        var playerById = playerDAO.getPlayerById(request.query.player_key);
        response.send(playerById);
    },

    getPlayerByAny: function (request, response) {

        var criteria = [];
        var params = [];

        if (request.query.player_key)       {criteria += {column_name: 'player_key',    'data_type': 'int'}; params += request.query.player_key;}
        if (request.query.name)             {criteria += {column_name: 'name',          'data_type': 'text'}; params += request.query.name;}
        if (request.query.hipchat_name)     {criteria += {column_name: 'hipchat_name',  'data_type': 'text'}; params += request.query.hipchat_name;}
        if (request.query.email_address)    {criteria += {column_name: 'email_address', 'data_type': 'text'}; params += request.query.email_address;}
        if (request.query.skill_level)      {criteria += {column_name: 'skill_level',   'data_type': 'text'}; params += request.query.skill_level;}

        var players = playerDAO.getPlayerByAny(criteria, params);
        response.send(players);
    },

    searchPlayers: function (request, response) {
        var matchedPlayers = playerDAO.searchPlayers(query);
        response.send(matchedPlayers);
    },

    addPlayer: function (request, response) {
        var insertedPlayerId = playerDAO.addPlayer(request.body);
        response.send(insertedPlayerId);
        //response.sendStatus(200);
    },

    updatePlayer: function (request, response) {
        var updatedPlayerId = playerDAO.updatePlayer(request.body);
        response.send(updatedPlayer);
        //response.sendStatus(200);
    },

    resolvePlayers: function (request, response) {
        var resolvedPlayers = [];
        for (var player in request.body.players) {
            var resolvedPlayer = this.getPlayer(player);
            if (!resolvedPlayer) {
                resolvedPlayer = this.addPlayer(player);
            }
            resolvedPlayers += resolvedPlayer;
        }
        response.send(resolvedPlayers);
    }
};
