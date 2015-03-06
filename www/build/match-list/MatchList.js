'use strict';

import React from 'react/addons';

// components
import CurrentGame from './CurrentGame';
import Queue from './Queue';

export default React.createClass({

	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement("section", {className: "section"}, 
					React.createElement("div", {className: "sectionInner sectionInner--current-game clearfix"}, 
						React.createElement("h5", null, "Current Game"), 
						React.createElement("hr", null), 
						React.createElement("div", {className: "content"}, 
							React.createElement(CurrentGame, null)
						)
					)
				), 
				
				React.createElement("section", {className: "section"}, 
					React.createElement("div", {className: "sectionInner clearfix"}, 
						React.createElement("h5", null, "Active Queue"), 
						React.createElement("hr", null), 
						React.createElement("div", {className: "content"}, 
							React.createElement(Queue, null)
						)
					)
				)
			)
		);
	}

});