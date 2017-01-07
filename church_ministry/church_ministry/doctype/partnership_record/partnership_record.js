cur_frm.add_fetch("member", "member_name", "member_name");
cur_frm.add_fetch("ftv", "ftv_name", "ftv_name");

cur_frm.add_fetch("member", "cell", "cell");
cur_frm.add_fetch("member", "senior_cell", "senior_cell");
cur_frm.add_fetch("member", "pcf", "pcf");
cur_frm.add_fetch("member", "church", "church");
cur_frm.add_fetch("member", "church_group", "church_group");
cur_frm.add_fetch("member", "zone", "zone");
cur_frm.add_fetch("member", "region", "region");
cur_frm.add_fetch("member", "cell_name", "cell_name");
cur_frm.add_fetch("member", "senior_cell_name", "senior_cell_name");
cur_frm.add_fetch("member", "pcf_name", "pcf_name");
cur_frm.add_fetch("member", "church_name", "church_name");
cur_frm.add_fetch("member", "group_church_name", "group_church_name");
cur_frm.add_fetch("member", "zone_name", "zone_name");
cur_frm.add_fetch("member", "region_name", "region_name");

cur_frm.add_fetch("ftv", "ftv_owner", "member1");
cur_frm.add_fetch("ftv", "cell", "cell");
cur_frm.add_fetch("ftv", "senior_cell", "senior_cell");
cur_frm.add_fetch("ftv", "pcf", "pcf");
cur_frm.add_fetch("ftv", "church", "church");
cur_frm.add_fetch("ftv", "church_group", "church_group");
cur_frm.add_fetch("ftv", "zone", "zone");
cur_frm.add_fetch("ftv", "region", "region");
cur_frm.add_fetch("ftv", "cell_name", "cell_name");
cur_frm.add_fetch("ftv", "senior_cell_name", "senior_cell_name");
cur_frm.add_fetch("ftv", "pcf_name", "pcf_name");
cur_frm.add_fetch("ftv", "church_name", "church_name");
cur_frm.add_fetch("ftv", "group_church_name", "group_church_name");
cur_frm.add_fetch("ftv", "zone_name", "zone_name");
cur_frm.add_fetch("ftv", "region_name", "region_name");

// frappe.ui.form.on("Partnership Record", "validate", function(frm,doc) {
// 	// if(frm.doc.is_member==1){
// 	// 	if(!frm.doc.member){
// 	// 		msgprint("Please select Member for Partnership Record before save..! ");
//  //        	throw "Please select Member!"
// 	// 	}
// 	// }
// 	else if(frm.doc.is_member==0){
// 		if(!frm.doc.ftv){
// 			msgprint("Please select FTV for Partnership Record before save..! ");
//         	throw "Please select FTV!"
// 		}
// 	}
// });

frappe.ui.form.on("Partnership Record", "onload", function(frm,doc) {
		frm.doc.ministry_year=frappe.defaults.get_user_default("fiscal_year");
		refresh_field('ministry_year');	
});

frappe.ui.form.on("Partnership Record", "member", function(frm,doc) {
	if(!frm.doc.member){
		frm.doc.member_name=" ";
		refresh_field("member_name");
	}
});

frappe.ui.form.on("Partnership Record", "amount", function(frm,doc) {
	frm.doc.equated_amount=(frm.doc.amount).toFixed(2);
	frm.doc.total_amount=(frm.doc.amount*frm.doc.conversation_rate).toFixed(2);
	refresh_field("total_amount");

});

frappe.ui.form.on("Partnership Record", "currency", function(frm,doc) {
	console.log(frappe.boot.sysdefaults.currency);
	console.log(frm.doc.currency);
	if (frm.doc.currency!= frappe.boot.sysdefaults.currency){
		frm.doc.total_amount=(frm.doc.amount*frm.doc.conversation_rate).toFixed(2);
		refresh_field("total_amount");
	}
	else{
		frm.doc.conversation_rate=1;
		frm.doc.total_amount=(frm.doc.amount*frm.doc.conversation_rate).toFixed(2);
		refresh_field("conversation_rate");
		refresh_field("total_amount");
	}
});

frappe.ui.form.on("Partnership Record", "conversation_rate", function(frm,doc) {
	frm.doc.total_amount=(frm.doc.amount*frm.doc.conversation_rate).toFixed(2);
	refresh_field("total_amount");
});

frappe.ui.form.on("Partnership Record", "date", function(frm,doc) {
		frm.doc.ministry_year=frappe.defaults.get_user_default("fiscal_year");
		refresh_field('ministry_year');
});

frappe.ui.form.on("Partnership Record", "ftv", function(frm,doc) {
	if(!frm.doc.ftv){
		frm.doc.ftv_name=" ";
		refresh_field("ftv_name");
	}
});

cur_frm.fields_dict['ftv'].get_query = function(doc) {
  return {
    filters: {
      "approved": 0
    }
  }
}

frappe.ui.form.on("Partnership Record", "type_of_pledge", function(frm,doc) {
	frm.doc.equated_amount='0.0';
	refresh_field("equated_amount");
		if (frm.doc.type_of_pledge=='Monthly'){
			frm.doc.equated_amount=frm.doc.amount;
		}
		else if (frm.doc.type_of_pledge=='Quarterly'){
			frm.doc.equated_amount=frm.doc.amount;		
		}
		else if (frm.doc.type_of_pledge=='Half Yearly'){
			frm.doc.equated_amount=frm.doc.amount;
		}
		else if (frm.doc.type_of_pledge=='Yearly'){
			frm.doc.equated_amount=frm.doc.amount;
		}
	refresh_field("equated_amount");
});
frappe.ui.form.on("Partnership Record", "donation", function(frm,doc) {
	 if (frm.doc.donation){
			frm.doc.equated_amount='0.0';
			refresh_field("equated_amount");
		}
});
frappe.ui.form.on("Partnership Record", "pledge", function(frm,doc) {
	 if (frm.doc.donation){
			frm.doc.equated_amount='0.0';
			refresh_field("equated_amount");
		}
});