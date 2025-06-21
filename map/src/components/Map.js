import React, { useRef } from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";

const Map = () => {
	const mapRef = useRef(null);

	const handleFullscreen = () => {
		const containerNode = document.querySelector(".container");
		if (!document.fullscreenElement) {
			if (containerNode.requestFullscreen) {
				containerNode.requestFullscreen();
			} else if (containerNode.mozRequestFullScreen) {
				containerNode.mozRequestFullScreen();
			} else if (containerNode.webkitRequestFullscreen) {
				containerNode.webkitRequestFullscreen();
			} else if (containerNode.msRequestFullscreen) {
				containerNode.msRequestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	};

	return (
		<div style={{ position: "relative", width: "100%", height: "100%" }}>
			<button
				className="fullscreen-button"
				style={{
					position: "absolute",
					bottom: 16,
					left: 16,
					zIndex: 1000,
				}}
				onClick={handleFullscreen}
				aria-label="Toggle fullscreen"
			>
				⛶
			</button>
			<MapContainer id="map" center={[35, -75]} zoom={5} ref={mapRef} style={{ width: "100%", height: "100%" }}>
			</MapContainer>
		</div>
	);
};

export default Map;