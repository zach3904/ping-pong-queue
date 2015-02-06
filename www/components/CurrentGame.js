import React from 'react';

//React.render(<h1>Testing</h1>, document.getElementById('currentGame'));

/*
var testClass = React.createClass({
    render: function () {
        return (
            <h1>Testing Class</h1>
        )
    }
});
React.render(testClass, document.getElementById('currentGame'));
*/

var CurrentGame = React.createClass({
	render: function () {
		return (
			<div>
				<h4 className="currentGame-players"><strong>Zachary R.</strong> (37-5)</h4>
				<h5>vs.</h5>
				<h4><strong>Matthew O.</strong> (100-0)</h4>

				<hr/>

				<div className="pull-left">
					<p>Estimated time remaining: 8 min</p>
				</div>
				<div className="btn-group pull-right">
					<button type="button" className="btn btn-default">Log Game</button>
					<button type="button" className="btn btn-default">Finish Game</button>
				</div>
			</div>
		);
	}
});

React.render(<CurrentGame/>, document.querySelector('currentGame'));