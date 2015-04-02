'use strict';

var _ = require('underscore');
var assert = require("assert");

module.exports = {

    MSG_EXPECT_ERROR: _.template('Expected Error, found non-error: <%= actual %>'),

    MSG_EXPECT_NULL: _.template('Expected <%= testTarget %> to be null, found <%= description %>: <%= actual %>'),
    MSG_EXPECT_NON_NULL: _.template('Expected <%= testTarget %> to be non-null, found null'),

    MSG_EXPECT_ARRAY: _.template('Expected <%= testTarget %> to be an array, found <%= description %>: <%= actual %>'),
    MSG_EXPECT_EMPTY_ARRAY: _.template('Expected <%= testTarget %> to be an empty array, found <%= description %>: <%= actual %>'),
    MSG_EXPECT_NON_EMPTY_ARRAY: _.template('Expected <%= testTarget %> to be a non-empty array, found <%= description %>: <%= actual %>'),

    MSG_EXPECT_STRING: _.template('Expected <%= testTarget %> to be a string, found <%= description %>: <%= actual %>'),
    MSG_EXPECT_EMPTY_STRING: _.template('Expected <%= testTarget %> to be an empty string, found <%= description %>: <%= actual %>'),
    MSG_EXPECT_NON_EMPTY_STRING: _.template('Expected <%= testTarget %> to be a non-empty string, found <%= description %>: <%= actual %>'),

    MSG_EXPECT_INTEGER: _.template('Expected <%= testTarget %> to be an integer, found <%= description %>: <%= actual %>'),
    MSG_EXPECT_INTEGER_STRING: _.template('Expected <%= testTarget %> to be a string representation of an integer, found <%= description%>: <%= actual %>'),

    MSG_EXPECT_DATE: _.template('Expected <%= testTarget %> to be a Date, found <%= description %>: <%= actual %>'),
    MSG_EXPECT_DATE_STRING: _.template('Expected <%= testTarget %> to be a valid Date string, found <%= description %>: <%= actual %>'),

    MSG_EXPECT_VALID_KEY: _.template('Expected <%= testTarget %> to be a valid key, found <%= description %>: <%= actual %>'),

    MSG_EXPECT_RESULT: _.template('Expected <%= testTarget %> to equal <%= expected %>, found: <%= actual %>'),
    MSG_EXPECT_SUBSET_MATCH: _.template('Expected <%= testTarget %> to equal <%= expected %>, found: <%= actual %>'),

    MSG_EXPECT_GREATER_THAN: _.template('Expected <%= testTarget %> to be greater than <%= reference %>, found: <%= actual %>'),
    MSG_EXPECT_LESS_THAN: _.template('Expected <%= testTarget %> to be greater than <%= reference %>, found: <%= actual %>'),

    // TEST RESULT CHARACTERISTICS

    expectError: function (operand) {
        console.log('VALIDATE expectError');
        assertError(operand, this.MSG_EXPECT_ERROR);
    },

    expectNull: function (operand, operandName) {
        console.log('VALIDATE expectNull');
        assertNull(operand, operandName, this.MSG_EXPECT_NULL);
    },

    expectNonNull: function (operand, operandName) {
        console.log('VALIDATE expectNonNull');
        assertNotNull(operand, operandName, this.MSG_EXPECT_NON_NULL)
    },

    expectArray: function (operand, operandName) {
        console.log('VALIDATE expectArray');
        assertNotNull(operand, operandName, this.MSG_EXPECT_ARRAY);
        assertArray(operand, operandName, this.MSG_EXPECT_ARRAY);
    },

    expectEmptyArray: function (operand, operandName) {
        console.log('VALIDATE expectEmptyArray');
        assertNotNull(operand, operandName, this.MSG_EXPECT_EMPTY_ARRAY);
        assertArray(operand, operandName, this.MSG_EXPECT_EMPTY_ARRAY);
        assertEmptyArray(operand, operandName, this.MSG_EXPECT_EMPTY_ARRAY);
    },

    expectNonEmptyArray: function (operand, operandName) {
        console.log('VALIDATE expectNonEmptyArray');
        assertNotNull(operand, operandName, this.MSG_EXPECT_NON_EMPTY_ARRAY);
        assertArray(operand, operandName, this.MSG_EXPECT_NON_EMPTY_ARRAY);
        assertNonEmptyArray(operand, operandName, this.MSG_EXPECT_NON_EMPTY_ARRAY);
    },

    expectString: function (operand, operandName) {
        console.log('VALIDATE expectString');
        assertNotNull(operand, operandName, this.MSG_EXPECT_STRING);
        assertString(operand, operandName, this.MSG_EXPECT_STRING);
    },

    expectEmptyString: function (operand, operandName) {
        console.log('VALIDATE expectEmptyString');
        assertNotNull(operand, operandName, this.MSG_EXPECT_EMPTY_STRING);
        assertString(operand, operandName, this.MSG_EXPECT_EMPTY_STRING);
        assertEmptyString(operand, operandName, this.MSG_EXPECT_EMPTY_STRING);
    },

    expectNonEmptyString: function (operand, operandName) {
        console.log('VALIDATE expectNonEmptyString');
        assertNotNull(operand, operandName, this.MSG_EXPECT_NON_EMPTY_STRING);
        assertString(operand, operandName, this.MSG_EXPECT_NON_EMPTY_STRING);
        assertNonEmptyString(operand, operandName, this.MSG_EXPECT_NON_EMPTY_STRING);
    },

    expectInteger: function (operand, operandName) {
        console.log('VALIDATE expectNonEmptyString');
        assertNotNull(operand, operandName, this.MSG_EXPECT_INTEGER);
        assertNumber(operand, operandName, this.MSG_EXPECT_INTEGER);
        assertInteger(operand, operandName, this.MSG_EXPECT_INTEGER);
    },

    expectIntegerString: function (operand, operandName) {
        console.log('VALIDATE expectIntegerString');
        assertNotNull(operand, operandName, this.MSG_EXPECT_INTEGER_STRING);
        assertString(operand, operandName, this.MSG_EXPECT_INTEGER_STRING);
        assertIntegerString(operand, operandName, this.MSG_EXPECT_INTEGER_STRING);
    },

    expectValidKey: function (operand, operandName) {
        console.log('VALIDATE expectValidKey');
        assertNotNull(operand, operandName, this.MSG_EXPECT_VALID_KEY);
        assertString(operand, operandName, this.MSG_EXPECT_VALID_KEY);
        assertIntegerString(operand, operandName, this.MSG_EXPECT_VALID_KEY);
        assertPositive(operand, operandName, this.MSG_EXPECT_VALID_KEY);
    },

    expectDate: function (operand, operandName) {
        console.log('VALIDATE expectDate');
        assertNotNull(operand, operandName, this.MSG_EXPECT_DATE);
        assertDate(operand, operandName, this.MSG_EXPECT_DATE);
    },

    expectDateString: function (operand, operandName) {
        console.log('VALIDATE expectValidDtm');
        assertNotNull(operand, operandName, this.MSG_EXPECT_DATE_STRING);
        assertString(operand, operandName, this.MSG_EXPECT_DATE_STRING);
        assertDateString(operand, operandName, this.MSG_EXPECT_DATE_STRING);
        //assertToday(operand, operandName, this.MSG_EXPECT_DATE_STRING);
    },

    // TEST RESULT VALUE

    // Succeeds if operand matches the expectedResult exactly
    expectResult: function (result, expectedResult) {
        console.log('VALIDATE expectResult');
        assertEqual(result, expectedResult, null, this.MSG_EXPECT_RESULT);
    },

    // Succeeds if operand matches all expected properties (operand may have extra props)
    expectSubsetMatch: function (operand, expectedResultSubset) {
        console.log('VALIDATE expectSubsetMatch');
        Object.keys(operand).forEach(function (prop) {
            if (typeof expectedResultSubset[prop] != 'undefined') {
                assertEqual(operand[prop], expectedResultSubset[prop], prop, this.MSG_EXPECT_SUBSET_MATCH);
            }
        }, this);
    },

    expectGreaterThan: function (testVal, referenceVal, testValLabel) {
        console.log('VALIDATE expectGreaterThan ' + referenceVal);
        //assertComparable();?
        assertGreaterThan(testVal, referenceVal, testValLabel, this.MSG_EXPECT_GREATER_THAN);
    },

    expectLessThan: function (testVal, referenceVal, testValLabel) {
        console.log('VALIDATE expectLessThan ' + referenceVal);
        //assertComparable();?
        assertLessThan(testVal, referenceVal, testValLabel, this.MSG_EXPECT_LESS_THAN);
    }

};

function assertError(operand, messageTemplate) {
    //assert(_.isError(operand), this.MSG_EXPECT_ERROR(operand));
    assert(toString.call(operand) === '[object Error]', messageTemplate({actual: operand}));
}

function assertNull(operand, operandName, messageTemplate) {
    assert(operand == null, messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-null',
        actual: JSON.stringify(operand)
    }));
}

function assertNotNull(operand, operandName, messageTemplate) {
    assert(operand != null, messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'null',
        actual: JSON.stringify(operand)
    }));
}

function assertArray(operand, operandName, messageTemplate) {
    assert(_.isArray(operand), messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-array',
        actual: JSON.stringify(operand)
    }));
}

function assertEmptyArray(operand, operandName, messageTemplate) {
    assert(_.isEmpty(operand), messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-empty array',
        actual: JSON.stringify(operand)
    }));
}

function assertNonEmptyArray(operand, operandName, messageTemplate) {
    assert(!_.isEmpty(operand), messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'empty array',
        actual: JSON.stringify(operand)
    }));
}

function assertString(operand, operandName, messageTemplate) {
    assert(_.isString(operand), messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-string',
        actual: JSON.stringify(operand)
    }));
}

function assertEmptyString(operand, operandName, messageTemplate) {
    assert(operand === '', messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-empty string',
        actual: JSON.stringify(operand)
    }));
}

function assertNonEmptyString(operand, operandName, messageTemplate) {
    assert(operand !== '', messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'empty string',
        actual: JSON.stringify(operand)
    }));
}

function assertNumber(operand, operandName, messageTemplate) {
    assert(_.isNumber(operand), messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-number',
        actual: JSON.stringify(operand)
    }));
    assert(!_.isNaN(operand), messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'NaN',
        actual: JSON.stringify(operand)
    }));
}

function assertInteger(operand, operandName, messageTemplate) {
    assert(operand === parseInt(operand), messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-integer',
        actual: JSON.stringify(operand)
    }));
}

function assertIntegerString(operand, operandName, messageTemplate) {
    assert(operand != 'NaN', messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'string NaN',
        actual: JSON.stringify(operand)
    }));
    assert(parseInt(operand).toString() === operand, messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-integer string',
        actual: JSON.stringify(operand)
    }));
}

function assertPositive(operand, operandName, messageTemplate) {
    assert(operand > 0, messageTemplate({
        testTarget: operandName ? operandName : 'result',
        description: 'non-positive',
        actual: JSON.stringify(operand)
    }));
}

function assertDate(operand, operandName, messageTemplate) {
    // http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
    if (Object.prototype.toString.call(operand) !== "[object Date]"
        || isNaN(operand.getTime())) {
        throw new Error(messageTemplate({
            testTarget: operandName ? operandName : 'result',
            description: 'non-date',
            actual: JSON.stringify(operand)
        }));
    }
}

function assertDateString(operand, operandName, messageTemplate) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
    // var dtm = new Date(operand.replace(/-/g,"/"));
    var dtm = Date.parse(operand);
    assertDate(dtm);
}

function assertEqual(result, expectedResult, operandName, messageTemplate) {
    //var replacer = function (key, value) {
    //    if (typeof value === 'number') return value.toString();
    //    if (typeof value === 'boolean') return value.toString();
    //    return value;
    //};
    //var resultJson = JSON.stringify(result, replacer);
    //var expectedJson = JSON.stringify(expectedResult, replacer);
    //assert(resultJson === expectedJson, 'Result not equal to expected (compare as json using ===)');
    //assert.strictEqual(resultJson, expectedJson, 'Result not equal to expected (compare as json with strictEqual)');
    assert.deepEqual(result, expectedResult,
        messageTemplate({
            testTarget: operandName ? operandName : 'result',
            expected: JSON.stringify(expectedResult, null, 2),
            actual: JSON.stringify(result, null, 2)
        })
    );
}

function assertGreaterThan(testVal, referenceVal, testValLabel, messageTemplate) {
    if (!(testVal > referenceVal)) {
        throw new Error(messageTemplate({
            testTarget: testValLabel ? testValLabel : 'result',
            reference: JSON.stringify(referenceVal),
            actual: JSON.stringify(testVal)
        }));
    }
}

function assertLessThan(testVal, referenceVal, testValLabel, messageTemplate) {
    if (!(testVal < referenceVal)) {
        throw new Error(messageTemplate({
            testTarget: testValLabel ? testValLabel : 'result',
            reference: JSON.stringify(referenceVal),
            actual: JSON.stringify(testVal)
        }));
    }
}
