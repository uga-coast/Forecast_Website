var started = false;
async function doAll() {
    if (!started) {
        started = true;
        document.getElementById("version").innerText = VERSION;
        getAllTifs();
    }
}
function doNextStep() {
    drawLegend();
    drawLayers();
    addMarkers();
}
document.body.addEventListener("beginProcess", doAll);