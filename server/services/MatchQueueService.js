'use strict';

module.exports = {
    name: 'matchQueueService',
    getMatchQueueById: function (request, response) {
        response.send({
            match_queue_key: 1,
            match_key: 1,
            queued_dtm: '2014-02-06 10:30:00',
            started_dtm: '2014-02-06 10:40:00',
            completed_dtm: '2014-02-06 11:00:00',
            cancelled_dtm: null
        });
    }
}
