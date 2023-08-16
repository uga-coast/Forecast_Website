const MARKERS = [
    new Marker(32.033611, -80.900556, 8670870),
    new Marker(32, -80.900556, 8670870)
];
function drawMarker(station) {
    var url = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20200101&end_date=20201231&station=" + station + "&product=hourly_height&datum=MLLW&time_zone=lst&units=metric&application=DataAPI_Sample&format=json";

    var base = document.createElement("div");

    var head = document.createElement("h3");
    head.innerText = "Station " + station;

    var description = document.createElement("p");
    description.innerText = url;
    base.appendChild(description);
    base.appendChild(head);

    return base;
}
function addMarkers() {
    for (let i = 0; i < MARKERS.length; i++) {
        var marker = new L.Marker([MARKERS[i].lat, MARKERS[i].long]);
        marker.bindPopup(drawMarker(MARKERS[i].station)).openPopup();
        marker.addTo(map);
    }
}