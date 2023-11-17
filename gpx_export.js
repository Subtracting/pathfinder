// gpx export
function createXmlString(waypoints, name) {
    // let result = '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
    //   xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" \
    //   creator="runtracker"><metadata/><trk><name></name><desc></desc>
      
      let result = `<gpx creator="pathfinder" version="1.1" \
        xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd" \
        xmlns:ns3="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" \
        xmlns="http://www.topografix.com/GPX/1/1" \
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns2="http://www.garmin.com/xmlschemas/GpxExtensions/v3"> \
        <metadata><name>${name}</name><link href="connect.garmin.com"><text>Garmin Connect</text></link></metadata><trk><name>${name}</name><trkseg>`

    result += waypoints.reduce((accum, waypoint) => {
        let segmentTag = `<trkpt lat="${waypoint.lat}" lon="${waypoint.lng}"></trkpt>`
        return accum += segmentTag;
      }, '');
    result += '</trkseg></trk></gpx>';
    return result;
  }
  
function exportRoute() {
    var waypoints = routeState.currentRoute.coordinates;
    var routeName = routeState.currentRoute.routeName;
    const xml = createXmlString(waypoints, routeName);
    const url = 'data:text/json;charset=utf-8,' + xml;
    const link = document.createElement('a');
    link.download = `${routeName}.gpx`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
  };
  