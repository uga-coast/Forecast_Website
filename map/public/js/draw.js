// Global Variables
var map;
var overLayers = [];

// Adds a geotiff object as a layer
function addTifLayers() {
    // Pane to make it over the base layers
    map.createPane("overlay");
    map.getPane("overlay").style.zIndex = 2;

    // Make custom button
    var fullscreen = L.Control.extend({
        options: {
            position: "topleft"
        },
        onAdd: function (map) {
            var button = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom material-symbols-outlined fullscreen-button');
    
            button.innerHTML = "fullscreen";
    
            button.onclick = function(){
                document.getElementsByClassName("container")[0].classList.toggle("fullscreen");
                if (button.innerHTML == "fullscreen") {
                    button.innerHTML = "fullscreen_exit";
                } else if (button.innerHTML == "fullscreen_exit") {
                    button.innerHTML = "fullscreen";
                }
            }
    
            return button;
        }
    })
    map.addControl(new fullscreen());

    var promiseList = [];
    for (let i = 0; i < tiffList.length; i++) {
        var url_to_geotiff_file = tiffList[i].url;

        try {
            promiseList.push(parseGeoraster(url_to_geotiff_file).then(georaster => {
                console.log("georaster:", georaster);

                //    GeoRasterLayer is an extension of GridLayer,
                //    which means can use GridLayer options like opacity.
                //    Just make sure to include the georaster option!
                //    http://leafletjs.com/reference-1.2.0.html#gridlayer

                // Colors height appropriately
                function colorScale(value) {
                    var r = 0;
                    var g = 0;
                    var b = 0;

                    if (value < 0.5) { // Blue -> Green
                        b = 1 - 2*value;
                        g = 2 * value;
                    } else if (value < 1) { // Green -> Red
                        g = 1 - 2*(value - 0.5);
                        r = 2*(value - 0.5);
                    } else { // Red
                        r = 1;
                    }
                    function flhex(input) {
                        return Math.floor(256*input);
                    }
                    return "rgb(" + flhex(r) + "," + flhex(g) + "," + flhex(b) + ")";
                }
                function doColors(input) {
                    var min = tiffList[i].min;
                    var max = tiffList[i].max;
                    var eval;
                    if (min < max) {
                        eval = (input > min);
                    } else {
                        eval = (input < min);
                    }
                    if (eval) {
                        var scale = (input - min)/(max - min);
                        return colorScale(scale);
                    }
                }

                // Create the layer
                var tifLayer = new GeoRasterLayer({
                    attribution: "Planet",
                    georaster: georaster,
                    resolution: RESOLUTION,
                    opacity: 0.75,
                    pane: "overlay",
                    pixelValuesToColorFn: values => doColors(values[0])
                });

                // Add layer to the list for sorting
                overLayers.push(new Layer(tiffList[i], "overlay", tifLayer));
            }));
        } catch (e) {
            console.log("owo")
        }
    }
    return promiseList;
}

function sortBy(sort) {
    for (let i = 0; i < overLayers.length - 1; i++) {
        for (let j = i + 1; j < overLayers.length; j++) {
            if (sort(overLayers[i], overLayers[j]) > 0) {
                var temp = overLayers[i];
                overLayers[i] = overLayers[j];
                overLayers[j] = temp;
            }
        }
    }
}
// Creates the control panel for layer display
function makeControl() {
    var sort;
    var SortType = document.getElementById("SortType").value;
    if (SortType == "Alphabetical") {
        sort = function(inputa, inputb) {
            var itema = inputa.tiff.name;
            var itemb = inputb.tiff.name;
            return itema.localeCompare(itemb);
        }
    }

    sortBy(sort);
    var base = document.getElementById("overLayers");
    while (base.firstChild) {
        base.removeChild(base.firstChild);
    }
    var ModelType = document.getElementById("ModelType").value;
    for (let i = 0; i < overLayers.length; i++) {
        if (overLayers[i].tiff.type == ModelType) {
            var element = makeOverLayerControl(overLayers[i]);
            base.appendChild(element);
        }
    }
}

// Draws all elements
function drawLayers() {
    // Find the map
    // This is a pain. Don't get me started
    map = mapsPlaceholder[0];
    // Make the Tif layers
    // Then add the control sidebar
    Promise.all(addTifLayers()).then(makeControl);
    document.getElementById("ModelType").addEventListener("change", makeControl);
    document.getElementById("SortType").addEventListener("change", makeControl);
}