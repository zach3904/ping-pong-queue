import Flux from '../app/flux';

// ActiveQueue Store
var _queue = [];

var updateMatches = function (matchList) {
	_queue = matchList;
};

var MatchListStore = Flux.createStore({

	getMatches: function () {
		return _queue;
	}

}, function (payload) {

	switch (payload.actionType) {
		case 'UPDATE_MATCHES':
			updateMatches(payload);
			MatchListStore.emitChange();

			break;

		default:
			console.warn('action not found');
			break;
	}

});

export default MatchListStore;