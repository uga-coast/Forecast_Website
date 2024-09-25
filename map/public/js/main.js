var started = false;

let showing;
function addDropdowns() {
    let dropdowns = ["tiff-1","tiff-2","tiff-3","tiff-4","tiff-5"];
    for (let i = 0; i < dropdowns.length; i++) {
        let item = document.getElementById(dropdowns[i]);
        item.addEventListener("change", function() {
            let nl = [];
            for (let j = 0; j <= i; j++) {
                let suspect = document.getElementById(dropdowns[j]);
                nl.push(suspect.value);
            }
            showdrops(nl);
        });
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
            showLayer(met[0]);
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

function showLayer(input) {
    // Remove
    if (showing != null) {
        map.removeLayer(showing.layer);
        if (showing.hurricaneLayer != null) {
            hurricaneLayer.removeLayer(showing.hurricaneLayer.layer);
            hurricaneLayer.removeLayer(showing.hurricaneLayer.line);
            hurricaneLayer.removeLayer(showing.hurricaneLayer.hulls);
        }
    }

    // Reset
    showing = input;

    // Add
    input.layer.addTo(map);
    console.log(input)
    document.getElementById("minDepth").innerText = input.tiff.min + "ft";
    document.getElementById("maxDepth").innerText = input.tiff.max + "ft";
    if (input.hurricaneLayer != null) {
        input.hurricaneLayer.layer.addTo(hurricaneLayer);
        input.hurricaneLayer.line.addTo(hurricaneLayer);
        if (input.tiff.position.includes("ofcl")) {
            input.hurricaneLayer.hulls.addTo(hurricaneLayer);
        }
    }
    updateMarkers(input.tiff);
}

async function doAll() {
    if (!started) {
        started = true;
        document.getElementById("version").innerText = VERSION;
        await getAllTifs();
    }
}
function doNextStep() {
    drawLegend();
    // drawLayers();
    map = mapsPlaceholder[0];
    Promise.all(addTifLayers()).then(function() {
        addDropdowns()
    })
    addMarkers();
}
document.body.addEventListener("beginProcess", doAll);