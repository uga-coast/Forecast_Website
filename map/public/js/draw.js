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

async function clickPoint(event) {
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

    const bbox = image.getBoundingBox();
    const pixelWidth = image.getWidth();
    const pixelHeight = image.getHeight();
    const bboxWidth = bbox[ 2 ] - bbox[ 0 ];
    const bboxHeight = bbox[ 3 ] - bbox[ 1 ];

    const widthPct = (latlng.lng - bbox[ 0 ] ) / bboxWidth;
    const heightPct = (latlng.lat - bbox[ 1 ] ) / bboxHeight;
    const xPx = Math.floor( pixelWidth * widthPct );
    const yPx = Math.floor( pixelHeight * ( 1 - heightPct ) );

    const window = [ xPx, yPx, xPx + 1, yPx + 1 ];
    const data = await image.readRasters({ window });

    let height = data[0][0];

    // console.log("User clicked at (" + latlng.lng + "E, " + latlng.lat + "N)\nWater elevation: " + height);
    let popup = L.popup([latlng.lat, latlng.lng],
        {
            // closeOnClick: false,
            // autoClose: false,
            autoPan: false,
        })
        .setContent("(" + (Math.round(100*latlng.lng)/100) + ", " + (Math.round(100*latlng.lat)/100) + ")<br>Water elevation: " + (Math.round(100*height)/100) + " ft NAVD88");
    popup.addTo(map);
    // let marker = L.marker([latlng.lat, latlng.lng], {
        // opacity: 0,
    // }).addTo(map).bindPopup(popup).openPopup();
    // clickPointObject.markers.push(marker);
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
        let eval;
        if (min < max) {
            eval = (input > min);
        } else {
            eval = (input < min);
        }
        if (eval) {
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

    if (!clickPointObject.active) {
        map.on('click', async function(evt) {
            clickPoint(evt);
        });
    }
    clickPointObject.url_to_geotiff_file = url_to_geotiff_file;
    clickPointObject.file = null;
    clickPointObject.image = null;
    clickPointObject.active = true;

    // Add layer to the list for sorting
    inputTiff.layer = tifLayer;
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