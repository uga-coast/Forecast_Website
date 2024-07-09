import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";

const Legend = () => {
	return (
        <div id="legend" className="primary-sans-serif">
            <h3>Legend</h3>
            <div className="scale">
                <p id="minDepth"></p>
                <img id="scale" src="turbo2.svg"></img>
                <p id="maxDepth"></p>
            </div>
        </div>
    );
};

export default Legend;