var started = false;
async function doAll() {
    if (!started) {
        started = true;
        await makeTiffList();
        drawLegend();
        drawLayers();
    }
}
document.body.addEventListener("beginProcess", doAll);