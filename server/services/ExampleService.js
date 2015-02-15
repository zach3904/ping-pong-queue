'use strict';

var Promise = require('promise');
var exampleDAO = require('../daos/ExampleDAO');

module.exports = {

    name: 'exampleService',

    chain: function (request, response) {
        var a = request.query.a;
        var b = request.query.b;

        // ((a + b) * 2 + 1)^2
        exampleDAO.add(a, b)
            .then(function (sum) {
                return exampleDAO.mul(sum, 2);
            }).then(function (result) {
                return exampleDAO.inc(result);
            }).then(function (result) {
                return exampleDAO.sqr(result);
            }).done(function (result) {
                //console.log("Sending result: " + result);
                response.send({result: result});
            });

        // more concise but fails for some unknown reason :(
        // exampleDAO.inc takes a number and returns a promise (fails)
        // the anon func takes a number and returns a promise (works!)
        // ((a + b) * 2 + 1)^2
        //exampleDAO.add(a, b)
        //    .then(function (sum) {
        //        exampleDAO.mul(sum, 2);
        //    }).then(exampleDAO.inc)
        //    .then(exampleDAO.sqr)
        //    .then(response.send);

    },

    accumulate: function (request, response) {
        var a = request.query.a;
        var b = request.query.b;

        // (a + b) + (a - b) + (a * b) + (a / b)
        Promise.all([
            exampleDAO.add(a, b),
            exampleDAO.sub(a, b),
            exampleDAO.mul(a, b),
            exampleDAO.div(a, b)
        ]).then(function (results) {
            //console.log("Adding: " + results);
            return exampleDAO.addAll(results);
        }).then(function (result) {
            //console.log("Sending result: " + result);
            response.send({result: result});
        });
    }
};
