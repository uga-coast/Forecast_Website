import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";

const Map = () => {
	return (
		<MapContainer id="map" center={[35, -75]} zoom={5}>
		</MapContainer>
	);
};

export default Map;