'use strict';

var Promise = require('promise');
var exampleDAO = require('../daos/ExampleDAO');

module.exports = {

    name: 'exampleService',

    // Execute multiple async operations in serial
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

    // Accumulate the results of multiple async processes in an array
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
    },

    // Combine results with previously derived values
    aggregate: function (request, response) {
        var myVal = 12;
        exampleDAO.div(myVal, 2).then(function (result) {
            response.send({myVal: myVal, halfMyVal: result});
            // If this were a function that returns a promise,
            // as in the resource layer, then it would look more like:
            //
            // return new Promise(resolve, reject) {
            //   resolve({myVal: myVal, halfMyVal: result}));
            // }
            //
            // I learned a shortcut
            //
            // return Promise.resolve({myVal: myVal, halfMyVal: result});
        });
    },


    // Inspect or act on promise completion / results
    // provide an opportunity to act on (perhaps log) the result of the promise function
    // instead of it returning silently to the caller

    // Two ways of doing this below
    // Not sure which is preferable... leaning toward wrapped result

    // NOTE: THIS TYPE OF FUNCTION NEEDS TO GO INTO THE RESOURCE LAYER
    // This service calls a handler, passing in a result
    // The resource returns a promise
    // very different mechanics

    // For instance, instead of just
    //
    // inc: function (request, response) {
    //   return exampleDAO.inc(6);
    // }

    // Wrap a call to a promise function (function that returns a promise) in a promise
    wrapInc: function (request, response) {

        return new Promise(function (resolve) {
            console.log("Call wrapped promise function");
            exampleDAO.inc(6)
                .then(function (result) {
                    console.log("Wrapped promise resolved, resolving outer promise");
                    resolve(result);
                });
        });

    },

    // Wrap the result of a promise function in a promise
    wrapResultOfInt: function (request, response) {
        console.log("Call promise function");
        return exampleDAO.inc(6).then(function (result) {
            console.log("Listened promise resolved, return new promise with result");
            return Promise.resolve(result);
        })
    }
};
