import React from 'react/addons';

// components
import MatchList from './match-list/MatchList';

var PingPongApp = React.createClass({

	render: function () {
		return (
			<div>
				<MatchList />
			</div>
		);
	}

});

React.render(<PingPongApp />, document.querySelector('#pingPongApp'));