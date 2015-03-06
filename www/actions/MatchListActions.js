import Flux from '../app/flux';
import Ajax from '../lib/Ajax';

// ActiveStore Actions
var MatchListActions = Flux.createActions({

	updateMatches: function () {
		// make api call
		// simulate response
		Ajax.post({
			url: '/match-queue',
			type: 'GET'
		}).then(function (data) {
			return {
				actionType: 'UPDATE_MATCHES',
				matchList: data,
				limit: 5
			}
		});

	}

});

export default MatchListActions;