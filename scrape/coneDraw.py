import sys
import shapely
from shapely import Point
import numpy as np

path = sys.argv[1]

## Open file
f = open(path, "r")
content = f.read()

## Parse file
lines = content.rsplit("\n")
points = []
ERROR = [0, 26, 41, 55, 70, 88, 102, 151, 220]

## Make list of points
for i in range(0, len(lines)):
    line = lines[i].rsplit(", ")
    if (len(line) >= 7):
        ## North south
        x = line[6].lstrip()
        if x[len(x) - 1] == "N":
            x = round(0.1*int(x[0:len(x) - 1]), 3)
        else:
            x = round(-0.1*int(x[0:len(x) - 1]), 3)
        
        ## East west
        y = line[7].lstrip()
        if y[len(y) - 1] == "E":
            y = round(0.1*int(y[0:len(y) - 1]), 3)
        else:
            y = round(-0.1*int(y[0:len(y) - 1]), 3)
        
        ## Radius
        time = int(int(line[5].lstrip())/12)
        r = 0
        if time > len(ERROR):
            r = ERROR[len(ERROR) - 1] + 30*(time - len(ERROR))
        else:
            r = ERROR[time]

        newItem = [x, y, r]
        if len(points) > 0:
            prev = points[len(points) - 1]
            if not(prev[0] == newItem[0] and prev[1] == newItem[1] and prev[2] == newItem[2]):
                points.append(newItem)
        else:
            points.append(newItem)

## Next step
circles = []
rings = []
RESOLUTION = 360
for x in range(1, len(points) - 1):
    item = points[x]
    ring = []
    for i in range(1, RESOLUTION):
        vert = Point(item[1] + np.sin(2*np.pi*i/RESOLUTION)*item[2]/60, item[0] + np.cos(2*np.pi*i/RESOLUTION)*item[2]/60)
        ring.append(vert)
    rings.append(ring)

    if not(x == 1):
        list = rings[x - 2] + rings[x - 1]
        hull = shapely.Polygon(list).convex_hull
        circles.append(hull)

union = shapely.union_all(circles)
print(shapely.to_geojson(union))