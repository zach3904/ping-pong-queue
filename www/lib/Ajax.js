import _ from 'underscore';
import RSVP from 'rsvp';

/**
 * Simple ajax client
 * we can replace this with something more full-featured as needed
 */
'use strict';



function makeHandler(resolve, reject) {
    return function handler(e) {
        var xhr = e.target;
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr);
            }
        }
    };
}

export default {
    get: function(url) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            var client = new XMLHttpRequest();
            client.open("GET", url);
            client.onreadystatechange = makeHandler(resolve, reject);
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.send();
        });
        return promise;
    },

    /**
     * Returns a Promise of an Ajax POST
     * Take one parameter options.
     * options must contain: url
     * options may contain:
     *    * data - string
     *    * contentType (application/json)
     *    * dataType (json)
     */
    post: function(options) {
        var promise = new RSVP.Promise(function(resolve, reject) {
            if (! options || ! options.url) {
                return reject(new Error('bad input, options.url is required'));
            }
            var o = _.extend({
                contentType: 'application/json'
            }, options);

            try {
                var client = new XMLHttpRequest();
                client.open("POST", o.url);
                client.setRequestHeader("Content-Type", o.contentType);
                client.onreadystatechange = makeHandler(resolve, reject);
                client.responseType = "json";
                client.send(options.data);
            } catch (e) {
                reject(e);
            }
        });
        return promise;
    }
};