import React from 'react/addons';
import mcFly from 'mcfly';

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
			this.setState({ scores: val });
		}
	},

	submitGame: function (e) {
		e.preventDefault();
	},

	render: function () {
		return (
			<form className="form-horizontal" onSubmit={this.submitGame}>
				<div className="form-group">
					<label htmlFor="score1" className="control-label col-xs-7"><strong>{this.props.match.player1.name}</strong></label>
					<div className="col-xs-5">
						<input type="number" required
							value={this.state.scores.score1}
							onChange={this.handleScoreChange}
							min={this.props.scoreMinVal}
							max={this.props.scoreMaxVal}
							name="score1"
							id="score1"
							className="form-control" />
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="score2" className="control-label col-xs-7"><strong>{this.props.match.player2.name}</strong></label>
					<div className="col-xs-5">
						<input type="number" required
							value={this.state.scores.score2}
							onChange={this.handleScoreChange}
							min={this.props.scoreMinVal}
							max={this.props.scoreMaxVal}
							name="score2"
							id="score2"
							className="form-control" />
					</div>
				</div>
				<button type="submit" onClick={this.submitGame} className="btn btn-default pull-right">Submit</button>
			</form>
		);
	}

});

React.render(<CurrentGame/>, document.querySelector('#currentGame'));