'use strict';

var _ = require('underscore');
var Promise = require('promise');
var db = require('../db.js');

// This needs to move ... somewhere sharable
// Maybe read from db on app start?
// or not use at all ... removed only usage below
//var validMatchTypes = ['SINGLES', 'DOUBLES', 'ROUNDROBIN'];

module.exports = {

    name: 'matchDAO',

    getMatchById: function (matchKey) {
        if (matchKey == null) {
            var err = 'Required match_key may not be null';
            console.log('FAIL    matchDAO.getMatchById ' + err);
            return Promise.reject(err);
        }
        if (isNaN(matchKey) || matchKey < 1) {
            return Promise.reject("Invalid match key " + matchKey);
        }
        console.log('PROMISE matchDAO.getMatchById ' + matchKey);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM ping_pong.matches m WHERE m.match_key = $1::bigint;',
                [matchKey], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchDAO.getMatchById " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchDAO.getMatchById " + JSON.stringify(result.rows[0]));
                        resolve(result.rows[0]);
                    }
                });
        });
    },

    createMatch: function (matchType) {
        if (matchType == null) {
            var errMsgNull = 'Required match_type may not be null';
            console.log('FAIL    matchDAO.createMatch ' + errMsgNull);
            return Promise.reject(errMsgNull);
        }
        // This check is unnecessary. Will cause DB error.
        //if (_.intersection(validMatchTypes, matchType).length == -1) {
        //    var errMsgInvalid = 'Invalid match_type ' + matchType;
        //    console.log('FAIL    matchDAO.createMatch ' + errMsgInvalid);
        //    return Promise.reject(errMsgInvalid);
        //}
        console.log('PROMISE matchDAO.createMatch ' + matchType);
        return new Promise(function (resolve, reject) {
            db.query('INSERT INTO ping_pong.matches (match_type) VALUES ($1::match_type) RETURNING match_key;',
                [matchType], function (err, result) {
                    if (err) {
                        console.log("REJECT  matchDAO.createMatch " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchDAO.createMatch " + result.rows[0].match_key);
                        resolve(parseInt(result.rows[0].match_key));
                    }
                });
        });
    },

    getAllMatchDataByMatchId: function (matchKey) {
        if (matchKey == null) {
            var err = 'Required match_key may not be null';
            console.log('FAIL    matchDAO.getMatchById ' + err);
            return Promise.reject(err);
        }
        if (isNaN(matchKey) || matchKey < 1) {
            return Promise.reject("Invalid match key " + matchKey);
        }
        console.log('PROMISE matchDAO.getMatchById ' + matchKey);
        return new Promise(function (resolve, reject) {
            var sql = 'SELECT * FROM ping_pong.matches m' +
                ' LEFT JOIN ping_pong.match_queue mq ON mq.match_key = m.match_key' +
                ' LEFT JOIN ping_pong.challenges c ON c.match_key = m.match_key' +
                ' LEFT JOIN ping_pong.outcomes o ON o.match_key = m.match_key' +
                ' WHERE m.match_key = $1::bigint;';
            console.log(sql);
            db.query(sql,
                [matchKey], function (err, result) {
                    console.log(result.rows);
                    if (err) {
                        console.log("REJECT  matchDAO.getMatchById " + err);
                        reject(err);
                    } else {
                        console.log("RESOLVE matchDAO.getMatchById " + JSON.stringify(result.rows[0]));
                        resolve(result.rows[0]);
                    }
                });
        });
    }

};
