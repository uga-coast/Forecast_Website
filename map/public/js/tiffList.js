var tiffList = [];
async function makeTiffList() {
    const response = await fetch("./js/tiffList.json", { mode: 'no-cors'});
    const jsonData = await response.json();
    tiffList = jsonData;

    const bucket = new XMLHttpRequest();
    bucket.open("GET", "https://uga-coast.s3.us-east-2.amazonaws.com/");
    bucket.send();
    bucket.onload = function() {
        var xml = bucket.responseXML;
        console.log(xml);
        console.log(xml.getElementsByTagName("ListBucketResult")[0])
    }
}