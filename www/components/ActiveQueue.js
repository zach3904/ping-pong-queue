import React from 'react/addons';
import ReactAsync from 'react-async';

var cx = React.addons.classSet;

var ActiveQueue = React.createClass({

	getInitialState: function () {
		return {
			activeQueue: [],
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

				<div className={'addMatchForm ' + addMatchClasses}>
					<AddMatchForm/>
				</div>
				
				<ul className="activeQueueList list-unstyled">
					<hr/>
					<li><ActiveQueueItem/></li>
					<hr/>
					<li><ActiveQueueItem/></li>
					<hr/>
					<li><ActiveQueueItem/></li>
				</ul>
			</div>
		);
	}

});

var AddMatchForm = React.createClass({

	getDefaultProps: function () {
		return {};
	},

	render: function () {
		return (
			<form className="form-horizontal">
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
			</form>
		);
	}

});

var ActiveQueueItem = React.createClass({

	getDefaultProps: function () {
		return {
			item: {}
		};
	},

	render: function () {
		return (
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
		);
	}

});

React.render(<ActiveQueue/>, document.querySelector('#activeQueue'));