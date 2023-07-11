function getPast() {
    var output = [];
    var d = new Date();
    const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    for (let i = 0; i < 14; i++) {
        var date = d.getUTCFullYear() + "/" + MONTHS[d.getUTCMonth()] + "/";
        if (d.getUTCDate() < 10) {
            date += MONTHS[d.getUTCDate()];
        } else {
            date += d.getUTCDate();
        }

        var thatDay = {
            "name": date,
            "url": "https://uga-coast-forecasting.s3.amazonaws.com/adcirc_gfs_53k/sapelo2/wnat_53k_v1.0/gfs/" + date + "/12/forecast/base/maxele.tif",
            "description": "Haha",
            "min": 0,
            "max": 3,
            "type": "Forecast"
        };

        d.setDate(d.getDate() - 1);
        output[i] = thatDay;
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