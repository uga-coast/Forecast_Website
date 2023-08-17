const MARKERS = [
    new Marker(8670870),
    new Marker(8721604),
    new Marker(8636580),
];
google.charts.load('current', {'packages':['corechart']});
function drawPopup(marker, data) {
    // Meta Data
    marker.lat = data.metadata.lat;
    marker.lon = data.metadata.lon;
    marker.name = data.metadata.name;
    console.log(marker);

    var base = document.createElement("div");
    base.style.width = "400px"

    var graph = document.createElement("div");
    graph.style.width = "400px";
    graph.style.height = "200px";
    base.appendChild(graph);

    var aM = new L.Marker([marker.lat, marker.lon]);
    aM.bindPopup(base).openPopup();
    aM.addTo(map);

    // Draw Graph
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var table = [["Time", "Water Levels(m)"]];
        for (let i = 0; i < data.data.length; i++) {
            var tl = [new Date(data.data[i].t), parseFloat(data.data[i].v)];
            table.push(tl);
        }
        var stats = google.visualization.arrayToDataTable(table);
        var options = {
            title: marker.name,
            curveType: "function",
            legend: { position: "bottom" },
            chartArea: { width: "90%" },
            width: 301,
            height: 200
        };

        var chart = new google.visualization.LineChart(graph);

        chart.draw(stats, options);
    }
}
function getPopup(marker) {
    var url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=recent&station=" + marker.station + "&product=water_level&datum=MLLW&time_zone=gmt&units=metric&application=DataAPI_Sample&format=json";
    fetch(url).then(data => data.json().then(d => drawPopup(marker, d)));
}
function addMarkers() {
    for (let i = 0; i < MARKERS.length; i++) {
        getPopup(MARKERS[i]);
    }
}