'use strict';

var singlePlayerDAO = require('../daos/SinglePlayerDAO');

module.exports = {

    name: 'singlePlayerResource',

    getSinglePlayers: function () {
        console.log('PROMISE singlePlayerResource.getSinglePlayers');
        return singlePlayerDAO.getSinglePlayers()
            .then(function (singlePlayers) {
                console.error('RESOLVE singlePlayerResource.getSinglePlayers: ', singlePlayers);
                return Promise.resolve(singlePlayers);
            }, function (err) {
                console.error('REJECT  singlePlayerResource.getSinglePlayers: ', err);
                return Promise.reject(err);
            });
    },

    getSinglePlayerById: function (singlePlayerId) {
        console.log('PROMISE singlePlayerResource.getSinglePlayerById');
        return singlePlayerDAO.getSinglePlayerById(singlePlayerId)
            .then(function (singlePlayerById) {
                console.error('RESOLVE singlePlayerResource.getSinglePlayerById: ', singlePlayerById);
                return Promise.resolve(singlePlayerById);
            }, function (err) {
                console.error('REJECT  singlePlayerResource.getSinglePlayerById: ', err);
                return Promise.reject(err);
            });
    },

    addSinglePlayer: function (singlePlayer) {
        console.log('PROMISE singlePlayerResource.addSinglePlayer');
        return singlePlayerDAO.addSinglePlayer(singlePlayer)
            .then(function (singlePlayerId) {
                console.error('RESOLVE singlePlayerResource.addSinglePlayer: ', singlePlayerId);
                return Promise.resolve(singlePlayerId);
            }, function (err) {
                console.error('REJECT  singlePlayerResource.addSinglePlayer: ', err);
                return Promise.reject(err);
            });
    },

    removeSinglePlayer: function (singlePlayerId) {
        console.log('PROMISE singlePlayerResource.removeSinglePlayer');
        return singlePlayerDAO.removeSinglePlayer(singlePlayerId)
            .then(function () {
                console.error('RESOLVE singlePlayerResource.removeSinglePlayer');
                return Promise.resolve();
            }, function (err) {
                console.error('REJECT  singlePlayerResource.removeSinglePlayer: ', err);
                return Promise.reject(err);
            });
    }
};
