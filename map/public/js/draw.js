// Global Variables
var map;
var overLayers = [];
let count = 0;

let globalGeo;
let clickPointObject = {
    active: false,
    url_to_geotiff_file: null,
    file: null,
    image: null,
    markers: [],
};

function addMap() {
    // Pane to make it over the base layers
    map.createPane("overlay");
    map.getPane("overlay").style.zIndex = 2;
    map.zoomControl.setPosition("topright");
    console.log(map);
}

async function clickPoint(event, bounds) {
    let latlng = map.mouseEventToLatLng(event.originalEvent);

    let file = clickPointObject.file;
    let image = clickPointObject.image;
    if (clickPointObject.file == null) {
        file = await GeoTIFF.fromUrl(clickPointObject.url_to_geotiff_file);
        clickPointObject.file = file;
    }
    if (clickPointObject.image == null) {
        image = await file.getImage();
        clickPointObject.image = image;
    }

    const longitude = (latlng.lng * 20037508.34 / 180);
    const latitude = (Math.log(Math.tan((90 + latlng.lat) * Math.PI / 360)) / (Math.PI / 180)) * (20037508.34 / 180);

    const bbox = image.getBoundingBox();

    const pixelWidth = image.getWidth();
    const pixelHeight = image.getHeight();

    let partX = pixelWidth*(longitude - bbox[0])/(bbox[2] - bbox[0]);
    let partY = pixelHeight*(1 - (latitude - bbox[1])/(bbox[3] - bbox[1]));
    const xPx = Math.floor(partX + 0.5);
    const yPx = Math.floor(partY + 0.5);

    const data = await image.readRasters({
        window: [xPx, yPx, xPx + 1, yPx + 1],
        width: 1,
        height: 1,
        fillValue: -99999,
    });

    let height = data[0][0];

    if (isNaN(height) || height == -99999) {
        //
    } else {
        console.log("User clicked at (" + latlng.lng + "E, " + latlng.lat + "N)\nWater elevation: " + height);
        let popup = L.popup([latlng.lat, latlng.lng],
            {
                // closeOnClick: false,
                // autoClose: false,
                autoPan: false,
            })
            // BEFORE:
            // .setContent("(" + (Math.round(100*latlng.lng)/100) + ", " + (Math.round(100*latlng.lat)/100) + ")<br>Water elevation: " + (Math.round(100*height)/100) + " ft NAVD88");
            // END BEFORE: Now 6/21 change here:
            
            // Adding more data to hurricane markers
            .setContent((() => {
                // Get the hurricane data
                let hurricaneItem = tiffList.find(item => item.trackData);
                // This is the old data displayed: Lat/Long & Water Elevation
                let bretContent = "(" + (Math.round(100*latlng.lng)/100) + ", " + (Math.round(100*latlng.lat)/100) + ")<br>Water elevation: " + (Math.round(100*height)/100) + " ft NAVD88";

                // Adding more data - check if it exists
                if (hurricaneItem && hurricaneItem.trackData && hurricaneItem.trackData.features) {
                    // Find first track point as a test
                    let firstPoint = hurricaneItem.trackData.features[0];
                    if (firstPoint && firstPoint.properties) {
                        return bretContent + "<br><br><strong>Hurricane Test:</strong><br>" +
                        "Storm: " + hurricaneItem.hurricane + "<br>" +
                        "First point wind: " + Math.round(firstPoint.properties.max_wind_speed_mph) + " mph<br>" +
                        "First point pressure: " + Math.round(firstPoint.properties.minimum_sea_level_pressure_mb) + " mb";
                    } // if
                } // if
                return bretContent + "<br><br>No hurricane data available";
            } // outer function

            ) // second layer parentheses

            ); // setContent
            // END 6/21 change
        popup.addTo(map);
    }
}

async function drawFirstTime(inputTiff, customMinMax) {
    let url_to_geotiff_file = inputTiff.tiff.url;
    let georaster = await parseGeoraster(url_to_geotiff_file);
    // Colors height appropriately
    function doColors(input) {
        let min = inputTiff.tiff.min;
        let max = inputTiff.tiff.max;
        if (customMinMax) {
            let minboy = document.getElementById("minDepth");
            let maxboy = document.getElementById("maxDepth");
            min = parseFloat(minboy.value);
            max = parseFloat(maxboy.value);
        }
        let evala;
        if (min < max) {
            evala = (input > min);
        } else {
            evala = (input < min);
        }
        if (evala) {
            let scale = (input - min)/(max - min);
            if (input > max) {
                scale = 1;
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

    inputTiff.layer = tifLayer;
    const bounds = tifLayer.getBounds();

    // var layer = L.leafletGeotiff(inputTiff.tiff.url, null).addTo(map);
    console.log(georaster)

    if (!clickPointObject.active) {
        map.on('click', async function(evt) {
            clickPoint(evt, bounds);
        });
    }
    clickPointObject.url_to_geotiff_file = url_to_geotiff_file;
    clickPointObject.file = null;
    clickPointObject.image = null;
    clickPointObject.active = true;

    // Add layer to the list for sorting
    inputTiff.rendered = true;
    if (customMinMax) {
        inputTiff.rendered = false;
    }
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
                        let evala;
                        if (min < max) {
                            evala = (input > min);
                        } else {
                            evala = (input < min);
                        }
                        if (evala) {
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
                    console.log(tiffList[i].tiff.hurricaneLayer);
                    let layer = new Layer(tiffList[i], "overlay", tifLayer, tiffList[i].tiff.hurricaneLayer);
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