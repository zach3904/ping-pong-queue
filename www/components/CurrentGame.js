import React from 'react/addons';

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

	finishGame: function () {},

	render: function () {
		var logGameClasses = cx({
			'is-open': this.state.isLogGameOpen 
		});

		return (
			<div>
				<h4 className="currentGame-players"><strong>{this.state.match.player1.name}</strong> ({this.state.match.player1.record})</h4>
				<h5>vs.</h5>
				<h4><strong>{this.state.match.player2.name}</strong> ({this.state.match.player2.record})</h4>
				
				<hr/>
				
				<div className="clearfix">
					<div className="pull-left">
						<p>Estimated time remaining: 9 min</p>
					</div>
					<div className="btn-group pull-right">
						<button type="button" className="btn btn-default" onClick={this.openLogForm}>Log Game</button>
						<button type="button" className="btn btn-default" onClick={this.finishGame}>Finish Game</button>
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
			<form className="form-horizontal">
				<div className="form-group">
					<label htmlFor="score1" className="control-label col-xs-7">{this.props.match.player1.name}</label>
					<div className="col-xs-5">
						<LogGameFormInput inputId="score1" updateScore={this.updateScore}/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="score2" className="control-label col-xs-7">{this.props.match.player2.name}</label>
					<div className="col-xs-5">
						<LogGameFormInput inputId="score2" updateScore={this.updateScore}/>
					</div>
				</div>
				<button type="button" className="btn btn-default">Submit</button>
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