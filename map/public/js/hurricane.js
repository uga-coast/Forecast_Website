function drawHurricane() {
    /*
    let url = "https://www.nhc.noaa.gov/gis/kml/nhc.kmz";
    let response = await fetch(url, {
        mode: "cors"
    });
    console.log(response)
    */
    // omnivore.kml('https://iblogbox.github.io/js/gpx/sample/cornishlight.kml').addTo(map);
    // fetch('al102023_029adv_CONE.kml')
    // .then((res) => res.text()).then((text) => console.log(text));
    omnivore.kml('al102023_029adv_CONE.kml').addTo(map);
    omnivore.kml('al102023_029adv_TRACK.kml').addTo(map);

    // var kmz = L.kmzLayer().addTo(map);

    // kmz.load('regions.kmz')
    // kmz.load('AL102023_029adv_CONE.kmz');
}