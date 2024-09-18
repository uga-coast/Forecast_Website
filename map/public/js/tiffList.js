let tiffList = [];

// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

function getName(data) {
    let output = "";
    output += data.cycle_month;
    output += "-";
    output += data.cycle_day;
    output += "-";
    output += data.cycle_year;
    output += " ";
    output += data.cycle_hour;
    output += ":00 UTC";
    return output;
}
async function addTifToList(key) {
    let baseUrl = "https://uga-coast-forecasting.s3.amazonaws.com/";

    let newKey = baseUrl + key;
    let response = await fetch(newKey);
    let data = await response.json();
    // console.log(data)

    let thisAdvisory = {
        "name": getName(data),
        "url": data.waterlevel_gtif_url,
        "hurricaneUrl": "Blank",
        "description": getName(data),
        "min": 0,
        "max": 9,
        "type": data.simtype,
        "show": false,
        "date": new Date(),
        "stationUrl": data.waterlevel_json_url,
        "stationData": null,
        "position": ["TYPE", "NAME", "Advisory", "OFCL"],
    }

    let writtenDate = data.cycle_year + "-" + data.cycle_month + "-" + data.cycle_day + "T" + data.cycle_hour + ":00:00";
    thisAdvisory.date = new Date(writtenDate);
    thisAdvisory.description += "--" + writtenDate;

    if (data.advisory == "None") {
        if (data.waterlevel_gtif_url.includes("adcirc_gfs_ga")) {
            thisAdvisory.show = true;
        }
    } else {
        if (data.waterlevel_gtif_url.includes("_ga/")) {
            thisAdvisory.show = true;
        }
        thisAdvisory.name = "Advisory " + data.advisory;
        thisAdvisory.type = "Hurricane";
        thisAdvisory.modelType = data.ensemble_member;
        thisAdvisory.hurricane = data.stormname;

        if (thisAdvisory.hurricane == "Chris") {
            thisAdvisory.hurricane = "Debby";
        }
        console.log(thisAdvisory.hurricane);
        if (thisAdvisory.hurricane == "Unnamed") {
            thisAdvisory.hurricane = "05L";
            thisAdvisory.max = 8;
            console.log(thisAdvisory)
        }
        thisAdvisory.hurricaneUrl = data.waterlevel_gtif_url;

        if (HURRICANES.includes(thisAdvisory.hurricane)) {
            thisAdvisory.show = true;
        }

        // if (thisAdvisory.hurricane == "Nicole") {
            // thisAdvisory.show = false;
        // }
    }

    // Sort into filter dropdowns
    if (thisAdvisory.type == "Hurricane") {
        thisAdvisory.position[0] = "Hurricane";
        thisAdvisory.position[1] = thisAdvisory.hurricane;
        thisAdvisory.position[2] = "Advisory " + data.advisory;
        thisAdvisory.position[3] = data.ensemble_member;
    } else {
        thisAdvisory.position[0] = "Daily Forecast";
        thisAdvisory.position[1] = data.cycle_month + "/" + data.cycle_year;
        thisAdvisory.position[2] = data.cycle_day;
        thisAdvisory.position[3] = data.cycle_hour;
    }

    if (thisAdvisory.show) {
        tiffList.push(thisAdvisory);
        if (thisAdvisory.type == "Hurricane") {
            await addHurricanePoints(thisAdvisory);
        }
        await getMarkerJson(thisAdvisory);
    }
}

async function getMarkerJson(input) {
    let url = input.stationUrl;
    // console.log(url)
    try {
        let file = await fetch(url);
        let data = await file.json();
        input.stationData = data;
    } catch {
        console.log("I am a sad")
    }
}

async function getAllTifs() {
    let file = await fetch("https://uga-coast-forecasting.s3.amazonaws.com/metadata_list.json");
    let readed = await file.json();
    
    // Forecast
    let namesa = [];
    let namesb = [];
    for (let i = 0; i < readed.length; i++) {
        if (readed[i].includes("adcirc_gfs_ga")) {
            namesa.push(readed[i]);
        } else {
            namesb.push(readed[i]);
        }
    }

    let promises = [];
    for (let i = 0; i < namesa.length; i++) {
        promises.push(addTifToList(namesa[i]));
    }
    Promise.all(promises).then(doNextStep);

    setTimeout(function() {
        promises = [];
        for (let i = 0; i < namesb.length; i++) {
            promises.push(addTifToList(namesb[i]));
        }
        Promise.all(promises).then(doSubsequentStep);
    }, 5000);
}