import React from 'react/addons';
import queueStore from '../../stores/queueStore';
import queueActions from '../../actions/queueActions';

var cx = React.addons.classSet;

export default React.createClass({

	mixins: [queueStore.mixin],

	getInitialState: function () {
		return {
			isAddMatchFormOpen: false
		};
	},

	getQueueStateFromStore: function () {
		return {
			activeQueue: queueStore.getMatches()
		}
	},

	storeDidChange: function () {
		this.setState(this.getQueueStateFromStore());
	},

	componentDidMount: function () {
		// get match list
		queueActions.updateMatches();

		// setup polling for active matches
		//setInterval(queueActions.updateMatches, 10000);
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
					React.createElement("hr", null), 
					React.createElement("li", null, React.createElement(ActiveQueueItem, null)), 
					React.createElement("hr", null), 
					React.createElement("li", null, React.createElement(ActiveQueueItem, null)), 
					React.createElement("hr", null), 
					React.createElement("li", null, React.createElement(ActiveQueueItem, null))
				)
			)
		);
	}

});

var AddMatchForm = React.createClass({displayName: "AddMatchForm",

	getDefaultProps: function () {
		return {};
	},

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

});