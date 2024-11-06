function prepare() {
    map = mapsPlaceholder[0];
    addMap();
    drawBaseLayers();
    drawLegend();
    handleExpand();
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
    let base = document.getElementById("base-layer-controls");
    for (let i = 0; i < baseLayers.length; i++) {
        let boxxy = document.createElement("div");
        boxxy.classList.add("layer-control-button");
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
        radio.style.cursor = "inherit";
        label.style.cursor = "inherit";
        base.appendChild(boxxy);
        if (baseLayers[i].default) {
            boxxy.click();
        }
    }
}

function prepareOverlays(overlays) {
    let base = document.getElementById("over-layer-controls");
    for (let i = 0; i < overlays.length; i++) {
        let boxxy = document.createElement("div");
        boxxy.classList.add("layer-control-button");
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
        check.style.cursor = "inherit";
        label.style.cursor = "inherit";
        base.appendChild(boxxy);
        check.click();
    }
}

function drawLegend() {
    // Opacity
    let opac = document.getElementById("opacity-slider");
    opac.value = 0.7;
    opac.onchange = function(e) {
        let target = showing.layer;
        target.setOpacity(e.target.value);
    }

    // Scale
    let c = document.getElementById("scale");
    let width = c.width;
    let height = c.height;
    let ctx = c.getContext("2d");
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i++) {
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,height);
        ctx.strokeStyle = colorScale(i/width);
        ctx.stroke();
    }
    // Scale dividers
    let dividers = 4;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    for (let i = 1; i < dividers; i++) {
        ctx.beginPath();
        ctx.moveTo(i*width/dividers, 0);
        ctx.lineTo(i*width/dividers, height);
        ctx.stroke();
    }
}

function updateMinMax(min, max) {
    document.getElementById("minDepth").innerText = min + "ft";
    document.getElementById("maxDepth").innerText = max + "ft";
}

function handleExpand() {
    let button = document.getElementById("expand-legend");
    let children = ["legend-layer-controls", "legend", "opacity-controls"];
    let expand = true;
    button.addEventListener("click", function() {
        if (expand) {
            // collapse
            for (let i = 0; i < children.length; i++) {
                document.getElementById(children[i]).style.display = "none";
            }
            button.innerText = "+";
            button.style.position = "relative";
            document.getElementById("legend-collapse-title").style.display = "block";
        } else {
            // expand
            for (let i = 0; i < children.length; i++) {
                document.getElementById(children[i]).style.display = "block";
            }
            button.innerText = "-";
            button.style.position = "absolute";
            document.getElementById("legend-collapse-title").style.display = "none";
        }
        expand = !expand;
    })
}