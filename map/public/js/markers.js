const MARKERS = [
    new Marker(8670870),
    // new Marker(8721604),
    // new Marker(8636580),
    // new Marker(8679598),
    new Marker(8720030)
];

let markIcon = L.icon({
    iconUrl: "marker.png",
    shadowUrl: 'marker.png',

    iconSize:     [30, 30], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

function drawPopup(marker, data, layer, time, tiff) {
    // Meta Data
    marker.lat = data.metadata.lat;
    marker.lon = data.metadata.lon;
    marker.name = data.metadata.name;

    var base = document.createElement("div");

    let label = document.createElement("h3");
    label.innerText = marker.name + ", Station ID: " + marker.station;
    base.appendChild(label);

    var graph = document.createElement("canvas");
    graph.width = 300;
    graph.height = 200;
    base.appendChild(graph);


    var aM = new L.Marker([marker.lat, marker.lon], {icon: markIcon});
    
    aM.bindPopup(base, {
        minWidth: 600
    }).openPopup();
    aM.addTo(layer);

    function getNOAAStuff() {
        let out = [];
        for (let i = 0; i < data.data.length; i++) {
            let tipt = new Date(data.data[i].t);
            tipt.setHours(tipt.getHours() - 0);
            out.push({
                "date": tipt,
                "y": data.data[i].v
            });
        }
        return out;
    }
    function getBilStuff() {
        let out = [];
        let arr = tiff.stationData[marker.station];
        for (let i = 0; i < arr.zeta.length; i++) {
            let tipt = new Date(arr.time_date[i]);
            tipt.setHours(tipt.getHours() - 0);
            out.push({
                "date": tipt,
                "y": arr.zeta[i]
            });
            if (out[i].y < -10) {
                out[i].y = null;
            }
        }
        return out;
    }

    // Draw Graph
    function drawChart() {
        // Do the thing
        let staT = getNOAAStuff();
        let bilT = getBilStuff();

        // Zipper
        let times = [];
        let staH = [];
        let bilH = [];
        let i = 0;
        let j = 0;
        let k = 0;
        while ((i < staT.length || j < bilT.length) && k < 2000) {
            if (i >= staT.length) {
                times.push(bilT[j].date);
                staH.push(null);
                bilH.push(bilT[j].y);
                j++;
            } else if (j >= bilT.length) {
                times.push(staT[i].date);
                staH.push(staT[i].y);
                bilH.push(null);
                i++;
            } else if (i < staT.length && j < bilT.length) {
                if (staT[i].date.valueOf() < bilT[j].date.valueOf()) {
                    times.push(staT[i].date);
                    staH.push(staT[i].y);
                    bilH.push(null);
                    i++;
                } else if (staT[i].date.valueOf() == bilT[j].date.valueOf()) {
                    times.push(staT[i].date);
                    staH.push(staT[i].y);
                    bilH.push(bilT[j].y);
                    i++;
                    j++;
                } else if (staT[i].date.valueOf() > bilT[j].date.valueOf()) {
                    times.push(bilT[j].date);
                    staH.push(null);
                    bilH.push(bilT[j].y);
                    j++;
                }
            }
            k++;
        }

        let dates = [];
        let hts = [];
        for (let i = 0; i < data.data.length; i++) {
            dates.push(new Date(data.data[i].t));
            if (Math.random() < 0.8) {
                hts.push(null);
            } else {
                hts.push(data.data[i].v);
            }
        }
        // console.log(hts)
        new Chart(graph, {
            type: "line",
            options: {
                spanGaps: true,
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: "day"
                        }
                    }]
                }
            },
            data: {
                labels: times,
                datasets: [
                    {
                        label: "Water Levels(ft)",
                        data: staH,
                        fill: false,
                        borderColor: "#000000",
                        pointRadius: 1,
                        tension: 0,
                    },
                    {
                        label: "Predicted Water Levels(ft)",
                        data: bilH,
                        fill: false,
                        borderColor: "#BA0C2F",
                        pointRadius: 1,
                        tension: 0,
                    },
                ]
            }
        });
    }
    drawChart();
}
async function getPopup(marker, layer, tiff) {
    // Get time
    let time = tiff.date;
    if (tiff.type == "forecast") {
        time.setDate(time.getDate());
    }
    let monthList = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];
    let goalTimes = time.getFullYear() + "" + monthList[time.getMonth()] + "" + monthList[time.getDate() - 1];
    // Get URL
    let url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=" + goalTimes + "&range=72&station=" + marker.station + "&product=water_level&datum=NAVD&time_zone=gmt&units=english&application=DataAPI_Sample&format=json";
    // Get data from NOAA
    // console.log(url);
    let file = await fetch(url);
    let data = await file.json();
    if (data.error == null) {
        // Draw popup
        drawPopup(marker, data, layer, time, tiff);
    } else {
        console.log(marker.station);
    }
}
let markerLayer;
let hurricaneLayer;
function addMarkers() {
    markerLayer = new L.LayerGroup().addTo(map);
    hurricaneLayer = new L.LayerGroup().addTo(map);
    // let controlLayers = L.control.layers(map._layers[39]).addTo(map);
    prepareOverlays([
        {
            name: "Markers",
            layer: markerLayer
        },
        {
            name: "Hurricane Cone",
            layer: hurricaneLayer
        }
    ])
    // controlLayers.addOverlay(markerLayer, "Markers");
    // controlLayers.addOverlay(hurricaneLayer, "Hurricane Cone");
    for (let i = 0; i < MARKERS.length; i++) {
        getPopup(MARKERS[i], markerLayer, new Date());
    }
}

function updateMarkers(tiff) {
    console.log("Updating markers")
    for (let i = 0; i < MARKERS.length; i++) {
        getPopup(MARKERS[i], markerLayer, tiff);
    }
}