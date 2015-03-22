'use strict';

var _ = require("underscore");

var TestData = function () {
    this.players = [];
    this.matches = [];
    this.matchPlayers = [];
    this.queuedMatches = [];
    this.singlePlayers = [];
    this.challenges = [];
};

TestData.prototype.SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'PRO STATUS'];
TestData.prototype.MATCH_TYPES = ['SINGLES', 'DOUBLES', 'ROUNDROBIN'];
TestData.prototype.TEAMS = ['CHALLENGER', 'CHALLENGED'];
TestData.prototype.MAX_PLAYERS_BY_MATCH_TYPE = {
    SINGLES: 2,
    DOUBLES: 4,
    ROUNDROBIN: 3
}

TestData.prototype.EXAMPLE_PLAYERS = [
    {
        player_key: null,
        name: 'molsen',
        hipchat_name: '@molsen',
        email_address: 'matthewo@porch.com',
        skill_level: 'INTERMEDIATE',
        tagline: 'YeaH BuddY!'
    }, {
        player_key: null,
        name: 'TheZACH (admin)',
        hipchat_name: '@ZacharyRichards',
        email_address: 'zachr@porch.com',
        skill_level: 'PRO STATUS',
        tagline: null
    }];

TestData.prototype.EXAMPLE_MATCHES = [
    {
        match_key: null,
        match_type: 'SINGLES'
    },
    {
        match_key: null,
        match_type: 'DOUBLES'
    },
    {
        match_key: null,
        match_type: 'ROUNDROBIN'
    }
];

TestData.EXAMPLE_SINGLE_PLAYERS = [
    {
        single_player_key: null,
        player_key: null,
        skill_level: 'BEGINNER',
        match_type: 'SINGLES'
    },
    {
        single_player_key: null,
        player_key: null,
        skill_level: 'INTERMEDIATE',
        match_type: 'DOUBLES'
    }
];

TestData.prototype.getPlayerRequests = function () {
    console.log('TestData.getPlayerRequests');
    return this.EXAMPLE_PLAYERS;
};

TestData.prototype.setPlayers = function (players) {
    console.log('TestData.setPlayers');
    this.players = players;
};

TestData.prototype.getMatchRequests = function () {
    console.log('TestData.getMatchRequests');
    return this.EXAMPLE_MATCHES;
};

TestData.prototype.setMatches = function (matches) {
    console.log('TestData.setMatches');
    this.matches = matches;
};

TestData.prototype.getMatchPlayerRequests = function () {
    console.log('TestData.getMatchPlayerRequests');
    var matchPlayerRequests = [];
    if (this.matches.length > 0) {
        for (var i = 0; i < this.matches.length; i++) {
            if (this.players.length > 0) {
                var slots = this.MAX_PLAYERS_BY_MATCH_TYPE[this.matches[i].match_type];
                for (var j = 0; j < slots && j < this.players.length; j++) {
                    matchPlayerRequests.push({
                        match_key: this.matches[i].match_key,
                        player_key: this.players[j].player_key,
                        team: j <= (slots / 2) - 1 ? 'CHALLENGER' : 'CHALLENGED'
                    });
                }
            } else {
                throw new Error('Failed to get match player requests: no players to load from');
            }
        }
    } else {
        throw new Error('Failed to get match player requests: no matches to load from');
    }
    return matchPlayerRequests;
};

TestData.prototype.setMatchPlayers = function (matchPlayers) {
    console.log('TestData.setMatchPlayers');
    this.matchPlayers = matchPlayers;
};

TestData.prototype.getExpectedMatchPlayers = function (matchKey) {
    console.log('TestData.getExpectedMatchPlayers');
    var expectedMatchPlayers = [];
    _.each(
        _.filter(this.matchPlayers, function (matchPlayer) {
            return matchPlayer.match_key == matchKey;
        }, this),
        function (matchPlayer) {
            var player = _.find(this.players, function (player) {
                return player.player_key == matchPlayer.player_key;
            });
            expectedMatchPlayers.push(_.extend(player, {
                match_player_key: matchPlayer.match_player_key,
                match_key: matchPlayer.match_key,
                team: matchPlayer.team
            }));
        }, this
    );
    return expectedMatchPlayers;
};

TestData.prototype.getMatchQueueRequests = function () {
    console.log('TestData.getMatchQueueRequests');
    var matchQueueRequests = [];
    if (this.matches.length > 0) {
        for (var i = 0; i < this.matches.length; i++) {
            matchQueueRequests.push({match_key: this.matches[i].match_key});
        }
    } else {
        throw new Error('Failed to get match queue requests: no matches to load from');
    }
    return matchQueueRequests;
};

TestData.prototype.setQueuedMatches = function (queuedMatches) {
    console.log('TestData.setQueuedMatches');
    this.queuedMatches = queuedMatches;
};

TestData.prototype.getSinglePlayerRequests = function () {
    console.log('TestData.getSinglePlayerRequests');
    var singlePlayerRequests = this.EXAMPLE_SINGLE_PLAYERS;
    if (singlePlayerRequests.length == this.players.length) {
        for (var i = 0; i < singlePlayerRequests.length; i++) {
            singlePlayerRequests[i].player_key = this.players[i].player_key;
        }
    } else {
        throw new Error('Failed to get single player requests: player count does not equal single player count');
    }
    return singlePlayerRequests;
};

TestData.prototype.setSinglePlayers = function (singlePlayers) {
    console.log('TestData.setSinglePlayer');
    this.singlePlayers = singlePlayers;
};

TestData.prototype.getChallengeRequests = function () {
    return [];
};

TestData.prototype.setChallenges = function (challenges) {
    console.log('TestData.setChallenges');
    this.challenges = challenges;
};

TestData.prototype.getOutcomeRequests = function () {
    return [];
};

TestData.prototype.setOutcomes = function (outcomes) {
    console.log('TestData.setOutcomes');
    this.outcomes = outcomes;
};

module.exports = TestData;

