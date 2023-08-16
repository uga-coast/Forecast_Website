const MARKERS = [
    new Marker(8670870),
];
google.charts.load('current', {'packages':['corechart']});
function drawPopup(marker, data) {
    // Meta Data
    marker.lat = data.metadata.lat;
    marker.lon = data.metadata.lon;
    marker.name = data.metadata.name;
    console.log(marker);

    var base = document.createElement("div");

    var graph = document.createElement("div");
    graph.style.width = "300px"
    graph.style.height = "300px";
    base.appendChild(graph);

    var aM = new L.Marker([marker.lat, marker.lon]);
    aM.bindPopup(base).openPopup();
    aM.addTo(map);

    // Draw Graph
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var table = [["Time", "v", "s", "f"]];
        for (let i = data.data.length - 50; i < data.data.length; i++) {
            var tl = [i, parseFloat(data.data[i].v), parseFloat(data.data[i].s), parseFloat(data.data[i].f)];
            table.push(tl);
        }
        var stats = google.visualization.arrayToDataTable(table);
        var options = {
            title: marker.name,
            curveType: "function",
            legend: { position: "bottom" }
        };

        var chart = new google.visualization.LineChart(graph);

        chart.draw(stats, options);
    }
}
function getPopup(marker) {
    var url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20200101&end_date=20201231&station=" + marker.station + "&product=hourly_height&datum=MLLW&time_zone=lst&units=metric&application=DataAPI_Sample&format=json";
    fetch(url).then(data => data.json().then(d => drawPopup(marker, d)));
}
function addMarkers() {
    for (let i = 0; i < MARKERS.length; i++) {
        getPopup(MARKERS[i]);
    }
}