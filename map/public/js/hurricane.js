const HURRICANEERROR = [0, 26, 41, 55, 70, 88, 102, 151, 220];
for (let i = 0; i < 20; i++) {
    if (HURRICANEERROR[i] == null) {
        HURRICANEERROR[i] = HURRICANEERROR[i - 1] + 30;
    }
}

let hurrIcon = L.icon({
    iconUrl: "hurricane.png",
    shadowUrl: 'hurricane.png',

    iconSize:     [20, 20], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

function drawMultiPolygon(stormtrack, geojson) {
    let hurrLayer = new L.layerGroup();
    let tracLayer = new L.layerGroup();

    let shapes = [];
    if (geojson.type == "Polygon") {
        for (let i = 0; i < geojson.coordinates.length; i++) {
            let list = [];
            for (let j = 0; j < geojson.coordinates[i].length; j++) {
                let coord = geojson.coordinates[i][j];
                let x = coord[1];
                let y = coord[0];
                list.push([x, y]);
            }
            let shape = L.polygon(list, {
                color: '#ff0000',
                stroke: true,
                fillOpacity: 0.0,
                fillRule: "nonzero",
            });
            shapes.push(shape);
        }
    } else if (geojson.type == "MultiPolygon") {
        for (let i = 0; i < geojson.coordinates.length; i++) {
            let list = [];
            for (let j = 0; j < geojson.coordinates[i][0].length; j++) {
                let coord = geojson.coordinates[i][0][j];
                let x = coord[1];
                let y = coord[0];
                list.push([x, y]);
            }
            let shape = L.polygon(list, {
                color: '#ff0000',
                stroke: true,
                fillOpacity: 0.0,
                fillRule: "nonzero",
            });
            shapes.push(shape);
        }
    }

    let linePoints = [];
    for (let i = 0; i < stormtrack.features.length; i++) {
        let point = stormtrack.features[i].geometry.coordinates;
        // Added feature variable to track hurricane data in order to record on hover of hurricane markers
        let feature = stormtrack.features[i];

        // Bret code 
        linePoints.push([point[1], point[0]]);

        let marker = new L.marker([point[1], point[0]], {icon: hurrIcon});

        // Added event listener to record on hover for each hurricane marker - then display popup
        marker.on('mouseover', function(e) {
            let latlng = e.latlng;
            
            // Get hurricane track data 
            let hurricaneItem = showing && showing.tiff && showing.tiff.trackData ? showing.tiff : null;
            
            // Create popup content with Location, Date, Storm, Max Wind Speed, Min Pressure 
            let popupContent = `<span class="popup-label">Location:</span> (${Math.round(100*latlng.lng)/100}, ${Math.round(100*latlng.lat)/100})<br>
                <span class="popup-label">Date:</span> ${new Date(feature.properties.time_utc).toLocaleDateString()} ${new Date(feature.properties.time_utc).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}<br>
                <span class="popup-label">Storm:</span> ${hurricaneItem ? hurricaneItem.hurricane : 'Unknown'}<br>
                <span class="popup-label">Max Wind Speed:</span> ${Math.round(100*feature.properties.max_wind_speed_mph)/100} mph<br>
                <span class="popup-label">Min Pressure:</span> ${Math.round(100*feature.properties.minimum_sea_level_pressure_mb)/100} mb`; // popupContent 
            
            let popup = L.popup([latlng.lat, latlng.lng], {
                autoPan: false,
                autoClose: true, 
                closeOnClick: false
            }).setContent(popupContent); // popup
            
            popup.addTo(map);
        });

        // Close Leaflet popup with hurricane data so map does not get cluttered 
        marker.on('mouseout', function(e) {
            map.eachLayer(function(layer) {
                if (layer instanceof L.Popup) {
                    map.removeLayer(layer);
                } // if 
            }); // MAP
        }); // on mouseout
        
        // Bret code: 
        marker.addTo(tracLayer);
    }
    let line = L.polyline(linePoints, {
        color: "#000000",
        weight: 3
    });
    
    let output = {
        "hurrLayer": hurrLayer,
        "hulls": shapes,
        "tracLayer": tracLayer,
        "line": line,
    };
    return output;
}