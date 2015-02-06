/**
 * Simple ajax client
 * we can replace this with something more full-featured as needed
 */
"use strict";


module.exports = {
    post: function(options, callbacks) {
        if (! options || ! options.url) {
            return callbacks.error(new Error('bad input, options.url is required'));
        }
        var o = _.extend({
            contentType: 'application/json'
        }, options);

        try {
            var client = new XMLHttpRequest();
            client.open("POST", o.url);
            client.setRequestHeader("Content-Type", o.contentType);
            client.onreadystatechange = function handler(e) {
                var xhr = e.target;
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        callbacks.success(xhr.response);
                    } else {
                        callbacks.error(xhr);
                    }
                }
            };
            client.responseType = "json";
            client.send(options.data);
        } catch (e) {
            callbacks.error(e);
        }
    }
};