// gpx export
function createXmlString(waypoints) {
    let result = '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" \
      creator="runtracker"><metadata/><trk><name></name><desc></desc>'
    result += waypoints.reduce((accum, waypoint) => {
        let segmentTag = `<trkseg><trkpt lat="${waypoint.lat}" lon="${waypoint.lng}"></trkpt></trkseg>`
        return accum += segmentTag;
      }, '');
    result += '</trk></gpx>';
    return result;
  }
  
function exportRoute() {
    var waypoints = routeState.currentRoute.coordinates;
    const xml = createXmlString(waypoints);
    const url = 'data:text/json;charset=utf-8,' + xml;
    const link = document.createElement('a');
    link.download = `${'test_export'}.gpx`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
  };
  