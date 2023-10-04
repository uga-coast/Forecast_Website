import React from "react";
import { useState } from "react";

const Legend = () => {
	const [sliderValue, setSliderValue] = useState(0.75);
	return (
		<div id="legend" className="primary-sans-serif">
			<h3>Legend</h3>
			<div className="scale">
				<p id="minDepth"></p>
				<div id="depth">Hush</div>
				<p id="maxDepth"></p>
			</div>
			<input
				type="range"
				id="opacity-slider"
				className="opacity-slider"
				min={0}
				max={1}
				step={0.01}
				value={sliderValue}
				onChange={(e) => setSliderValue(e.target.value)}
				//make slider actually change the opacity. (find the function that does this in the original code)
			/>
		</div>
	);
};

// function drawLegend() {
// 	var base = document.getElementById("legend");

// 	// Opacity
// 	var opac = document.createElement("input");
// 	opac.id = "opacity-slider";
// 	opac.classList.add("opacity-slider");
// 	opac.type = "range";
// 	opac.min = 0;
// 	opac.max = 1;
// 	opac.value = 0.75;
// 	opac.step = 0.01;
// 	opac.onchange = function (e) {
// 		var opacThingO = document.getElementsByClassName(
// 			"leaflet-tile-container"
// 		)[document.getElementsByClassName("leaflet-tile-container").length - 1];
// 		console.log(opacThingO);
// 		opacThingO.style.opacity = e.target.value;
// 	};

// 	base.appendChild(opac);
// }
// old code ^^

export default Legend;
