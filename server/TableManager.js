'use strict';

var _ = require('underscore');

var TableManager = function (prepCB, startCB, finishCB, cancelCB, getNextMatch) {
    this.STATES = ['IDLE', 'MATCH_PREP', 'MATCH_IN_PROGRESS', 'ERROR'];
    this.state = 'IDLE';
    this.errMsg = null;
    this.timer = null;
    this.currentMatch = null;
    this.prepCB = prepCB;
    this.startCB = startCB;
    this.finishCB = finishCB;
    this.cancelCB = cancelCB;
    this.getNextMatch = getNextMatch;
};

TableManager.prototype.IDLE_TIME = 5000;
TableManager.prototype.MATCH_PREP_TIME = 120000;
TableManager.prototype.DEFAULT_MATCH_TIME = 600000;

TableManager.prototype.init = function () {
    console.log('TableManager.init');
    _.bindAll(this, '_idle', '_start', '_finish');
    this._idle();
};

TableManager.prototype.getTableState = function () {
    console.log('matchQueueResource.getTableState');
    return {
        state: this.state,
        timer: this.timer,
        currentMatch: this.currentMatch,
        errorMsg: this.errorMsg
    };
};

TableManager.prototype.start = function () {
    console.log('TableManager.start');
    if (this.state == 'MATCH_PREP') {
        clearTimeout(this.timer);
        return this._start(this.currentMatch);
    } else {
        this._error(new Error('TableManager failed to start match : not in match prep state'));
    }
};

TableManager.prototype.restart = function () {
    console.log('TableManager.restart');
    if (this.state == 'MATCH_IN_PROGRESS') {
        return this._restart();
    } else {
        this._error(new Error('TableManager failed to restart match : no match in progress'));
    }
};

TableManager.prototype.finish = function () {
    console.log('TableManager.finish');
    if (this.state == 'MATCH_IN_PROGRESS') {
        clearTimeout(this.timer);
        return this._finish(this.currentMatch);
    } else {
        this._error(new Error('TableManager failed to finish match : no match in progress'));
    }
};

TableManager.prototype.cancel = function () {
    console.log('TableManager.cancel');
    if (this.state == 'MATCH_IN_PROGRESS') {
        clearTimeout(this.timer);
        return this._cancel(this.currentMatch);
    } else {
        this._error(new Error('TableManager failed to cancel match : no match in progress'));
    }
};

TableManager.prototype._prep = function () {
    console.log('TableManager._prep');
    var that = this;
    return this.prepCB(this.currentMatch)
        .then(function () {
            that.state = 'MATCH_PREP';
            that.timer = setTimeout(function () {
                that._start();
            }, that.MATCH_PREP_TIME);
            return that.getTableState();
        }, this._error);
};

TableManager.prototype._start = function () {
    console.log('TableManager._start');
    var that = this;
    return this.startCB(this.currentMatch)
        .then(function () {
            that.state = 'MATCH_IN_PROGRESS';
            that.timer = setTimeout(function () {
                that._finish();
            }, that.DEFAULT_MATCH_TIME);
            return that.getTableState();
        }, this._error);
};

TableManager.prototype._restart = function () {
    console.log('TableManager._restart');
    // Timer restart - does not change match queue start_dtm
    clearTimeout(this.timer);
    this.timer = setTimeout(this._finish, this.DEFAULT_MATCH_TIME);
};

TableManager.prototype._finish = function () {
    console.log('TableManager._finish');
    return this.finishCB(this.currentMatch)
        .then(this._idle, this._error);
};

TableManager.prototype._cancel = function () {
    console.log('TableManager._cancel');
    return this.cancelCB(this.currentMatch)
        .then(this._idle, this._error);
};

TableManager.prototype._idle = function () {
    console.log('TableManager._idle');
    this.state = 'IDLE';
    var that = this;
    return this.getNextMatch()
        .then(function (queuedMatch) {
            try {
                if (queuedMatch != null) {
                    that.currentMatch = queuedMatch.match_key;
                    that._prep();
                } else {
                    console.log('TableManager._idle no queued match found');
                    console.log('TableManager._idle idle ' + that.IDLE_TIME + 'ms');
                    that.timer = setTimeout(that._idle, that.IDLE_TIME);
                }
                return that.getTableState();
            } catch (e) {
                that._error(new Error(e));
            }
        }, this._error);
};

TableManager.prototype._error = function (err) {
    // I don't know what I want to do with errors yet
    // So DO ALL THE THINGS!!!
    console.log(err);
    this.state = 'ERROR';
    this.errMsg = err;
    throw err;
};

module.exports = TableManager;
