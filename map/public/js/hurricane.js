function drawCenter(lat, lon, time) {
    let nlat = lat.substring(0, lat.length - 1)*0.1;
    let nlon = lon.substring(0, lon.length - 1)*0.1;

    if (lat.indexOf("S") != -1) {
        nlat = -1*nlat;
    }
    if (lon.indexOf("W") != -1) {
        nlon = -1*nlon;
    }

    let output = {
        "lattitude": nlat,
        "longitude": nlon,
        "time": Math.floor(time)
    };
    return output;
}

function addHurricanePoints(item) {
    item.hurricanePoints = [];
    fetch(item.hurricaneUrl).then(r => r.text() ).then(
        function(t) {
            let lines = t.split("\n");
            let message = [];
            newPoints = [];
            for (let i = 0; i < lines.length; i++) {
                message.push(lines[i].split(", "));
                try {
                    if (message[i][5]%12 == 0) {
                        newPoints.push(drawCenter(message[i][6], message[i][7], message[i][5]));
                    }
                } catch {
                    //
                }
            }
            for (let i = 0; i < newPoints.length; i++) {
                let unique = true;
                for (let j = 0; j < item.hurricanePoints.length; j++) {
                    if (item.hurricanePoints[j].time == newPoints[i].time) {
                        unique = false;
                        j = item.hurricanePoints.length;
                    }
                }
                if (unique) {
                    item.hurricanePoints.push(newPoints[i]);
                }
            }
            // console.log(item.name)
            // console.log(item.hurricanePoints.length)
        }
    );
}

const HURRICANEERROR = [0, 21.1, 31.3, 41.6, 52.5, 65.3, 78.1, 98.7, 126.2];
for (let i = 0; i < 20; i++) {
    if (HURRICANEERROR[i] == null) {
        HURRICANEERROR[i] = HURRICANEERROR[i - 1] + 30;
    }
}

let hurrIcon = L.icon({
    iconUrl: "hurricane.png",
    shadowUrl: 'hurricane.png',

    iconSize:     [40, 40], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});
function addHurricaneLayer(item) {
    let points = item.hurricanePoints;
    // console.log(item.name)
    // console.log(item.hurricanePoints.length)
    let hurrLayer = new L.layerGroup();
    let linePoints = [];
    let circles = [];
    for (let i = 0; i < points.length; i++) {
        // console.log(i)
        // Add marker
        let marker = new L.marker([points[i].lattitude, points[i].longitude], {icon: hurrIcon});
        marker.addTo(hurrLayer);

        linePoints.push([points[i].lattitude, points[i].longitude]);

        // Add circle
        let circle = L.circle([points[i].lattitude, points[i].longitude], {radius: 1852*HURRICANEERROR[points[i].time/12]});
        circles.push(circle);
    }
    let line = L.polyline(linePoints, {color: 'red'});

    let output = {
        "layer": hurrLayer,
        "line": line,
        "circles": circles
    };
    return output;
}