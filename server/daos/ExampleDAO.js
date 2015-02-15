'use strict';

var Promise = require('promise');

module.exports = {

    name: 'exampleDAO',

    add: function (a, b) {
        return new Promise(function (resolve, reject) {
            var result = parseFloat(a) + parseFloat(b);
            console.log(a + " + " + b + " = " + result);
            resolve(result);
        });
    },

    sub: function (a, b) {
        return new Promise(function (resolve, reject) {
            var result = parseFloat(a) - parseFloat(b);
            console.log(a + " - " + b + " = " + result);
            resolve(result);
        });
    },

    mul: function (a, b) {
        return new Promise(function (resolve, reject) {
            var result = parseFloat(a) * parseFloat(b);
            console.log(a + " * " + b + " = " + result);
            resolve(result);
        });
    },

    div: function (a, b) {
        return new Promise(function (resolve, reject) {
            var result = parseFloat(a) / parseFloat(b);
            console.log(a + " / " + b + " = " + result);
            resolve(result);
        });
    },

    inc: function (a) {
        return new Promise(function (resolve, reject) {
            var result = parseFloat(a) + 1;
            console.log(a + " + 1 = " + result);
            resolve(result);
        });
    },

    dec: function (a) {
        return new Promise(function (resolve, reject) {
            var result = parseFloat(a) - 1;
            console.log(a + " - 1 = " + result);
            resolve(result);
        });
    },

    sqr: function (a) {
        return new Promise(function (resolve, reject) {
            var result = parseFloat(a) * parseFloat(a);
            console.log(a + "^2 = " + result);
            resolve(result);
        });
    },

    addAll: function (nums) {
        return new Promise(function (resolve, reject) {
            var result = nums.reduce(function (previousValue, currentValue, index, array) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            });
            console.log(nums.join(" + ") + " = " + result);
            console.log("RESOLVE");
            resolve(result);
        });
    }
};
