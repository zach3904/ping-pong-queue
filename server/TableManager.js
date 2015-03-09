'use strict';

var TableManager = function(prepCB, startCB, finishCB, cancelCB, getNextMatch) {
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
    console.log('init');
    this._idle();
};

TableManager.prototype.start = function () {
    console.log('start');
    if (this.state == 'MATCH_PREP') {
        clearTimeout(this.timer);
        this._start(this.currentMatch);
    } else {
        throw new Error('TableManager failed to start match : not in match prep state');
    }
};

TableManager.prototype.restart = function () {
    console.log('restart');
    if (this.state == 'MATCH_IN_PROGRESS') {
        this._restart();
    } else {
        throw new Error('TableManager failed to restart match : no match in progress');
    }
};

TableManager.prototype.finish = function () {
    console.log('finish');
    if (this.state == 'MATCH_IN_PROGRESS') {
        clearTimeout(this.timer);
        this._finish(this.currentMatch);
    } else {
        throw new Error('TableManager failed to finish match : no match in progress');
    }
};

TableManager.prototype.cancel = function () {
    console.log('cancel');
    if (this.state == 'MATCH_IN_PROGRESS') {
        clearTimeout(this.timer);
        this._cancel(this.currentMatch);
    } else {
        throw new Error('TableManager failed to cancel match : no match in progress');
    }
};

TableManager.prototype._prep = function () {
    console.log('_prep');
    var that = this;
    this.prepCB(this.currentMatch)
        .then(function () {
            that.state = 'MATCH_PREP';
            that.timer = setTimeout(function () {
                that._start();
            }, that.MATCH_PREP_TIME);
        }, function (err) {
            console.log(err);
            that.state = 'ERROR';
            that.errorMsg = err;
        });
};

TableManager.prototype._start = function () {
    console.log('_start');
    var that = this;
    this.startCB(this.currentMatch)
        .then(function () {
            that.state = 'MATCH_IN_PROGRESS';
            that.timer = setTimeout(function () {
                that._finish();
            }, that.DEFAULT_MATCH_TIME);
        }, function (err) {
            console.log(err);
            that.state = 'ERROR';
            that.errorMsg = err;
        });
};

TableManager.prototype._restart = function () {
    console.log('_restart');
    clearTimeout(this.timer);
    var that = this;
    this.timer = setTimeout(function () {
        that._finish();
    }, this.DEFAULT_MATCH_TIME);
};

TableManager.prototype._finish = function () {
    console.log('_finish');
    var that = this;
    this.finishCB(this.currentMatch)
        .then(function () {
            that.state = 'IDLE';
            that._idle();
        }, function (err) {
            console.log(err);
            that.state = 'ERROR';
            that.errorMsg = err;
        });
};

TableManager.prototype._cancel = function () {
    console.log('_cancel');
    var that = this;
    this.cancelCB(this.currentMatch)
        .then(function () {
            that.state = 'IDLE';
            that._idle();
        }, function (err) {
            console.log(err);
            that.state = 'ERROR';
            that.errorMsg = err;
        });
};

TableManager.prototype._idle = function (){
    console.log('_idle');
    var that = this;
    this.getNextMatch()
        .then(function (queuedMatch) {
            if (that.currentMatch = queuedMatch.match_key) {
                that._prep();
            } else {
                console.log('_idle no queued match found');
                console.log('_idle idle ' + that.IDLE_TIME + 'ms');
                that.timer = setTimeout(that._idle, that.IDLE_TIME);
            }
        }, function (err) {
            console.log(err);
            that.state = 'ERROR';
            that.errorMsg = err;
        });
};

module.exports = TableManager;
