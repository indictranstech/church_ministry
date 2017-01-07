frappe.pages['members-addres'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Member Address on map',
		single_column: true
	});
	$("<div class='map_multiple'  id ='map_multiple' style='width: 1200px; height: 725px;'></div>").appendTo($(wrapper).find('.layout-main-section'));
	
	new frappe.assign(wrapper);

}	

frappe.assign = Class.extend({
	init: function(wrapper) {
		this.wrapper = wrapper;
		this.body = $(this.wrapper).find(".assignt");
		this.setup_page();
		
	},
	setup_page: function(ftv){
		var me = this;
		$(me.wrapper).find('.assignr').empty();	 
   
   		var locations = [
		      ['DESCRIPTION', 41.926979,12.517385, 3],
		      ['DESCRIPTION', 41.914873,12.506486, 2],
		      ['DESCRIPTION', 41.918574,12.507201, 1]
		];
        
        var map = new google.maps.Map(document.getElementById('map_multiple'), {
              zoom: 16,
              center: new google.maps.LatLng(41.923, 12.513), 
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              zoomControl: true,
    		  scaleControl: true
        });

        for (i = 0; i < locations.length; i++) {  
	      	marker = new google.maps.Marker({
	        	position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	        	map: map
	    	});
        } 
	} 
});
