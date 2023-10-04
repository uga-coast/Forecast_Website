import React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Pane } from "react-leaflet/Pane";
import { useMap } from "react-leaflet/hooks";

const Map = () => {
	return (
		<MapContainer id="map" center={[35, -75]} zoom={5}>
			<LayersControl position="topleft">
				<Pane name="base" style={{ zIndex: 1 }}>
					<LayersControl.BaseLayer name="Streets">
						<TileLayer
							url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
							maxZoom={20}
							subdomains={["mt0", "mt1", "mt2", "mt3"]}
							attribution="Google"
						></TileLayer>
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer checked name="Hybrid">
						<TileLayer
							url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
							maxZoom={20}
							subdomains={["mt0", "mt1", "mt2", "mt3"]}
							attribution="Google"
						></TileLayer>
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name="Satellite">
						<TileLayer
							url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
							maxZoom={20}
							subdomains={["mt0", "mt1", "mt2", "mt3"]}
							attribution="Google"
						></TileLayer>
					</LayersControl.BaseLayer>
					<LayersControl.BaseLayer name="Terrain">
						<TileLayer
							url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
							maxZoom={20}
							subdomains={["mt0", "mt1", "mt2", "mt3"]}
							attribution="Google"
						></TileLayer>
					</LayersControl.BaseLayer>
				</Pane>
			</LayersControl>
		</MapContainer>
	);
};

export default Map;
