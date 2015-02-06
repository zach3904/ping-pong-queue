import React from 'react/addons';
import ReactAsync from 'react-async';

var ActiveQueue = React.createClass({displayName: "ActiveQueue",

	getInitialState: function () {
		return {
			activeQueue: []
		};
	},

	render: function () {
		return (
			React.createElement("ul", {className: "activeQueueList list-unstyled"}, 
				React.createElement("hr", null), 
				
				React.createElement("li", null, 
					this.state.activeQueue.map(function (queueItem, i) {
						React.createElement(ActiveQueueItem, {item: queueItem})
					})
				)
			)
		);
	}

});

var ActiveQueueItem = React.createClass({displayName: "ActiveQueueItem",

	getDefaultProps: function () {
		return {
			item: {}
		};
	},

	render: function () {
		return (
			React.createElement("div", {className: "row"}, 
				React.createElement("div", {className: "col-xs-9"}, 
					React.createElement("p", null, React.createElement("strong", null, "Sekou R. (12-2)")), 
					React.createElement("div", null, "vs."), 
					React.createElement("p", null, React.createElement("strong", null, "Jake W. (15-3)"))
				), 
				React.createElement("div", {className: "col-xs-3"}, 
					React.createElement("div", {className: "btn-group-vertical pull-right"}, 
						React.createElement("button", {type: "button", className: "btn btn-sm btn-default"}, "Delay"), 
						React.createElement("button", {type: "button", className: "btn btn-sm btn-danger"}, "Cancel")
					)
				)
			)
		);
	}

})

React.render(React.createElement(ActiveQueue, null), document.querySelector('#activeQueue'));