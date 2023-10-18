import React, { useState } from "react";

export default function Control({ input, map }) {
	const [showing, setShowing] = useState(false);

	const handleCheckboxChange = () => {
		document.getElementById("opacity-slider").value = 1;
		var list = document.getElementsByName("Overlayer");
		console.log(list.length);
		for (let i = 0; i < list.length; i++) {
			list[i].dispatchEvent(new Event("userChange"));
		}
		input.layer.addTo(map);
		let zoom = document.getElementById("zoom_" + input.tiff.name);
		console.log(zoom);
		setTimeout(function () {
			zoom.click();
		}, 1000);
		document.getElementById("minDepth").innerHTML = input.tiff.min + "m";
		document.getElementById("maxDepth").innerHTML = input.tiff.max + "m";
		setShowing(true);
		console.log(input.tiff.name + " turned on");
	};

	const handleUserChange = () => {
		if (showing) {
			map.removeLayer(input.layer);
			console.log(input.tiff.name + " turned off");
		}
		setShowing(false);
	};

	const handleDetailsButtonClick = () => {
		const description = document.getElementById(
			`description_${input.tiff.name}`
		);
		const beep = document.getElementById(`beep_${input.tiff.name}`);
		if (description.style.display === "none") {
			beep.innerHTML = "expand_less";
			description.style.display = "block";
		} else {
			beep.innerHTML = "expand_more";
			description.style.display = "none";
		}
	};

	const handleZoomInButtonClick = () => {
		console.log("uwu");
		if (showing) {
			var bounds = input.layer.getBounds();
			var boundSet = [
				[bounds._northEast.lat, bounds._northEast.lng],
				[bounds._southWest.lat, bounds._southWest.lng],
			];
			map.fitBounds(boundSet);
		}
	};

	return (
		<div className="overLayer" id={`base_${input.tiff.name}`}>
			<input
				name="Overlayer"
				id={input.tiff.name}
				value={input.tiff.name}
				type="radio"
				className="overlayer-button-here"
				onChange={handleCheckboxChange}
			/>
			<label htmlFor={input.tiff.name} className="overLayerTitle">
				<text>{input.tiff.name}</text>
				<div className="optionButtons">
					<span
						className="material-symbols-outlined controlButton"
						id={`beep_${input.tiff.name}`}
						onClick={handleDetailsButtonClick}
					>
						expand_more
					</span>
					<span
						className="material-symbols-outlined controlButton"
						id={`zoom_${input.tiff.name}`}
						onClick={handleZoomInButtonClick}
					>
						zoom_in
					</span>
				</div>
			</label>
			<div
				id={`description_${input.tiff.name}`}
				style={{ display: "none" }}
			>
				{input.tiff.description}
			</div>
		</div>
	);
}
