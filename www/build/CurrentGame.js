import React from 'react/addons';

var cx = React.addons.classSet;

var CurrentGame = React.createClass({displayName: "CurrentGame",

	getInitialState: function () {
		return {
			isLogGameOpen: false,
			match: {
				player1: {
					name: 'Matthew Olsen',
					record: '37-5'
				},
				player2: {
					name: 'Zachary Richards',
					record: '100-0'
				}
			}
		};
	},

	openLogForm: function () {
		this.setState({ isLogGameOpen: !this.state.isLogGameOpen });
	},

	finishGame: function () {},

	render: function () {
		var logGameClasses = cx({
			'is-open': this.state.isLogGameOpen 
		});

		return (
			React.createElement("div", null, 
				React.createElement("h4", {className: "currentGame-players"}, React.createElement("strong", null, this.state.match.player1.name), " (", this.state.match.player1.record, ")"), 
				React.createElement("h5", null, "vs."), 
				React.createElement("h4", null, React.createElement("strong", null, this.state.match.player2.name), " (", this.state.match.player2.record, ")"), 
				
				React.createElement("hr", null), 
				
				React.createElement("div", {className: "clearfix"}, 
					React.createElement("div", {className: "pull-left"}, 
						React.createElement("p", null, "Estimated time remaining: 9 min")
					), 
					React.createElement("div", {className: "btn-group pull-right"}, 
						React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.openLogForm}, "Log Game"), 
						React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.finishGame}, "Finish Game")
					)
				), 

				React.createElement("div", {className: 'currentGame-logForm slideDown ' + logGameClasses}, 
					React.createElement(LogGameForm, {match: this.state.match})
				)
			)
		);
	}
});

var LogGameForm = React.createClass({displayName: "LogGameForm",

	getDefaultProps: function () {
		return {
			score1: '0',
			score2: '0'
		};
	},

	updateScore: function (val, inputId) {
		this.props[inputId] = val;
		console.log(this.props);
	},

	render: function () {
		return (
			React.createElement("form", {className: "form-horizontal"}, 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "score1", className: "control-label col-xs-7"}, this.props.match.player1.name), 
					React.createElement("div", {className: "col-xs-5"}, 
						React.createElement(LogGameFormInput, {inputId: "score1", updateScore: this.updateScore})
					)
				), 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "score2", className: "control-label col-xs-7"}, this.props.match.player2.name), 
					React.createElement("div", {className: "col-xs-5"}, 
						React.createElement(LogGameFormInput, {inputId: "score2", updateScore: this.updateScore})
					)
				), 
				React.createElement("button", {type: "button", className: "btn btn-default"}, "Submit")
			)
		);
	}

});

var LogGameFormInput = React.createClass({displayName: "LogGameFormInput",

	getInitialState: function () {
		return {
			inputVal: ''
		};
	},

	getDefaultProps: function () {
		return {
			minVal: 0,
			maxVal: 21
		};
	},

	updateVal: function (e) {
		var val = e.target.value;

		if (val >= this.props.minVal && val <= this.props.maxVal || val === '') {
			this.setState({ inputVal: val });
			this.props.updateScore(val, e.target.id);
		}

	},

	render: function () {
		return (
			React.createElement("input", {type: "number", 
				value: this.state.inputVal, 
				required: true, 
				onChange: this.updateVal, 
				min: this.props.minVal, 
				max: this.props.maxVal, 
				name: this.props.inputId, 
				id: this.props.inputId, 
				className: "form-control"})
		);
	}

});

React.render(React.createElement(CurrentGame, null), document.querySelector('#currentGame'));