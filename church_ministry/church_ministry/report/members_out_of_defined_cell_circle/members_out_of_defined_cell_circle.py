# Copyright (c) 2013, New Indictrans Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
class MemberasOutCell():

	def run(self):
		return self.get_columns(), self.get_data()

	def get_columns(self):
		columns = [_("Cell ID")+ ":Link/Cells:180"]

		columns += [
			_("Cell Name") + ":Data:90",
			_("Member ID") + ":Link/Member:90",			
			_("Member Name") + ":Data:100",
			_("Distance From Cell") + ":Data:135",
			_("Exceeded Distance ") + ":Data:125",
			_("Cell Address ") + ":Data:220",
			_("Member Address ") + ":Data:220"]

		return columns

	def get_data(self):
		data = []
		res=frappe.db.sql("select name,lat,lon,cell_name,address from tabCells where lat is not null and lon is not null")
		#frappe.errprint(res)
		allowed_distance= frappe.db.get_value("Notification Settings", "Notification Settings","maximum_allowed_distance_of_member_from_cell")
		for name in res:
			qry="SELECT cell,'%(cell_name)s',name,member_name, TRUNCATE(( 6371 * acos ( cos ( radians(%(lat)s) ) * cos( radians( lat ) ) * cos( radians( lon ) - radians(%(lon)s) ) + sin ( radians(%(lat)s) ) * sin( radians( lat ) ) ) ) ,3) AS distance ,TRUNCATE(( 6371 * acos ( cos ( radians(%(lat)s) ) * cos( radians( lat ) ) * cos( radians( lon ) - radians(%(lon)s) ) + sin ( radians(%(lat)s) )  * sin( radians( lat ) )  ) ) - %(max_dist)s ,3)as more_distance,'%(address)s',address FROM tabMember HAVING distance > %(max_dist)s  and cell= '%(cell)s' ORDER BY distance "%({"lat":name[1],"lon":name[2],"max_dist":allowed_distance,"cell":name[0],"address":name[4],"cell_name":name[3]})
			#frappe.errprint(qry)
			dt_rows=frappe.db.sql(qry,as_list=1)
			for rows in dt_rows:
				data.append(rows)
				#frappe.errprint(rows)

		#frappe.errprint(data)
		return data


	def make_data_dict(self, cols, data):
		data_dict = []
		for d in data:
			data_dict.append(frappe._dict(zip(cols, d)))

		return data_dict

def execute(filters=None):

	return MemberasOutCell().run()
