import React from 'react/addons';

var CurrentGame = React.createClass({displayName: "CurrentGame",
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement("h4", {className: "currentGame-players"}, React.createElement("strong", null, "Zachary R."), " (37-5)"), 
				React.createElement("h5", null, "vs."), 
				React.createElement("h4", null, React.createElement("strong", null, "Matthew O."), " (100-0)"), 
				
				React.createElement("hr", null), 
				
				React.createElement("div", {className: "pull-left"}, 
					React.createElement("p", null, "Estimated time remaining: 8 min")
				), 
				React.createElement("div", {className: "btn-group pull-right"}, 
					React.createElement("button", {type: "button", className: "btn btn-default"}, "Log Game"), 
					React.createElement("button", {type: "button", className: "btn btn-default"}, "Finish Game")
				)
			)
		);
	}
});

React.render(React.createElement(CurrentGame, null), document.querySelector('#currentGame'));