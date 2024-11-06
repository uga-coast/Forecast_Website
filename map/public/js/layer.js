function Layer(tiff, type, layer, hurricaneLayer) {
    this.tiff = tiff;
    this.type = type;
    this.layer = layer;
    this.hurricaneLayer = hurricaneLayer;
    this.rendered = false;

    this.showing = false;
}