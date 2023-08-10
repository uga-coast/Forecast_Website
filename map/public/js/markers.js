const MARKERS = [
    new Marker(32.033611, -80.900556, 8670870)
];
function drawMarker(station) {
    var base = document.createElement("div");

    var head = document.createElement("h3");
    head.innerText = "Station " + station;
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