var started = false;
async function doAll() {
    if (!started) {
        started = true;
        await makeTiffList();
        drawLegend();
        drawLayers();
        addMarkers();
    }
}
document.body.addEventListener("beginProcess", doAll);