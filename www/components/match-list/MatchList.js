'use strict';

import React from 'react/addons';
import _ from 'underscore';
import matchListStore from '../../stores/MatchListStore';
import matchListActions from '../../actions/MatchListActions';

// components
import CurrentGame from './CurrentGame';
import Queue from './Queue';

var MatchList = React.createClass({

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
			<div>
				<section className="section">
					<div className="sectionInner sectionInner--current-game clearfix">
						<h5>Current Game</h5>
						<hr/>
						<div className="content">
							<CurrentGame match={_.first(this.state.matchList)} />
						</div>
					</div>
				</section>
				
				<section className="section">
					<div className="sectionInner clearfix">
						<h5>Active Queue</h5>
						<hr/>
						<div className="content">
							<Queue matches={_.rest(this.state.matchList)} />
						</div>
					</div>
				</section>
			</div>
		);
	}

});

export default MatchList;