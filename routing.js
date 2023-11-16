// define variables and map
let waypoints = [];
let mapOptions = {
    center: routeState.mapCenter,
    zoom: 12
};
var idxRoute = -1;

var myIcon = L.icon({
  iconUrl: 'images/pin_route.svg',
  iconSize: [22,22]
});

var map = L.map('map' , mapOptions);
layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {keepBuffer: 100});
map.addLayer(layer);

// layer2 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: 'prevent flickering',
//     // maxZoom: 18
// }).addTo(map);

// map.on('load', function(e) {
//   layer2.bringToFront();
//   layer.on('load', function(e) {
//       console.log('loaded');
//       layer.bringToFront();
//   });
//   layer.redraw();
// });

// define control
var control = L.Routing.control({
  show: false,
  addWaypoints: true,
  draggableWaypoints: true,
  waypoints: routeState.currentRoute.waypoints,
  showAlternatives: true,
  altLineOptions: {
    styles: [
        {color: 'red', opacity: 0.15, weight: 9},
        {color: 'white', opacity: 0.8, weight: 6},
        {color: 'blue', opacity: 0.5, weight: 2}
    ]
  },
  createMarker: function(i, wp) {
    return L.marker(wp.latLng, 
      {draggable: true, 
        icon: L.icon({iconUrl: routeState.marker, iconSize: [22, 22]})
      }).on('click', function(e) { 
        var container = L.DomUtil.create('div', 'button-container');
        deleteButton = createButton('delete waypoint', container);
        routeButton = createButton('route to position', container); 
        L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(map);
      })
  },
  router: L.Routing.osrmv1({
    serviceUrl: 'http://127.0.0.1:5000/route/v1',
    profile: 'foot'
    })
}).addTo(map);


// route generator
function routeGenerator() {
  let startWaypoint = mapOptions.center;
  let lat = startWaypoint[0];
  let lon = startWaypoint[1];
  const routeDist =10/10;
  const n = 3;
  let sign = Math.random();
  let newRouteWaypoints = [[lat,lon]];
  for (let i = 0; i < n; i++) {
    if ((i % 2) == 0) {
      lat = lat + sign*(1 / (111.32 / (routeDist)));
      sign = -1;
    }
    else {
      lon = lon + sign*(1 / ((40075 * Math.cos(lat)/360) / routeDist))
      sign = 1;
    };
    newRouteWaypoints.push([lat,lon]);
  };
  newRouteWaypoints.push(startWaypoint);
  control.setWaypoints(newRouteWaypoints);
}

// show saved routes toggle
function showRoutes() {
  var markerArray = [];
  control.setWaypoints();

  let startWayPoints = routeState.routeArray.map(function(x) {
    return x.waypoints[0];
  });
  
  startWayPoints.forEach(function(waypoint) {
    let marker = L.marker(waypoint, {icon: myIcon});
    marker.addTo(map);
    marker.on('click', function(e) {
      let selectedRouteId = '';
      routeState.routeArray.forEach(function(route) {
        if (route.waypoints[0].lat === e.latlng.lat && route.waypoints[0].lng === e.latlng.lng) {
          selectedRouteId = route._id;
        };
      });

      markerArray.forEach(function(marker) {
        map.removeLayer(marker);
      });

      console.log(selectedRouteId);

      control.setWaypoints(routeState.routeArray.find(x => x._id === selectedRouteId).waypoints);
      
    });
    markerArray.push(marker);
  });


}


// define functions
async function deleteRoute() {

  currentRouteId = routeState.currentRoute._id;
  document.getElementById("saveRouteForm").reset();
  
  await fetch(`http://localhost:4000/api/routes/${currentRouteId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json"
    }
  }).then(resp => resp.json());

  fetchSetRoutes(`http://localhost:4000/api/routes`);    
};


async function saveRoute() {
  var route = control.getWaypoints().map(x => x.latLng); 
  var routeName = document.getElementById("routeName").value;
  var totalDist = routeState.currentRoute.totalDist;

  document.getElementById("saveRouteForm").reset();
  
  await fetch(`http://localhost:4000/api/routes`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: routeName,
      waypoints: route,
      totalDist: totalDist
    })
  }).then(resp => resp.json());

  fetchSetRoutes(`http://localhost:4000/api/routes`);    
};


async function getAllRoutes(url) {
  let response = await fetch(url);
  let data = await response.json();
  routeState.routeArray = data;
  console.log(routeState);
}

// create table from routeArray
function setRouteList() {
  var routeData = routeState.routeArray;

  const element = document.getElementById("tableDiv");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  const tableData = routeData.map(value => {
    return (
      `<tr>
          <td>${value.name}</td>
          <td>${value.totalDist.toFixed(2) + " km"}</td>
      </tr>`
    );
  }).join('');
  
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = tableData;
}

async function fetchSetRoutes (url) {

  await getAllRoutes(url);
  setRouteList();
}

// on load get routes
window.onload = async function() {
  if (typeof window.localStorage !== "undefined") {
    fetchSetRoutes(`http://localhost:4000/api/routes`);
    localStorage.setItem('first_load', true);
  }
}

function createButton(label, container) {
  var btn = L.DomUtil.create('button', 'button-wp', container);
  btn.setAttribute('type', 'button');
  // btn.onclick = function(event) {
  //   console.log(label, btn, event)
  // };
  btn.innerHTML = label;
  return btn;
}


// event handlers
map.on('click', (event) => {
    var new_waypoint = event.latlng;
    routeState.currentRoute.waypoints.push(new_waypoint);
    control.setWaypoints(routeState.currentRoute.waypoints)
    console.log(routeState);
});

control.getPlan().on('waypointschanged', (event) => {
  routeState.currentRoute.waypoints = event.waypoints.map(a => a.latLng).filter(n => n);
  // console.log(control.getPlan());
})

control.on('routesfound', (event) => {
  var totalDist = event.routes[0].summary.totalDistance / 1000;
  var totalTime = event.routes[0].summary.totalTime;
  var coordinates =  event.routes[0].coordinates;

  routeState.currentRoute.totalDist = totalDist;
  routeState.currentRoute.totalTime = totalTime;
  routeState.currentRoute.coordinates = coordinates;

  document.getElementById("totalDist").innerHTML = routeState.currentRoute.totalDist.toFixed(2) + " km";
  document.getElementById("totalTime").innerHTML = routeState.currentRoute.totalTime + " sec";

})

var thead = document.getElementById("thead");
var tbody = document.getElementById("tableBody");

tbody.onclick = function (e) {
  var td = e.target || e.srcElement;
  var row = td.parentNode;
  var parentTable = row.parentNode.childNodes; 
  var idxRoute = row.rowIndex - 1; 
  let autoMoved = true
  
  parentTable.forEach(function(elem) {
    elem.classList.remove("highlighted");
  });

  row.className = row.className === "highlighted" ? "" : "highlighted";

  routeState.currentRoute.waypoints = routeState.routeArray[idxRoute].waypoints;
  routeState.currentRoute._id = routeState.routeArray[idxRoute]._id;
  routeState.currentRoute.routeName = routeState.routeArray[idxRoute].name;

  document.getElementById("routeName").value = routeState.currentRoute.routeName;
  map.flyToBounds(routeState.currentRoute.waypoints, {
    animate: true,
    duration: 1.5
  });
  map.on('moveend', function(){
    if (autoMoved === true) {
      control.setWaypoints(routeState.currentRoute.waypoints);
      autoMoved = false;
      }
    });
  map.fitBounds(routeState.currentRoute.waypoints);
}

thead.onclick = function (e) {
  var head = e.target.firstChild.nodeValue;
  if (head == 'Route') {
    routeState.routeArray.reverse((a, b) => a.name.localeCompare(b.name));
  }
  else {
    routeState.routeArray.reverse((a, b) => a.totalDistance.localeCompare(b.totalDistance));
  }
  setRouteList();
}