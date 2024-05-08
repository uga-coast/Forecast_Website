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

    let thisAdvisory = {
        "name": getName(data),
        "url": data.waterlevel_gtif_url,
        "hurricaneUrl": "Blank",
        "description": getName(data),
        "min": 0,
        "max": 3,
        "type": data.simtype,
    }

    if (data.advisory != "None") {
        thisAdvisory.type = data.stormname;
        let pig = data.waterlevel_gtif_url;
        thisAdvisory.hurricaneUrl = pig.substring(0, pig.indexOf("maxele.tif")) + "fort.22";
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

    s3.makeUnauthenticatedRequest('getObject', params, async function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            let parser = new DOMParser();
            let strout = data.Body.toString('utf-8');
            let xmlDoc = parser.parseFromString(strout, "text/xml");
            let json = xmlToJson(xmlDoc);
            let contents = json.ListBucketResult.Contents;
            console.log(contents);
            for (let i = 0; i < contents.length; i++) {
                let key = contents[i].Key["#text"];
                if (key.indexOf("metadata.json") != -1) {
                    await addTifToList(key);
                }
            }
            for (let i = 0; i < newList.length; i++) {
                await addTifToList(newList[i])
            }
            doNextStep();
        }
    });
}