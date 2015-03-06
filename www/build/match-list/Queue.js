import React from 'react/addons';

var cx = React.addons.classSet;

var Queue = React.createClass({displayName: "Queue",

	getInitialState: function () {
		return {
			isAddMatchFormOpen: false
		};
	},

	toggleAddMatchForm: function () {
		this.setState({ isAddMatchFormOpen: !this.state.isAddMatchFormOpen });
	},

	render: function () {
		var addMatchClasses = cx({
			'hidden': !this.state.isAddMatchFormOpen
		});

		return (
			React.createElement("div", null, 
				React.createElement("button", {type: "button", className: "addMatchBtn btn btn-primary", onClick: this.toggleAddMatchForm}, "Add Your Match"), 

				React.createElement("div", {className: 'addMatchForm panel panel-default ' + addMatchClasses}, 
					React.createElement("div", {className: "panel-body"}, 
						React.createElement("h5", null, "New Match"), 

						React.createElement(AddMatchForm, null)
					)
				), 
				
				React.createElement("ul", {className: "activeQueueList list-unstyled"}, 
					this.props.matches.map(function (match, i) {
						return (
							React.createElement(QueueItem, {match: match})
						);
					})
				)
			)
		);
	}

});

var AddMatchForm = React.createClass({displayName: "AddMatchForm",

	addMatch: function (e) {
		e.preventDefault();
	},

	render: function () {
		return (
			React.createElement("form", {className: "form-horizontal", onSubmit: this.addMatch}, 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "player1", className: "control-label col-xs-3"}, "Player 1"), 
					React.createElement("div", {className: "col-xs-9"}, 
						React.createElement("input", {type: "text", name: "player1", id: "player1", className: "form-control"})
					)
				), 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "player2", className: "control-label col-xs-3"}, "Player 2"), 
					React.createElement("div", {className: "col-xs-9"}, 
						React.createElement("input", {type: "text", name: "player2", id: "player2", className: "form-control"})
					)
				), 
				React.createElement("button", {type: "submit", className: "btn btn-primary pull-right"}, "Submit")
			)
		);
	}

});

var QueueItem = React.createClass({displayName: "QueueItem",

	getDefaultProps: function () {
		return {
			match: {}
		};
	},

	render: function () {
		console.log(this.props.match);

		return (
			React.createElement("li", null, 
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
			)
		);
	}

});

export default Queue;