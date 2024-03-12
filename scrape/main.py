import requests 
  
# Making a GET request 
r = requests.get('https://ftp.nhc.noaa.gov/atcf/gis/fst/') 
  
# check status code for response received 
# success code - 200 
print(r)

pre = "https://ftp.nhc.noaa.gov/atcf/gis/fst/"
  
list = r.text.splitlines()
dataPoints = []

for i in list:
    # print(i)
    if (i.find("<a href=") != -1 and i.find(":") != -1):
        linkStart = i.index('="') + 2
        linkEnd = i.index('">')

        dateStart = i.index("</a>") + 4
        dateEnd = i.index(":") + 3

        newPoint = {
            "link": i[linkStart:linkEnd],
            "date": i[dateStart:dateEnd].strip()
        }
        dataPoints.append(newPoint)
        # print(dataPointsI)

sortedData = sorted(dataPoints, key=lambda x: x['date'])
last = sortedData[len(sortedData) - 1]
print(pre + last['link'])