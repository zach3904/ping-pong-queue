import React from 'react/addons';
import Ajax from '../lib/Ajax';

var cx = React.addons.classSet;

var CurrentGame = React.createClass({

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
			<div>
				<h4 className="currentGame-players"><strong>{firstPlayerName}</strong> ({this.state.match.player1.record})</h4>
				<h5>vs.</h5>
				<h4><strong>{secondPlayerName}</strong> ({this.state.match.player2.record})</h4>
				
				<hr/>
				
				<div className="clearfix">
					<div className="pull-left">
						<p>Estimated time remaining: 9 min</p>
					</div>
					<div className="pull-right">
						<button type="button" className="btn btn-default" onClick={this.openLogForm}>Log Game</button>
					</div>
				</div>

				<div className={'currentGame-logForm slideDown ' + logGameClasses}>
					<LogGameForm match={this.state.match}/>
				</div>
			</div>
		);
	}
});

var LogGameForm = React.createClass({

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
			<form className="form-horizontal" onSubmit={this.submitGame}>
				<div className="form-group">
					<label htmlFor="score1" className="control-label col-xs-7"><strong>{this.props.match.player1.name}</strong></label>
					<div className="col-xs-5">
						<LogGameFormInput inputId="score1" updateScore={this.updateScore}/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="score2" className="control-label col-xs-7"><strong>{this.props.match.player2.name}</strong></label>
					<div className="col-xs-5">
						<LogGameFormInput inputId="score2" updateScore={this.updateScore}/>
					</div>
				</div>
				<button type="submit" className="btn btn-default pull-right">Submit</button>
			</form>
		);
	}

});

var LogGameFormInput = React.createClass({

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
			<input type="number"
				value={this.state.inputVal}
				required
				onChange={this.updateVal}
				min={this.props.minVal}
				max={this.props.maxVal}
				name={this.props.inputId}
				id={this.props.inputId}
				className="form-control" />
		);
	}

});

React.render(<CurrentGame/>, document.querySelector('#currentGame'));