'use strict';

import React from 'react/addons';
import _ from 'underscore';
import matchListStore from '../../stores/MatchListStore';
import matchListActions from '../../actions/MatchListActions';

// components
import CurrentGame from './CurrentGame';
import Queue from './Queue';

var MatchList = React.createClass({displayName: "MatchList",

	mixins: [matchListStore.mixin],

	getInitialState: function () {
		return this.getMatchListFromStore();
	},

	getMatchListFromStore: function () {
		return {
			matchList: matchListStore.getMatches()
		};
	},

	storeDidChange: function () {
		this.setState(this.getMatchListFromStore());
	},

	componentDidMount: function () {
		// get match list
		matchListActions.updateMatches();

		// setup polling for active matches
		setInterval(matchListActions.updateMatches, 10000);
	},

	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement("section", {className: "section"}, 
					React.createElement("div", {className: "sectionInner sectionInner--current-game clearfix"}, 
						React.createElement("h5", null, "Current Game"), 
						React.createElement("hr", null), 
						React.createElement("div", {className: "content"}, 
							React.createElement(CurrentGame, {match: _.first(this.state.matchList)})
						)
					)
				), 
				
				React.createElement("section", {className: "section"}, 
					React.createElement("div", {className: "sectionInner clearfix"}, 
						React.createElement("h5", null, "Active Queue"), 
						React.createElement("hr", null), 
						React.createElement("div", {className: "content"}, 
							React.createElement(Queue, {matches: _.rest(this.state.matchList)})
						)
					)
				)
			)
		);
	}

});

export default MatchList;