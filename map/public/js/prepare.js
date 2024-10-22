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
    let base = document.getElementById("legend");
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