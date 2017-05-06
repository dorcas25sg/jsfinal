// Leaflet map setup
var map = L.map('map', {
  center: [1.3521, 103.8198],
  zoom: 12,
  zoomControl:false,
  scrollWheelZoom: false
});

// The pretty white basemap
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

// The pretty black basemap
var Stamen_TonerLite2 = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

// Swipe to change basemaps
var range = document.getElementById('range');

function clip() {
  var nw = map.containerPointToLayerPoint([0, 0]),
      se = map.containerPointToLayerPoint(map.getSize()),
      clipX = nw.x + (se.x - nw.x) * range.value;

  Stamen_TonerLite2.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
}

range['oninput' in range ? 'oninput' : 'onchange'] = clip;
map.on('move', clip);
clip();


// Initially, we want these hidden
$("#restart").hide();
$(".selected").hide();

// Default Zoom
var defaultZoom = function(){
    map.setView([1.3521, 103.8198], 12);
};

// If user does not select color, this is the default blue
var defaultColor = "#2799ff";

// The colours available to choose from
var swatches = document.getElementById('swatches');
var colors = [
    '#ffffcc',
    '#a1dab4',
    '#41b6c4',
    '#2c7fb8',
    '#253494',
    '#fed976',
    '#feb24c',
    '#fd8d3c',
    '#f03b20',
    '#bd0026'
];

// If all is checked, select all factors
$('#all2').change(function() {
  if($('#all2').is(":checked")){
    $('#clinic').prop('checked', true);
    $('#libr').prop('checked', true);
    $('#eldc').prop('checked', true);
  }
  if(!$('#all2').is(":checked")){
    $('#clinic').prop('checked', false);
    $('#libr').prop('checked', false);
    $('#eldc').prop('checked', false);
  }
});

// Activate submit button only if at least one checkbox is selected
var checkingBoxes = $('.checkbox');
checkingBoxes.change(function () {
    $('#submit').prop('disabled', checkingBoxes.filter(':checked').length < 1);
});
$('.checkbox').change();


var cartoUserName = 'dorcas25sg';

// Strings for setting CSS later
var resetcss = "{marker-fill-opacity: 0; marker-line-opacity: 0; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true;}";
var checkedcss;
var checkedcss2 = "; marker-line-width: 0; marker-allow-overlap: true;}";

// Adding Carto Layers
var districts = cartodb.createLayer(map, {
  user_name: cartoUserName,
  type: 'cartodb',
  //interactivity: true,
  sublayers: [
    {
      sql: "SELECT * FROM moh_chas_clinics",
      cartocss: '#moh_chas_clinics' + resetcss
   },
   {
     sql: "SELECT * FROM library",
     cartocss: '#library' + resetcss
  },
  {
    sql: "SELECT * FROM eldercare",
    cartocss: '#eldercare' + resetcss
 }
  ]
}).addTo(map)
  .on('done', function(layer) {

    colors.forEach(function(color) {
      var swatch = document.createElement('button');
      swatch.style.backgroundColor = color;
      swatch.addEventListener('click', function() {
        // If user does not select colour, defaultColor remains the original blue
        // If user selects color, defaultColor will change accordingly
        defaultColor = color;
      });
      swatches.appendChild(swatch);
    });

    // When submit is clicked...
    $("#submit").click(function() {
      $("#restart").show();
      $(".selected").show();
      $(".toSelect").hide();
      $(".checkboxes").hide();
      $("#submit").hide();
      $(".map-overlay").hide();

      $('#submit').prop('disabled', true);
      $('#redo').prop('disabled', false);
      $('.checkbox').prop('disabled', true);

      // Set Carto CSS of chosen factors accordingly
      checkedcss = "{marker-fill:"+defaultColor+"; marker-width: 55; marker-fill-opacity:";

      // state what was being selected on sidebar and edit opacity according to drop down
      if ($('#clinic').is(":checked")) {
      var nameit = $("#impt option:selected").html();
      $('.listfactors').append("Clinic (" +nameit+ " importance)"+"<br>");
        if (nameit === "Low") {x=0.02;}
        else if (nameit === "Mid") {x=0.04;}
        else {x=0.06;}
      layer.getSubLayer(0).setCartoCSS('#moh_chas_clinics'+ checkedcss+x+checkedcss2);
      }
      if ($('#libr').is(":checked")) {
      var nameit2 = $("#impt2 option:selected").html();
      $('.listfactors').append("Library (" +nameit2+ " importance)"+"<br>");
        if (nameit2 === "Low") {y=0.02;}
        else if (nameit2 === "Mid") {y=0.04;}
        else {y=0.06;}
      layer.getSubLayer(1).setCartoCSS('#library'+ checkedcss+y+checkedcss2);
      }
      if ($('#eldc').is(":checked")) {
      var nameit3 = $("#impt3 option:selected").html();
        if (nameit3 === "Low") {z=0.02;}
        else if (nameit3 === "Mid") {z=0.04;}
        else {z=0.06;}
      $('.listfactors').append("Eldercare Services (" +nameit3+ " importance)"+"<br>");
      layer.getSubLayer(2).setCartoCSS('#eldercare'+ checkedcss+z+checkedcss2);
    }
    });

    // When the restart button is clicked...
    $("#restart").click(function(){
      layer.getSubLayer(0).setCartoCSS('#moh_chas_clinics'+ resetcss);
      layer.getSubLayer(1).setCartoCSS('#library'+ resetcss);
      layer.getSubLayer(2).setCartoCSS('#eldercare'+ resetcss);

      defaultZoom(); // set map to orginal lat, long, zoom

      $("#restart").hide();
      $(".selected").hide();
      $(".toSelect").show();
      $(".checkboxes").show();
      $("#submit").show();
      $(".map-overlay").show();

      $('.listfactors').empty();

      //$('#submit').prop('disabled', false);
      $('.checkbox').change();
      $('.checkbox').prop('disabled', false);
      $('.checkbox').prop('checked', false);
      $('#restart').prop('disabled', false);
    });

  }).on('error', function() {
    console.log("Error occurred!");
});
