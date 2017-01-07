// set region and zone from church group and zone trigger

frappe.ui.form.on("Cells", "onload", function(frm) {
  if(frm.doc.__islocal){
    argmnt={
             
            }
    if  (frm.doc.senior_cell){
          argmnt={
              "senior_cell": frm.doc.senior_cell, 
            }
    }
    else if  (frm.doc.pcf){
          argmnt={
              "pcf": frm.doc.pcf, 
            }
    }

    else if  (frm.doc.church){
          argmnt={
              "church": frm.doc.church, 
            }
    }

    else if  (frm.doc.church_group){
          argmnt={
              "church_group": frm.doc.church_group, 
            }
    }
    else if  (frm.doc.zone){
          argmnt={
              "zone": frm.doc.zone, 
            }
    }
    else if  (frm.doc.region){
          argmnt={
              "region": frm.doc.region, 
            }
    }
 
    frappe.call({
        method:"church_ministry.church_ministry.doctype.first_timer.first_timer.set_higher_values",
        args:{"args":argmnt},
        callback: function(r) {
          if (r.message){
            for (var key in r.message) {
                    cur_frm.set_value(key,r.message[key])                 
                    refresh_field(key)
                  }            
            }
          }
    });
  }

	if (in_list(user_roles, "Zonal Pastor")){
    set_field_permlevel('zone',1);
    set_field_permlevel('region',1);
  }
	else if (in_list(user_roles, "Group Church Pastor")){
    set_field_permlevel('zone',1);
    set_field_permlevel('region',1);
  }
  else if(in_list(user_roles, "Church Pastor")){
  	set_field_permlevel('church',1);
  	set_field_permlevel('church_group',1)
  	set_field_permlevel('zone',1);
    set_field_permlevel('region',1);
  }
  else if(in_list(user_roles, "PCF Leader")){
  	set_field_permlevel('pcf',1);
  	set_field_permlevel('church',1);
  	set_field_permlevel('church_group',1)
  	set_field_permlevel('zone',1);
    set_field_permlevel('region',1);
  }
  else if(in_list(user_roles, "Senior Cell Leader")){
  	set_field_permlevel('senior_cell',1);
  	set_field_permlevel('pcf',1);
  	set_field_permlevel('church',1);
  	set_field_permlevel('church_group',1)
  	set_field_permlevel('zone',1);
    set_field_permlevel('region',1);
  }
  else if(in_list(user_roles, "Cell Leader")){
  	set_field_permlevel('senior_cell',1);
  	set_field_permlevel('pcf',1);
  	set_field_permlevel('church',1);
  	set_field_permlevel('church_group',1)
  	set_field_permlevel('zone',1);
    set_field_permlevel('region',1);
  }
  $( "#map-canvas" ).remove();
  $(cur_frm.get_field("address").wrapper).append('<div id="map-canvas" style="width: 425px; height: 425px;"></div>');
    if(!frm.doc.__islocal && (frm.doc.lat &&  frm.doc.lon)){
      cur_frm.cscript.create_pin_on_map(frm.doc,frm.doc.lat,frm.doc.lon);
    }  
});

frappe.ui.form.on("Cells", "refresh", function(frm,dt,dn) {
    if(in_list(user_roles, "Cell Leader")){
      set_field_permlevel('contact_phone_no',0);
      set_field_permlevel('contact_email_id',0);
      set_field_permlevel('cell_code',1);
      set_field_permlevel('cell_name',1);
      set_field_permlevel('address',0);
    }
});

cur_frm.add_fetch("senior_cell", "pcf", "pcf");
cur_frm.add_fetch("senior_cell", "church", "church");
cur_frm.add_fetch("senior_cell", "church_group", "church_group");
cur_frm.add_fetch("senior_cell", "region", "region");
cur_frm.add_fetch("senior_cell", "zone", "zone");
cur_frm.add_fetch("senior_cell", "zone_name", "zone_name");
cur_frm.add_fetch("senior_cell", "region_name", "region_name");
cur_frm.add_fetch("senior_cell", "church_name", "church_name");
cur_frm.add_fetch("senior_cell", "group_church_name", "group_church_name");
cur_frm.add_fetch("senior_cell", "pcf_name", "pcf_name");



cur_frm.add_fetch("pcf", "church", "church");
cur_frm.add_fetch("pcf", "church_group", "church_group");
cur_frm.add_fetch("pcf", "region", "region");
cur_frm.add_fetch("pcf", "zone", "zone");

cur_frm.add_fetch("church", "church_group", "church_group");
cur_frm.add_fetch("church", "region", "region");
cur_frm.add_fetch("church", "zone", "zone");

cur_frm.add_fetch("church_group", "region", "region");
cur_frm.add_fetch("church_group", "zone", "zone");

cur_frm.add_fetch("zone", "region", "region");


cur_frm.cscript.create_pin_on_map=function(doc,lat,lon){
        var latLng = new google.maps.LatLng(lat, lon);
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 16,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
        var marker = new google.maps.Marker({
            position: latLng,
            title: 'Point',
            map: map,
            draggable: true
          });

        updateMarkerPosition(latLng);
        geocodePosition(latLng);

        google.maps.event.addListener(marker, 'dragstart', function() {
            updateMarkerAddress('Dragging...');
        });

        google.maps.event.addListener(marker, 'drag', function() {
            updateMarkerStatus('Dragging...');
            updateMarkerPosition(marker.getPosition());
        });

        google.maps.event.addListener(marker, 'dragend', function() {
            updateMarkerStatus('Drag ended');
            geocodePosition(marker.getPosition());
          });
}

function geocodePosition(pos) {
      geocoder.geocode({
        latLng: pos
      }, function(responses) {
        if (responses && responses.length > 0) {
          updateMarkerAddress(responses[0].formatted_address);
        } else {
          if(doc.__islocal) {
            alert('Cannot determine address at this location.');
          }
        }
      });
      geocoder.geocode( { 'address': doc.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        doc.lat=results[0].geometry.location.lat();
        doc.lon=results[0].geometry.location.lng();
        refresh_field('lat')
        refresh_field('lon')
      } 
    });
}

function updateMarkerAddress(str) {
  doc=cur_frm.doc
  doc.address= str;
  refresh_field('address');
}

function updateMarkerStatus(str) {
var s=1;
}

function updateMarkerPosition(latLng) {
  doc=cur_frm.doc
  doc.lat=latLng.lat()
  doc.lon=latLng.lng()
  refresh_field('lat')
  refresh_field('lon')
}

var geocoder = new google.maps.Geocoder();
var getMarkerUniqueId= function(lat, lng) {
    return lat + '_' + lng;
}

var getLatLng = function(lat, lng) {
    return new google.maps.LatLng(lat, lng);
};

cur_frm.cscript.address = function(doc, dt, dn){
      geocoder.geocode( { 'address': doc.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          doc.address=results[0].formatted_address;
          refresh_field('address');
          var latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());

          var map = new google.maps.Map(document.getElementById('map-canvas'), {
              zoom: 16,
              center: latLng,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            });

          var marker = new google.maps.Marker({
              position: latLng,
              title: 'Point',
              map: map,
              draggable: true
            });
          updateMarkerPosition(latLng);
          geocodePosition(latLng);

          google.maps.event.addListener(marker, 'dragend', function() {
              geocodePosition(marker.getPosition());
          });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}