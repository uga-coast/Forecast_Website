function getPast() {
    var output = [];
    var d = new Date();
    const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    const HOURS = ["00","06","12","18"];
    const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    for (let i = 0; i < 14; i++) {
        var dayNum = "";
        var date = d.getUTCFullYear() + "/" + MONTHS[d.getUTCMonth()] + "/";
        if (d.getUTCDate() < 10) {
            dayNum = MONTHS[d.getUTCDate() - 1];
        } else {
            dayNum = d.getUTCDate();
        }
        date += dayNum;
        var name = MONTHS[d.getUTCMonth()] + "-" + dayNum + "-" + d.getUTCFullYear() + " ";
        for (let j = 0; j < 4; j++) {
            var curName = name + j*6 + ":00 UTC";
            var thatDay = {
                "name": curName,
                "url": "https://uga-coast-forecasting.s3.amazonaws.com/adcirc_gfs_53k/sapelo2/gfs/" + date + "/" + HOURS[j] + "/adcirc/wnat_53k_v1.0/forecast/base/maxele.tif",
                "description": date.toString() + " " + HOURS[j] + ":00 model.",
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
//console.log(getPast())
var tiffList = [];
async function makeTiffList() {
    /*
    const response = await fetch("./js/tiffList.json");
    const jsonData = await response.json();
    tiffList = jsonData.concat(getPast());
    */
    tiffList = getPast();

    const bucket = new XMLHttpRequest();
    bucket.open("GET", "https://uga-coast.s3.us-east-2.amazonaws.com/");
    bucket.send();
    bucket.onload = function() {
        var xml = bucket.responseXML;
        //console.log(xml);
        //console.log(xml.getElementsByTagName("ListBucketResult")[0])
    }
}