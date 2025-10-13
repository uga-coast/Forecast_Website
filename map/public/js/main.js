var started = false;

let showing;
function addDropdowns() {
    let dropdowns = ["tiff-1","tiff-2","tiff-3","tiff-4","tiff-5"];
    for (let i = 0; i < dropdowns.length; i++) {
        let item = document.getElementById(dropdowns[i]);
        // Event listener for tiff-1 from Bret: Hurricane vs. Daily Forecast
        item.addEventListener("change", function() {
            // Dispatching React custom event based on H or DF selection to communicate with Calendar component
            if (i === 0) {
                let value = this.value;
                if (value === "Hurricane" || value === "Daily Forecast") {
                    document.body.dispatchEvent(new CustomEvent('modeChange', {detail: {mode: value}}));
                    // Hide previous Bret cascading dropdowns
                    for (let j = 1; j < dropdowns.length; j++) {
                        document.getElementById(dropdowns[j]).classList.add("closed-dropdown");
                    } // for
                    return;
                } // if 
            } // if

            // Bret code before:
            let nl = [];
            for (let j = 0; j <= i; j++) {
                let suspect = document.getElementById(dropdowns[j]);
                nl.push(suspect.value);
            }
            showdrops(nl);
            // Bret code before ends. 
        }); // event-listener for tiff-1 (H or DF)
        document.getElementById(dropdowns[0]).classList.remove("closed-dropdown");
        showdrops([]);
    }
    function addDrop(input) {
        let met = [];
        for (let i = 0; i < overLayers.length; i++) {
            let match = true;
            for (let j = 0; j < input.length; j++) {
                if (overLayers[i].tiff.position[j] != input[j]) {
                    match = false;
                }
            }
            if (match) {
                met.push(overLayers[i]);
            }
        }
        let output = [];
        for (let i = 0; i < met.length; i++) {
            let nep = met[i].tiff.position[input.length];
            if (!output.includes(nep)) {
                output.push(nep);
            }
        }
        if (met.length == 1) {
            showLayer(met[0], false);
        }
        
        // Sort
        for (let i = 0; i < output.length - 1; i++) {
            for (let j = i + 1; j < output.length; j++) {
                if (output[i] < output[j]) {
                    let temp = output[i];
                    output[i] = output[j];
                    output[j] = temp;
                }
            }
        }
        return output;
    }
    function showdrops(input) {
        for (let i = 0; i < dropdowns.length; i++) {
            let item = document.getElementById(dropdowns[i]);
            if (i < input.length) {
                item.value = input[i];
                item.classList.remove("closed-dropdown");
            } else {
                item.classList.remove("closed-dropdown");
                while (item.options.length > 0) {
                    item.remove(item.options[0]);
                }
                if (i == input.length) {
                    let def = document.createElement("option");
                    def.innerText = "Select";
                    def.value = "NONE";
                    def.selected = true;
                    def.disabled = true;
                    def.hidden = true;
                    item.add(def);

                    let list = addDrop(input);
                    if (list[0] != undefined) {
                        for (let j = 0; j < list.length; j++) {
                            let opt = document.createElement("option");
                            opt.innerText = list[j];
                            opt.value = list[j];
                            item.add(opt);
                        }
                    } else {
                        item.classList.add("closed-dropdown");
                    }
                } else {
                    item.classList.add("closed-dropdown");
                }
            }
        }

    }
}

async function showLayer(input, customMinMax) {
    console.log(input);
    // Remove
    if (showing != null) {
        map.removeLayer(showing.layer);
        for (let i = 0; i < clickPointObject.markers.length; i++) {
            clickPointObject.markers[i].remove();
        }
        clickPointObject.markers = [];
        if (showing.hurricaneLayer != null) {
            hurricaneLayer.removeLayer(showing.hurricaneLayer.hurrLayer);
            hurricaneLayer.removeLayer(showing.hurricaneLayer.hulls[0]);

            trackLayer.removeLayer(showing.hurricaneLayer.tracLayer);
            trackLayer.removeLayer(showing.hurricaneLayer.line);
        }
    }

    // Reset
    showing = input;

    if (input.rendered == false || customMinMax) {
        await drawFirstTime(input, customMinMax);
    }

    // Add
    input.layer.addTo(map);
    document.getElementById("tiff-name").innerText = input.tiff.description;
    if (!customMinMax) {
        updateMinMax(input.tiff.min, input.tiff.max);
    }

    if (input.tiff.hurricaneLayer != null) {
        input.tiff.hurricaneLayer.hurrLayer.addTo(hurricaneLayer);
        console.log(input.tiff.hurricaneLayer.hulls);
        input.tiff.hurricaneLayer.hulls[0].addTo(hurricaneLayer);

        input.tiff.hurricaneLayer.tracLayer.addTo(trackLayer);
        input.tiff.hurricaneLayer.line.addTo(trackLayer);
    }
    updateMarkers(input.tiff);
}

async function doAll() {
    if (!started) {
        started = true;
        document.getElementById("version").innerText = VERSION;
        await getAllTifs();
        console.log(tiffList);
    }
}

function prepareItems() {
    prepare();

    overLayers = [];
    for (let i = 0; i < tiffList.length; i++) {
        let layer = new Layer(tiffList[i], "overlay", undefined, tiffList[i].hurricaneLayer);
        overLayers.push(layer);
    }

    addDropdowns();
    addMarkers();

    // Automatically render most recent Daily Forecast by retrieving the DF info as a list and finding most recent DF item out of DF list
    let dailyForecastList = overLayers.filter(layer => layer.tiff.type != "hurricane");
    // Find most recent date out of the DF list 
    dailyForecastList.sort((a, b) => b.tiff.date - a.tiff.date);
    // Render most recent DF 
    if (dailyForecastList.length > 0) {
        showLayer(dailyForecastList[0], false);
    } // if
}

function doNextStep() {
    Promise.all(addTifLayers()).then(function() {
        addDropdowns();
    })
    addMarkers();
}

document.body.addEventListener("beginProcess", doAll);