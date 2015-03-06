import React from 'react/addons';

var cx = React.addons.classSet;

var Queue = React.createClass({

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
			<div>
				<button type="button" className="addMatchBtn btn btn-primary" onClick={this.toggleAddMatchForm}>Add Your Match</button>

				<div className={'addMatchForm panel panel-default ' + addMatchClasses}>
					<div className="panel-body">
						<h5>New Match</h5>

						<AddMatchForm />
					</div>
				</div>
				
				<ul className="activeQueueList list-unstyled">
					{this.props.matches.map(function (match, i) {
						return (
							<QueueItem match={match} />
						);
					})}
				</ul>
			</div>
		);
	}

});

var AddMatchForm = React.createClass({

	addMatch: function (e) {
		e.preventDefault();
	},

	render: function () {
		return (
			<form className="form-horizontal" onSubmit={this.addMatch}>
				<div className="form-group">
					<label htmlFor="player1" className="control-label col-xs-3">Player 1</label>
					<div className="col-xs-9">
						<input type="text" name="player1" id="player1" className="form-control"/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="player2" className="control-label col-xs-3">Player 2</label>
					<div className="col-xs-9">
						<input type="text" name="player2" id="player2" className="form-control"/>
					</div>
				</div>
				<button type="submit" className="btn btn-primary pull-right">Submit</button>
			</form>
		);
	}

});

var QueueItem = React.createClass({

	getDefaultProps: function () {
		return {
			match: {}
		};
	},

	render: function () {
		console.log(this.props.match);

		return (
			<li>
				<div className="row">
					<div className="col-xs-9">
						<p><strong>Sekou R. (12-2)</strong></p>
						<div>vs.</div>
						<p><strong>Jake W. (15-3)</strong></p>
					</div>
					<div className="col-xs-3">
						<div className="btn-group-vertical pull-right">
							<button type="button" className="btn btn-sm btn-default">Delay</button>
							<button type="button" className="btn btn-sm btn-danger">Cancel</button>
						</div>
					</div>
				</div>
			</li>
		);
	}

});

export default Queue;