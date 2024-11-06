import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";

const Legend = () => {
	return (
        <div id="br-controls" className="primary-sans-serif">
            <h3 id="legend-collapse-title">Legend</h3>
            <div id="expand-legend">-</div>
            <div id="legend-layer-controls">
                <h3>Controls</h3>
                <hr></hr>
                <div className="two-column">
                    <div id="base-layer-controls"></div>
                    <div id="over-layer-controls"></div>
                </div>
                <hr></hr>
            </div>
            <div id="legend">
                <h3>Legend</h3>
                <div className="scale">
                    <p id="minDepth">0ft</p>
                    <canvas id="scale" width={256} height={32}></canvas>
                    <p id="maxDepth">12ft</p>
                </div>
                <hr></hr>
            </div>
            <div id="opacity-controls">
                <h3>Overlay Opacity</h3>
                <input id="opacity-slider" className="opacity-slider" type="range" min={0} max={1} step={0.01}></input>
            </div>
        </div>
    );
};

export default Legend;