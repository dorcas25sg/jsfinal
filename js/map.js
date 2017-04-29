// Leaflet map setup
var map = L.map('map', {
  center: [1.3521, 103.8198],
  zoom: 12,
  zoomControl:false,
  scrollWheelZoom: false
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

// Initially, we want these hidden
$(".legend").hide();
$("#restart").hide();
$(".selected").hide();

// Default Zoom
//var defaultZoom = function(){
//    map.setView([1.3521, 103.8198], 12);
//};

// If all is checked, select all factors
$('#all2').change(function() {
  console.log('ALL changed');
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

// activate submit button only if at least one checkbox is selected
var checkingBoxes = $('.checkbox');
checkingBoxes.change(function () {
    $('#submit').prop('disabled', checkingBoxes.filter(':checked').length < 1);
});
$('.checkbox').change();


var cartoUserName = 'dorcas25sg';

var myLayer;

var resetcss = "{marker-fill-opacity: 0; marker-line-opacity: 0; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true;}";
var checkedcss = "{marker-fill: #2799ff; marker-width: 55; marker-fill-opacity:";
var checkedcss2 = "; marker-line-width: 0; marker-allow-overlap: true;}";
//var checkedcss3 = "{marker-fill: #2799ff; marker-width: 100; marker-fill-opacity: 0.05; marker-line-width: 0; marker-allow-overlap: true;}";

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
    layer.on('featureClick',function(e, latlng, pos, data) {
      console.log(data);
    });
    // Add button click events

    //when submit is clicked...
    $("#submit").click(function() {
      $("#restart").show();
      $(".selected").show();
      $(".toSelect").hide();
      $(".checkboxes").hide();
      $("#submit").hide();

      $('#submit').prop('disabled', true);
      $('#redo').prop('disabled', false);
      $('.checkbox').prop('disabled', true);

      // state what was being selected on sidebar
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

      //defaultZoom();

      $(".legend").hide();
      $("#restart").hide();
      $(".selected").hide();
      $(".toSelect").show();
      $(".checkboxes").show();
      $("#submit").show();

      $('.listfactors').empty();

      //$('#submit').prop('disabled', false);
      $('.checkbox').change();
      $('.checkbox').prop('disabled', false);
      $('.checkbox').prop('checked', false);
      $('#restart').prop('disabled', false);
    });

  }).on('error', function() {
    console.log("some error occurred");
});
