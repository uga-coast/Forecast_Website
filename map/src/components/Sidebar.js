import React from "react";

const Sidebar = ({ VERSION }) => {
	return (
		<div id="sidebar">
			<div id="controls">
				<div className="primary-serif">
					<select id="ModelType">
						<option>Hurricane</option>
						<option>Daily Forecast</option>
						<option>Archive</option>
					</select>
					<select id="SortType">
						<option>Date</option>
						<option>Alphabetical</option>
					</select>
				</div>
				<hr></hr>
				<div id="overLayers" className="secondary-sans-serif"></div>
				<hr></hr>
			</div>
			<div id="credits" className="secondary-serif">
				<img src="logo.png"></img>
				<a href="https://coast.engr.uga.edu/">UGA Coast Website</a>
				<br></br>
				<b>Version: </b>
				<text id="version">{VERSION}</text>
			</div>
		</div>
	);
};

export default Sidebar;
