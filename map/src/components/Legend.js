import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";

const Legend = () => {
	return (
        <div id="br-controls" className="primary-sans-serif">
            <div id="layer-controls">
                <h3>Controls</h3>
            </div>
            <div id="legend">
                <h3>Legend</h3>
                <div className="scale">
                    <p id="minDepth">0ft</p>
                    <img id="scale" src="turbo2.svg"></img>
                    <p id="maxDepth">12ft</p>
                </div>
                <input id="opacity-slider" className="opacity-slider" type="range" min={0} max={1} step={0.01}></input>
            </div>
        </div>
    );
};

export default Legend;