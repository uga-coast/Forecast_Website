// Overlay layer control with checkbox function
function makeOverLayerControl(input) {
    // Base
    var base = document.createElement("div");
    base.classList.add("overLayer");

    // The checkbox
    var button = document.createElement("input");
    button.id = input.tiff.name;
    button.value = input.tiff.name;
    button.type = "checkbox";
    //button.name = "topLayer";
    base.appendChild(button);
    button.addEventListener("change", function() {
        if (input.showing) {
            map.removeLayer(input.layer);
        } else {
            input.layer.addTo(map);
            document.getElementById("minDepth").innerHTML = input.tiff.min + "m";
            document.getElementById("maxDepth").innerHTML = input.tiff.max + "m";
        }
        input.showing = !input.showing;
    });

    // Label
    var title = document.createElement("label");
    title.for = input.tiff.name;
    title.classList.add("overLayerTitle");
    base.appendChild(title);

    // Name
    var name = document.createElement("text");
    name.innerHTML = input.tiff.name;
    title.appendChild(name);

    // Controls
    var control = document.createElement("div");
    control.classList.add("optionButtons");
    title.appendChild(control);

    // Description
    var description = document.createElement("div");
    base.appendChild(description);
    description.style.display = "none";
    description.innerHTML = input.tiff.description;

    // Details button
    var beep = document.createElement("span");
    beep.classList.add("material-symbols-outlined");
    beep.classList.add("controlButton");
    beep.innerHTML = "expand_more";
    control.appendChild(beep);
    beep.addEventListener("click", function() {
        if (description.style.display == "none") {
            beep.innerHTML = "expand_less";
            description.style.display = "block";
        } else {
            beep.innerHTML = "expand_more";
            description.style.display = "none";
        }
    });

    // Zoom in button
    var boop = document.createElement("span");
    boop.classList.add("material-symbols-outlined");
    boop.classList.add("controlButton");
    boop.innerHTML = "zoom_in";
    control.appendChild(boop);
    boop.addEventListener("click", function() {
        if (input.showing) {
            var bounds = input.layer.getBounds();
            var boundSet = [
                [bounds._northEast.lat, bounds._northEast.lng],
                [bounds._southWest.lat, bounds._southWest.lng]
            ]
            map.fitBounds(boundSet);
        }
    });

    return base;
}