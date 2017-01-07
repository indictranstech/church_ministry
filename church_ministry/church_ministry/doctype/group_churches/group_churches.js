
frappe.ui.form.on("Group Churches", "onload", function(frm) {


frappe.call({
            method:"church_ministry.church_ministry.doctype.zones.zones.get_region_name",
            args:{"region":cur_frm.doc.region},
            callback: function(r) {
              if (r.message){
                console.log("regggg ",r.message[0].name)
                cur_frm.set_value("region_name",r.message[0].name)
              }
            }
          });



 if(frm.doc.__islocal){
    argmnt={
             
            }
    if  (frm.doc.zone ){
          argmnt={
              "zone": frm.doc.zone, 
            }
    }
    else if  (frm.doc.region){
          argmnt={
              "region": frm.doc.region, 
            }

            
    }

    

    if (argmnt) {
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
}

	if (in_list(user_roles, "Regional Pastor")){
    	set_field_permlevel('region',1);

  	}
 	else if (in_list(user_roles, "Zonal Pastor")){
  		set_field_permlevel('zone',1);
    	set_field_permlevel('region',1);
    //   set_field_permlevel('zone_name',1);
    //   set_field_permlevel('region_name',2);
     
    }
    else if (in_list(user_roles, "Group Church Pastor")){
   		set_field_permlevel('zone',1);
    	set_field_permlevel('region',1);
  	}
});

frappe.ui.form.on("Group Churches", "refresh", function(frm,dt,dn) {

    if(in_list(user_roles, "Group Church Pastor")){
      set_field_permlevel('contact_phone_no',0);
      set_field_permlevel('contact_email_id',0);
      set_field_permlevel('church_group_code',1);
      set_field_permlevel('church_group',1);
      set_field_permlevel('group_church_hq',0);
    }
});

cur_frm.fields_dict['group_church_hq'].get_query = function(doc) {
  if (doc.region){
      return "select name,church_code,church_name from `tabChurches` where region='"+doc.region+"'"
    }
    else{
      return "select name,church_code,church_name from `tabChurches`"
    }
}


// for setting region from zone
cur_frm.add_fetch("zone", "region", "region");
cur_frm.add_fetch("zone", "zone_name", "zone_name");
cur_frm.add_fetch("zone", "region", "region_name");
cur_frm.add_fetch("zone", "region_name", "region_name");
