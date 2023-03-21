var started = false;
function doAll() {
    if (!started) {
        started = true;
        drawLegend();
        drawLayers();
    }
}
document.body.addEventListener("beginProcess", doAll);