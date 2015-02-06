import React from 'react/addons';
import ReactAsync from 'react-async';

var ActiveQueue = React.createClass({

	getInitialState: function () {
		return {
			activeQueue: []
		};
	},

	render: function () {
		return (
			<ul className="activeQueueList list-unstyled">
				<hr />
				
				<li>
					{this.state.activeQueue.map(function (queueItem, i) {
						<ActiveQueueItem item={queueItem} />
					})}
				</li>
			</ul>
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

})

React.render(<ActiveQueue/>, document.querySelector('#activeQueue'));