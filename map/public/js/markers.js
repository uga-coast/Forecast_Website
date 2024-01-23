const MARKERS = [
    new Marker(8670870),
    new Marker(8721604),
    new Marker(8636580),
    new Marker(8679598),
    new Marker(8720030)
];
function drawPopup(marker, data, layer) {
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

    var aM = new L.Marker([marker.lat, marker.lon]);
    
    aM.bindPopup(base, {
        minWidth: 600
    }).openPopup();
    aM.addTo(layer);

    // Draw Graph
    function drawChart() {
        let dates = [];
        let hts = [];
        for (let i = 0; i < data.data.length; i++) {
            dates.push(new Date(data.data[i].t));
            hts.push(data.data[i].v);
        }
        new Chart(graph, {
            type: "line",
            options: {
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
                labels: dates,
                datasets: [{
                    label: "Water Levels(m)",
                    data: hts,
                    fill: false,
                    borderColor: "#0088ff",
                    pointRadius: 1,
                    tension: 0,
                }]
            }
        });
    }
    drawChart();
}
function getPopup(marker, layer) {
    var url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=recent&station=" + marker.station + "&product=water_level&datum=NAVD&time_zone=gmt&units=metric&application=DataAPI_Sample&format=json";
    fetch(url).then(data => data.json().then(d => drawPopup(marker, d, layer)));
}
function addMarkers() {
    let markerLayer = new L.LayerGroup().addTo(map);
    let controlLayers = L.control.layers(map._layers[39]).addTo(map);
    controlLayers.addOverlay(markerLayer, "Markers");
    for (let i = 0; i < MARKERS.length; i++) {
        getPopup(MARKERS[i], markerLayer);
    }
}