function drawLegend() {
    let base = document.getElementById("legend");

    // Opacity
    let opac = document.createElement("input");
    opac.id = "opacity-slider";
    opac.classList.add("opacity-slider");
    opac.type = "range";
    opac.min = 0;
    opac.max = 1;
    opac.value = 0.75;
    opac.step = 0.01;
    opac.onchange = function(e) {
        let opacThingO = document.getElementsByClassName("leaflet-tile-container")[document.getElementsByClassName("leaflet-tile-container").length - 1];
        console.log(opacThingO);
        opacThingO.style.opacity = e.target.value;
    }

    base.appendChild(opac);
}