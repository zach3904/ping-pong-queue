'use strict';

var TestData = function () {
    this.players = [];
    this.matches = [];
    this.queuedMatches = [];
    this.singlePlayers = [];
    this.challenges = [];
};

TestData.prototype.SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'PRO STATUS'];
TestData.prototype.MATCH_TYPES = ['SINGLES', 'DOUBLES', 'ROUNDROBIN'];
TestData.prototype.TEAMS = ['CHALLENGER', 'CHALLENGED'];

TestData.prototype.EXAMPLE_PLAYERS = [
    {
        player_key: null,
        name: 'molsen',
        hipchat_name: '@molsen',
        email_address: 'matthewo@porch.com',
        skill_level: 'INTERMEDIATE',
        'tagline': 'YeaH BuddY!'
    }, {
        player_key: null,
        name: 'TheZACH (admin)',
        hipchat_name: '@ZacharyRichards',
        email_address: 'zachr@porch.com',
        skill_level: 'PRO STATUS',
        'tagline': null
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

TestData.prototype.loadPlayers = function () {
    console.log('TestData.loadPlayers');
    this.players = this.EXAMPLE_PLAYERS;
};

TestData.prototype.storePlayerKeys = function (keys) {
    console.log('TestData.storePlayerKeys');
    for (var i = 0; i < keys.length; i++) {
        this.players[i].player_key = keys[i];
    }
};

TestData.prototype.loadMatches = function () {
    console.log('TestData.loadMatches');
    this.matches = this.EXAMPLE_MATCHES;
};

TestData.prototype.storeMatchKeys = function (keys) {
    console.log('TestData.storeMatchKeys');
    for (var i = 0; i < keys.length; i++) {
        this.matches[i].match_key = keys[i];
    }
};

TestData.prototype.loadQueuedMatches = function () {
    console.log('TestData.loadQueuedMatches');
    if (this.matches.length > 0) {
        for (var i = 0; i < this.matches.length; i++) {
            this.queuedMatches.push({match_key: this.matches[i].match_key});
        }
    } else {
        throw new Error('Failed to load queued matches: no matches to load from');
    }
};

TestData.prototype.storeQueuedMatches = function (keys) {
    console.log('TestData.saveMatchQueueKeysAndDtms');
    for (var i = 0; i < keys.length; i++) {
        this.queuedMatches[i].match_queue_key = keys[i];
        // should load the queued_dtm here too
        // but would require fetching it
        // or changing add func to return full object
    }
};

TestData.prototype.loadSinglePlayers = function () {
    console.log('TestData.loadSinglePlayers');
    this.singlePlayers = this.EXAMPLE_SINGLE_PLAYERS;
    if (this.players.length == this.singlePlayers.length) {
        for (var i = 0; i < this.singlePlayers.length; i++) {
            this.singlePlayers[i].player_key = this.players[i].player_key;
        }
    } else {
        throw new Error('Failed to load single players: player count does not equal single player count');
    }
};

TestData.prototype.storeSinglePlayerKeys = function (keys) {
    console.log('TestData.saveSinglePlayerKeys');
    for (var i = 0; i < keys.length; i++) {
        this.singlePlayers[i].single_player_key = keys[i];
    }
};

module.exports = TestData;

