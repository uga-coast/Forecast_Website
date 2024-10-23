// Global Variables
var map;
var overLayers = [];
let count = 0;

function addMap() {
    // Pane to make it over the base layers
    map.createPane("overlay");
    map.getPane("overlay").style.zIndex = 2;
    map.zoomControl.setPosition("topright");
    console.log(map);
}

async function drawFirstTime(inputTiff) {
    let url_to_geotiff_file = inputTiff.tiff.url;
    let georaster = await parseGeoraster(url_to_geotiff_file);
    // Colors height appropriately
    function doColors(input) {
        let min = inputTiff.tiff.min;
        let max = inputTiff.tiff.max;
        let eval;
        if (min < max) {
            eval = (input > min);
        } else {
            eval = (input < min);
        }
        if (eval) {
            let scale = (input - min)/(max - min);
            if (input > max) {
                scale = 0.999;
            }
            return colorScale(scale);
        }
    }

    // Create the layer
    var tifLayer = new GeoRasterLayer({
        attribution: "Planet",
        georaster: georaster,
        resolution: RESOLUTION,
        pane: "overlay",
        opacity: document.getElementById("opacity-slider").value,
        pixelValuesToColorFn: values => doColors(values[0])
    });

    // Add layer to the list for sorting
    inputTiff.layer = tifLayer;
}

// Adds a geotiff object as a layer
function addTifLayers() {
    addMap();
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
                    function doColors(input) {
                        let min = tiffList[i].min;
                        let max = tiffList[i].max;
                        let eval;
                        if (min < max) {
                            eval = (input > min);
                        } else {
                            eval = (input < min);
                        }
                        if (eval) {
                            let scale = (input - min)/(max - min);
                            if (input > max) {
                                scale = 0.999;
                            }
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