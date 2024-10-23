function prepare() {
    map = mapsPlaceholder[0];
    addMap();
    drawBaseLayers();
    drawLegend();
}

function drawBaseLayers() {
    let baseLayers = [
        {
            name: "Streets",
            default: false,
            layer: L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
                maxZoom: 20,
                subdomains: ["mt0", "mt1", "mt2", "mt3"],
                attribution: "Google",
                pane: "mapPane"
            }),
        },
        {
            name: "Hybrid",
            default: true,
            layer: L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
                maxZoom: 20,
                subdomains: ["mt0", "mt1", "mt2", "mt3"],
                attribution: "Google",
                pane: "mapPane"
            }),
        },
        {
            name: "Satellite",
            default: false,
            layer: L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
                maxZoom: 20,
                subdomains: ["mt0", "mt1", "mt2", "mt3"],
                attribution: "Google",
                pane: "mapPane"
            }),
        },
        {
            name: "Terrain",
            default: false,
            layer: L.tileLayer("http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
                maxZoom: 20,
                subdomains: ["mt0", "mt1", "mt2", "mt3"],
                attribution: "Google",
                pane: "mapPane"
            })
        }
    ]
    let base = document.getElementById("layer-controls");
    for (let i = 0; i < baseLayers.length; i++) {
        let boxxy = document.createElement("div");
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "Base-Layer";
        radio.id = baseLayers[i].name;
        radio.value = baseLayers[i].name;
        boxxy.appendChild(radio);
        let label = document.createElement("label");
        label.for = radio.id;
        label.innerText = baseLayers[i].name;
        boxxy.appendChild(label);
        boxxy.onclick = function() {
            radio.click();
        }
        radio.onchange = function() {
            for (let j = 0; j < baseLayers.length; j++) {
                map.removeLayer(baseLayers[j].layer);
            }
            map.addLayer(baseLayers[i].layer);
        }
        base.appendChild(boxxy);
        if (baseLayers[i].default) {
            boxxy.click();
        }
    }
}

function prepareOverlays(overlays) {
    let base = document.getElementById("layer-controls");
    for (let i = 0; i < overlays.length; i++) {
        let boxxy = document.createElement("div");
        let check = document.createElement("input");
        check.type = "checkbox";
        check.name = overlays.name;
        check.id = overlays[i].name;
        boxxy.appendChild(check);
        let label = document.createElement("label");
        label.for = check.id;
        label.innerText = overlays[i].name;
        boxxy.appendChild(label);
        boxxy.addEventListener("click", function(event) {
            if (event.srcElement != check) {
                check.click();
            }
        })
        check.onchange = function() {
            if (check.checked) {
                map.addLayer(overlays[i].layer);
            } else {
                map.removeLayer(overlays[i].layer);
            }
        }
        base.appendChild(boxxy);
        check.click();
    }
}

function drawLegend() {
    // Opacity
    let opac = document.getElementById("opacity-slider");
    opac.onchange = function(e) {
        let opacThingO = document.getElementsByClassName("leaflet-tile-container")[document.getElementsByClassName("leaflet-tile-container").length - 1];
        console.log(opacThingO);
        opacThingO.style.opacity = e.target.value;
    }
}