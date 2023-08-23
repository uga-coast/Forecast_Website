var started = false;
async function doAll() {
    if (!started) {
        started = true;
        document.getElementById("version").innerText = VERSION;
        await makeTiffList();
        drawLegend();
        drawLayers();
        addMarkers();
    }
}
document.body.addEventListener("beginProcess", doAll);