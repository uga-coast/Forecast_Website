function makeName(input) {
    let output = "base_" + input.tiff.name;
    if (input.tiff.type == "Hurricane") {
        output = input.tiff.hurricane + "_" + output;
    }
    return output;
}

// Overlay layer control with checkbox function
function makeOverLayerControl(input) {
    if (document.getElementById(makeName(input)) != null) {
        return document.getElementById(makeName(input));
    }
    // Base
    var base = document.createElement("div");
    base.classList.add("overLayer");
    base.id = makeName(input);

    // The checkbox
    var button = document.createElement("input");
    button.name = "Overlayer";
    button.id = input.tiff.name;
    button.value = input.tiff.name;
    button.type = "radio";
    button.classList.add("overlayer-button-here");
    //button.name = "topLayer";
    base.appendChild(button);
    const event = new Event("userChange");
    button.addEventListener("change", function() {
        document.getElementById("opacity-slider").value = 1;
        this.checked = true;

        updateMarkers(input.tiff);

        var list = document.getElementsByName("Overlayer");
        console.log(list.length);
        for (let i = 0; i < list.length; i++) {
            list[i].dispatchEvent(event);
        }
        input.layer.addTo(map);

        if (input.hurricaneLayer != null) {
            input.hurricaneLayer.layer.addTo(hurricaneLayer);
            input.hurricaneLayer.line.addTo(hurricaneLayer);
            input.hurricaneLayer.hulls.addTo(hurricaneLayer);
        }
        
        let zoom = document.getElementById("zoom_" + input.tiff.name);
        document.getElementById("minDepth").innerHTML = input.tiff.min + "ft";
        document.getElementById("maxDepth").innerHTML = input.tiff.max + "ft";
        input.showing = true;
        console.log(input.tiff.name + " turned on");
    })
    button.addEventListener("userChange", function() {
        if (input.showing) {
            map.removeLayer(input.layer);
            if (input.hurricaneLayer != null) {
                hurricaneLayer.removeLayer(input.hurricaneLayer.layer);
                hurricaneLayer.removeLayer(input.hurricaneLayer.line);
                hurricaneLayer.removeLayer(input.hurricaneLayer.hulls);
            }
            console.log(input.tiff.name + " turned off");
        }
        input.showing = false;
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
    boop.id = "zoom_" + input.tiff.name;
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