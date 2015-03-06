import React from 'react/addons';

// components
import MatchList from './match-list/MatchList';

var PingPongApp = React.createClass({displayName: "PingPongApp",

	render: function () {
		return (
			React.createElement(MatchList, null)
		);
	}

});

React.render(React.createElement(PingPongApp, null), document.querySelector('#pingPongApp'));