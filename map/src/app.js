import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";

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
					<div>
						<select>
							<option>Forecast</option>
							<option>Hurricane</option>
						</select>
					</div>
					<hr></hr>
					<div id="overLayers"></div>
					<hr></hr>
				</div>
				<div id="credits">
					<h1>Credits</h1>
					<p>List of people and stuff</p>
					<img src="logo.png"></img>
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
			<div id="legend">
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