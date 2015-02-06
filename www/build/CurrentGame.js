import React from 'react/addons';
import Ajax from '../lib/Ajax';

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

	render: function () {
		var logGameClasses = cx({
			'hidden': !this.state.isLogGameOpen 
		});

		var firstPlayerName = this.state.match.player1.name.split(' ')[0] + ' ' + this.state.match.player1.name.split(' ')[1].substring(0, 1) + '.';
		var secondPlayerName = this.state.match.player2.name.split(' ')[0] + ' ' + this.state.match.player2.name.split(' ')[1].substring(0, 1) + '.';

		return (
			React.createElement("div", null, 
				React.createElement("h4", {className: "currentGame-players"}, React.createElement("strong", null, firstPlayerName), " (", this.state.match.player1.record, ")"), 
				React.createElement("h5", null, "vs."), 
				React.createElement("h4", null, React.createElement("strong", null, secondPlayerName), " (", this.state.match.player2.record, ")"), 
				
				React.createElement("hr", null), 
				
				React.createElement("div", {className: "clearfix"}, 
					React.createElement("div", {className: "pull-left"}, 
						React.createElement("p", null, "Estimated time remaining: 9 min")
					), 
					React.createElement("div", {className: "pull-right"}, 
						React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.openLogForm}, "Log Game")
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

	getInitialState: function () {
		return {
			match: {}
		};
	},

	updateScore: function (val, inputId) {
		this.props.results[inputId].score = val;
	},

	submitGame: function () {
		Ajax.post({
			url: '/finishGame',
			data: {
				matchId: 24,
				results: this.props.results
			}
		}, {
			success: function () {
				console.log('success');
			},
			error: function (e) {
				console.log('error', e);
			}
		});
	},

	render: function () {
		return (
			React.createElement("form", {className: "form-horizontal", onSubmit: this.submitGame}, 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "score1", className: "control-label col-xs-7"}, React.createElement("strong", null, this.props.match.player1.name)), 
					React.createElement("div", {className: "col-xs-5"}, 
						React.createElement(LogGameFormInput, {inputId: "score1", updateScore: this.updateScore})
					)
				), 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "score2", className: "control-label col-xs-7"}, React.createElement("strong", null, this.props.match.player2.name)), 
					React.createElement("div", {className: "col-xs-5"}, 
						React.createElement(LogGameFormInput, {inputId: "score2", updateScore: this.updateScore})
					)
				), 
				React.createElement("button", {type: "submit", className: "btn btn-default pull-right"}, "Submit")
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
			maxVal: 21,
			inputId: ''
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