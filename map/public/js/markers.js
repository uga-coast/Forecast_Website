const MARKERS = [
    new Marker(8670870),
];
function drawPopup(marker, data) {
    marker.lat = data.metadata.lat;
    marker.lon = data.metadata.lon;
    marker.name = data.metadata.name;
    console.log(marker);

    var base = document.createElement("div");

    var head = document.createElement("h3");
    head.innerText = "Station " + marker.station;

    var description = document.createElement("p");
    description.innerText = marker.name;
    base.appendChild(description);
    base.appendChild(head);

    marker.element = base;

    var aM = new L.Marker([marker.lat, marker.lon]);
    aM.bindPopup(marker.element).openPopup();
    aM.addTo(map);
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