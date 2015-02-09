import React from 'react/addons';
import AjaxMixin from '../lib/Ajax';

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
			match: {},
			scores: {
				score1: '',
				score2: ''
			}
		};
	},

	getDefaultProps: function () {
		return {
			scoreMinVal: 0,
			scoreMaxVal: 21
		};
	},

	handleScoreChange: function (e) {
		var val = e.target.value;

		if (val >= this.props.scoreMinVal && val <= this.props.scoreMaxVal || val === '') {
			this.setState({ inputVal: val });
		}
	},

	submitGame: function (e) {
		e.preventDefault();

		// this.post({
		// 	url: '/asdf',
		// 	data: {
		// 		score1: {
		// 			name: this.props.match.player1,
		// 			score: this.refs.score1.value
		// 		},
		// 		score2: {
		// 			name: this.props.match.player2,
		// 			score: this.refs.score2.value
		// 		}
		// 	}
		// }, {
		// 	success: function (e) {
		// 		console.log(e);
		// 	},
		// 	error: function (e) {
		// 		console.log(e);
		// 	}
		// })
	},

	render: function () {
		return (
			React.createElement("form", {className: "form-horizontal", onSubmit: this.submitGame}, 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "score1", className: "control-label col-xs-7"}, React.createElement("strong", null, this.props.match.player1.name)), 
					React.createElement("div", {className: "col-xs-5"}, 
						React.createElement("input", {type: "number", required: true, 
							value: this.state.scores.score1, 
							onChange: this.handleScoreChange, 
							min: this.props.scoreMinVal, 
							max: this.props.scoreMaxVal, 
							name: "score1", 
							id: "score1", 
							className: "form-control"})
					)
				), 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "score2", className: "control-label col-xs-7"}, React.createElement("strong", null, this.props.match.player2.name)), 
					React.createElement("div", {className: "col-xs-5"}, 
						React.createElement("input", {type: "number", required: true, 
							value: this.state.scores.score2, 
							onChange: this.handleScoreChange, 
							min: this.props.scoreMinVal, 
							max: this.props.scoreMaxVal, 
							name: "score2", 
							id: "score2", 
							className: "form-control"})
					)
				), 
				React.createElement("button", {type: "submit", onClick: this.submitGame, className: "btn btn-default pull-right"}, "Submit")
			)
		);
	}

});

React.render(React.createElement(CurrentGame, null), document.querySelector('#currentGame'));