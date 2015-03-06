import React from 'react/addons';

// components
import MatchList from './match-list/MatchList';

var PingPongApp = React.createClass({

	render: function () {
		return (
			<MatchList />
		);
	}

});

React.render(<PingPongApp />, document.querySelector('#pingPongApp'));