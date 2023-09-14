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

export default function App() {
	var script = document.createElement("script");
	script.innerHTML = "var mapsPlaceholder = [];L.Map.addInitHook(function () {mapsPlaceholder.push(this);});";
	document.body.appendChild(script);
    useEffect(() => {
        document.body.dispatchEvent(new Event("beginProcess"));
    });
	return (
		<div className="container">
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
					<b>Version: </b><text id="version">Loading</text>
				</div>
			</div>
			<MapContainer id="map" center={[35, -75]} zoom={5}>
				<LayersControl position="topleft">
					<Pane name="base" style={{ zIndex: 1 }}>
						<LayersControl.BaseLayer name="Streets">
							<TileLayer
								url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
								maxZoom={20}
								subdomains={["mt0","mt1","mt2","mt3"]}
								attribution="Google"
							></TileLayer>
						</LayersControl.BaseLayer>
						<LayersControl.BaseLayer checked name="Hybrid">
							<TileLayer
								url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
								maxZoom={20}
								subdomains={["mt0","mt1","mt2","mt3"]}
								attribution="Google"
							></TileLayer>
						</LayersControl.BaseLayer>
						<LayersControl.BaseLayer name="Satellite">
							<TileLayer
								url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
								maxZoom={20}
								subdomains={["mt0","mt1","mt2","mt3"]}
								attribution="Google"
							></TileLayer>
						</LayersControl.BaseLayer>
						<LayersControl.BaseLayer name="Terrain">
							<TileLayer
								url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
								maxZoom={20}
								subdomains={["mt0","mt1","mt2","mt3"]}
								attribution="Google"
							></TileLayer>
						</LayersControl.BaseLayer>
					</Pane>
				</LayersControl>
			</MapContainer>
			<div id="legend" className="primary-sans-serif">
				<h3>Legend</h3>
				<div className="scale">
					<p id="minDepth"></p>
					<div id="depth">Hush</div>
					<p id="maxDepth"></p>
				</div>
			</div>
		</div>
	);
}