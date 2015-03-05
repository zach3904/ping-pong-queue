var Promise = require("promise");
var assert = require("assert");

// ASSERTIONS CAUSE ASYNC MOCHA TESTS TO TIME OUT
// THE FOLLOWING TESTS EXPLORE THAT ISSUE AND ARE ALL EXPECTED TO FAIL
// SOME WILL FAIL GRACEFULLY WITH A MEANINGFUL ERROR MESSAGE
// SOME WILL FAIL DUE TO TIMEOUT (BAD)
describe('Mocha Tests', function () {
    it('should produce meaningful error messages when an assertion fails', function () {
        assert(false);
    });
    describe('should produce meaningful error messages when an assertion fails in an async test', function () {
        it('by default (but it doesn\'t)', function (done) {
            new Promise(function (resolve, reject) {
                resolve(true);
            }).then(function (result) {
                    assert(false);
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });
        it('if the assertion is wrapped in a try catch', function (done) {
            new Promise(function (resolve, reject) {
                resolve(true);
            }).then(function (result) {
                    try {
                        assert(false);
                    } catch (e) {
                        done(e);
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        });
        it('if the assertion is wrapped in a function that handles thrown errors', function (done) {
            // Tried to simplify async assertions... failed horribly
            // It works, but it's certainly not simpler... don't use this
            new Promise(function (resolve, reject) {
                resolve(true);
            }).then(function (result) {
                    assertAsync(true, function () {
                        // First assertion succeeded
                        //console.log('First assertion succeeded');
                        assertAsync(false, function () {
                            // Second assertion succeeded
                            //console.log('Second assertion succeeded');
                            done();
                        }, function (err) {
                            // Second assertion failed
                            //console.log('Second assertion failed');
                            done(err);
                        });
                    }, function (err) {
                        // First assertion failed
                        //console.log('First assertion failed');
                        done(err);
                    });
                }, function (err) {
                    // Promise failed
                    //console.log('Promise failed');
                    done(new Error(err));
                });
        });
    });
    it('should produce meaningful error messages in an async test if we don\'t use assertions', function (done) {
        try {
            new Promise(function (resolve, reject) {
                resolve(true);
            }).then(function (result) {
                    if (true) {
                        done(new Error("Failed: <failure reason>"));
                        return;
                    }
                    done();
                }, function (err) {
                    done(new Error(err));
                });
        } catch (e) {
            done(e);
        }
    });
});

assertAsync = function (test, succeed, fail) {
    try {
        assert(test)
    } catch (e) {
        fail(e);
        return;
    }
    succeed();
};


