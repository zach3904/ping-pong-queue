'use strict';

import React from 'react/addons';

// components
import CurrentGame from './CurrentGame';
import Queue from './Queue';

export default React.createClass({

	render: function () {
		return (
			<div>
				<section className="section">
					<div className="sectionInner sectionInner--current-game clearfix">
						<h5>Current Game</h5>
						<hr/>
						<div className="content">
							<CurrentGame />
						</div>
					</div>
				</section>
				
				<section className="section">
					<div className="sectionInner clearfix">
						<h5>Active Queue</h5>
						<hr/>
						<div className="content">
							<Queue />
						</div>
					</div>
				</section>
			</div>
		);
	}

});