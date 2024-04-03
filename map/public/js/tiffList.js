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

function addTifToList(url) {
    let baseUrl = "https://uga-coast-forecasting.s3.amazonaws.com/";
    let thisAdvisory = {
        "name": "Default",
        "url": baseUrl + url,
        "hurricaneUrl": "Blank",
        "description": "Default",
        "min": 0,
        "max": 3,
        "type": "Default"
    }

    thisAdvisory.hurricaneUrl = baseUrl + url.substring(0, url.indexOf("maxele.tif")) + "fort.22";
    addHurricanePoints(thisAdvisory);

    // console.log(thisAdvisory.hurricaneUrl);
    if (url.indexOf("adcirc_gfs_53k/sapelo2/gfs/") != -1) {
        thisAdvisory.type = "Forecast";
        let pos = url.indexOf("gfs/") + 4;
        thisAdvisory.name = url.substring(pos + 5, pos + 7) + "-" + url.substring(pos + 8, pos + 10) + "-" + url.substring(pos, pos + 4) +
        " " + url.substring(pos + 11, pos + 13) + ":00 UTC";
        thisAdvisory.description = thisAdvisory.name;
    } else if (url.indexOf("ga_v01b_nhc_10L/sapelo2/nhc/ADVISORY_") != -1) {
        thisAdvisory.type = "Idalia";
        let lookup = "ADVISORY_";
        thisAdvisory.name = "Advisory " + url.substring(url.indexOf(lookup) + lookup.length, url.indexOf(lookup) + lookup.length + 3);
        thisAdvisory.description = thisAdvisory.name;
    }
    tiffList.push(thisAdvisory);
}

function getAllTifs() {
    const AWS = window.AWS;

    let params =
    {
        Bucket: "uga-coast-forecasting",
        Key: "."
    }

    let s3 = new AWS.S3({ region: '' });

    s3.makeUnauthenticatedRequest('getObject', params, function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            let parser = new DOMParser();
            let strout = data.Body.toString('utf-8');
            let xmlDoc = parser.parseFromString(strout, "text/xml");
            let json = xmlToJson(xmlDoc);
            let contents = json.ListBucketResult.Contents;
            for (let i = 0; i < contents.length; i++) {
                let key = contents[i].Key["#text"];
                if (key.indexOf(".tif") != -1) {
                    addTifToList(key);
                }
            }
            doNextStep();
        }
    });
}