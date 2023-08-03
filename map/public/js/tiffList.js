function getPast() {
    var output = [];
    var d = new Date();
    const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    const HOURS = ["00","06","12","18"];
    const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    for (let i = 0; i < 14; i++) {
        var date = d.getUTCFullYear() + "/" + MONTHS[d.getUTCMonth()] + "/";
        if (d.getUTCDate() < 10) {
            date += MONTHS[d.getUTCDate() - 1];
        } else {
            date += d.getUTCDate();
        }
        var name = DAYS[d.getDay()] + ", " + d.getUTCDate() + "th";
        for (let j = 0; j < 4; j++) {
            var thatDay = {
                "name": name + ", " + j*6 + ":00",
                "url": "https://uga-coast-forecasting.s3.amazonaws.com/adcirc_gfs_53k/sapelo2/gfs/" + date + "/" + HOURS[j] + "/adcirc/53k/forecast/base/maxele.tif",
                "description": "Haha",
                "min": 0,
                "max": 3,
                "type": "Forecast"
            };

            output[output.length] = thatDay;
        }
        d.setDate(d.getDate() - 1);
    }
    return output;
}
console.log(getPast())
var tiffList = [];
async function makeTiffList() {
    const response = await fetch("./js/tiffList.json");
    const jsonData = await response.json();
    console.log(jsonData);
    tiffList = jsonData.concat(getPast());

    const bucket = new XMLHttpRequest();
    bucket.open("GET", "https://uga-coast.s3.us-east-2.amazonaws.com/");
    bucket.send();
    bucket.onload = function() {
        var xml = bucket.responseXML;
        console.log(xml);
        console.log(xml.getElementsByTagName("ListBucketResult")[0])
    }
}