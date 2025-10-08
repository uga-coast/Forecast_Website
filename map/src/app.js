import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";

import "./css/ugaStyle.css";
import "./css/style.css";
import "./css/legend.css";
import "./css/sidebar.css";
import "./css/controls.css";
import "./css/popup.css";

import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import Legend from "./components/Legend";

export default function App() {
	var script = document.createElement("script");
	script.innerHTML = "var mapsPlaceholder = [];L.Map.addInitHook(function () {mapsPlaceholder.push(this);});";
	document.body.appendChild(script);
    useEffect(() => {
        document.body.dispatchEvent(new Event("beginProcess"));
    });
	return (
		<div className="container">
			<Map />
			<Sidebar />
			<Legend />
		</div>
	);
}