// Global Variables
var map;
var overLayers = [];
let count = 0;

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
    let promiseList = [];

    console.log(tiffList);
    for (let i = 0; i < tiffList.length; i++) {
        let url_to_geotiff_file = tiffList[i].url;

        function rasterize(link) {
            try {
                promiseList.push(parseGeoraster(link).then(georaster => {
                    // console.log("georaster:", georaster);
    
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
                        pane: "overlay",
                        opacity: 0.75,
                        pixelValuesToColorFn: values => doColors(values[0])
                    });
    
                    // Add layer to the list for sorting
                    let layer = new Layer(tiffList[i], "overlay", tifLayer, addHurricaneLayer(tiffList[i]));
                    overLayers.push(layer);
                }).catch((err) => {
                }));
            } catch(e) {
            }
        }
        rasterize(url_to_geotiff_file);
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
    } else if (SortType == "Date") {
        sort = function(inputa, inputb) {
            var itema = inputa.tiff.description;
            var itemb = inputb.tiff.description;
            return itemb.localeCompare(itema);
        }
    }

    sortBy(sort);
    var activeLayers = document.getElementsByName("Overlayer");
    for (let i = 0; i < activeLayers.length; i++) {
        activeLayers[i].dispatchEvent(new Event("userChange"));
    }
    var base = document.getElementById("overLayers");
    while (base.firstChild) {
        base.removeChild(base.firstChild);
    }

    // Get mode type to display
    let ModelType = "None";
    var TModelType = document.getElementById("ModelType").value;
    for (let i = 0; i < DISPLAY_TO_URL.length; i++) {
        if (DISPLAY_TO_URL[i][0] == TModelType) {
            ModelType = DISPLAY_TO_URL[i][1];
        }
    }
    console.log(ModelType)

    // Hurricane
    if (ModelType == "Hurricane") {
        for (let i = 0; i < HURRICANES.length; i++) {
            let thisH = document.createElement("div");
            thisH.id = HURRICANES[i];

            let title = document.createElement("h3");
            title.innerText = HURRICANES[i];
            thisH.appendChild(title);

            base.appendChild(thisH);
        }
    }

    // Add the radio button selectors
    for (let i = 0; i < overLayers.length; i++) {
        if (overLayers[i].tiff.type == ModelType) {
            if (ModelType == "forecast") {
                var element = makeOverLayerControl(overLayers[i]);
                base.appendChild(element);
            } else if (ModelType == "Hurricane") {
                var element = makeOverLayerControl(overLayers[i]);
                console.log(overLayers[i].tiff.hurricane)
                document.getElementById(overLayers[i].tiff.hurricane).appendChild(element);
            }
        }
    }

    // Open top tiff
    let hurricanes = document.getElementsByClassName("overlayer-button-here");
    if (hurricanes.length > 0) {
        hurricanes[0].dispatchEvent(new Event("change"));
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
    // LAZY METHOD. PLEASE FIX PROMISES.
    // var currentList = 0;
    // function startMakeControl() {
    //     if (overLayers.length != currentList) {
    //         makeControl();
    //         var list = document.getElementsByClassName("overlayer-button-here");
    //         var isOn = false;
    //         for (let i = 0; i < list.length; i++) {
    //             if (list[i].checked) {
    //                 isOn = true;
    //             }
    //         }
    //         if (!isOn) {
    //             list[0].dispatchEvent(new Event("change"));
    //         }
    //         currentList = overLayers.length;
    //     }
    // }
}