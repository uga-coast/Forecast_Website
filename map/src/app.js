import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import "./css/ugaStyle.css";
import "./css/style.css";
import "./css/legend.css";
import "./css/sidebar.css";
import "./css/controls.css";

import Legend from "./components/Legend";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import { VERSION } from "./constants.js";

export default function App() {
	var script = document.createElement("script");
	script.innerHTML =
		"var mapsPlaceholder = [];L.Map.addInitHook(function () {mapsPlaceholder.push(this);});";
	document.body.appendChild(script);
	useEffect(() => {
		document.body.dispatchEvent(new Event("beginProcess"));
	});

	// in the future, we can use this isntead of dispatching an event.

	// useEffect(() => {
	// 	async function doAll() {
	// 		await makeTiffList();
	// 		drawLegend();
	// 		drawLayers();
	// 		addMarkers();
	// 	}
	// }, []);

	return (
		<div className="container">
			<Sidebar VERSION={VERSION} />
			<Map />
			<Legend />
		</div>
	);
}
