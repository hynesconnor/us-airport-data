// create a map object.
var mymap = L.map('map', {
    center: [41.850033, -87.6500523],
    zoom: 5,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// creates basemap
L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png').addTo(mymap);

// sets color pallate
var colors = chroma.scale('RdBu').mode('lch').colors(13);

// formatting for symbols
for (i = 0; i < 13; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 20px;} </style>"));
}

// adds airports to map, determines icon/color
var airports = null;
airports = L.geoJson.ajax("assets/airports.geojson", {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME);
    },
    pointToLayer: function (feature, latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") { id = 10; }
        else { id = 1;}
        return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
    },
    attribution: 'Mike Bostock - D3'
}).addTo(mymap);

// adds state polygons
L.geoJson.ajax("assets/us-states.geojson").addTo(mymap);

// color parameters for states
colors = chroma.scale('Purples').colors(6)

function setColor(count) {
    var id = 0;
    if (count > 20) { id = 5; }
    else if (count > 16 &&  count <= 20) { id = 4; }
    else if (count > 11 && count <= 15) { id = 3; }
    else if (count > 6 && count <= 10) { id = 2; }
    else if (count > 1 &&  count <= 5) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#4000ff',
        dashArray: '4'
    };
}

var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style,
    
}).addTo(mymap);

// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// function to create legend
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Airports In Each State</b><br />';
    div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p> 21+ </p>';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 16-20 </p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 11-15 </p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 6-10 </p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 0-5 </p>';
    div.innerHTML += '<hr><b>Control Towers<b><br />';
    div.innerHTML += '<i class="fa fa-plane marker-color-11"></i><p> Air Traffic Control Tower </p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> No Air Traffic Control Tower </p>';
    return div;
};

// adds legend
legend.addTo(mymap);

// scale bar
L.control.scale({position: 'bottomleft'}).addTo(mymap);

// adds ruler function
var options = {
    position: 'topleft',
    lengthUnit: {
      factor: 0.621371,    //  from km to m
      display: 'Miles',
      decimal: 2
    }
  };
L.control.ruler(options).addTo(mymap);
