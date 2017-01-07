# Copyright (c) 2013, New Indictrans Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import throw, _, msgprint
from erpnext.setup.doctype.sms_settings.sms_settings import send_sms
from gcm import GCM

class Zones(Document):
	pass

def validate_duplicate(doc,method):
	if doc.get("__islocal"):
		res=frappe.db.sql("select name from `tabZones` where (zone_name='%s' or zone_code='%s') and region='%s'"%(doc.zone_name,doc.zone_code,doc.region))
		if res:
			frappe.throw(_("Zone '{0}' already created with same Zone Name '{1}' or Zone Code '{2}' for Region '{3}'..!").format(res[0][0],doc.zone_name,doc.zone_code,doc.region))

		notify_msg = """Dear User,\n\n Zone is created with name '%s' for region '%s'.\n\nRegards,\n\n Love World Synergy"""%(doc.zone_name,doc.region)
		notify = frappe.db.sql("""select value from `tabSingles` where doctype='Notification Settings' and field='on_creation_of_a_new_cell_pcf_church'""",as_list=1)
		if notify:
			if "Email" in notify[0][0]:
				if doc.contact_email_id:
					frappe.sendmail(recipients=doc.contact_email_id, content=notify_msg, subject='Zone Creation Notification')
			if "SMS" in notify[0][0]:
				if doc.contact_phone_no:
					send_sms(doc.contact_phone_no, notify_msg)
			if "Push Notification" in notify[0][0]:
				data={}
				data['Message']=notify_msg
				gcm = GCM('AIzaSyBIc4LYCnUU9wFV_pBoFHHzLoGm_xHl-5k')
				res1=frappe.db.sql("select device_id from tabUser where name ='%s'" %(doc.contact_email_id),as_list=1)
				if res1:
					res1 = gcm.json_request(registration_ids=res1, data=data,collapse_key='uptoyou', delay_while_idle=True, time_to_live=3600)
		ofc = frappe.new_doc("Offices")
		ofc.office_id = doc.name
		ofc.office_name = doc.zone_name
		ofc.office_code = doc.zone_code
		ofc.insert()



@frappe.whitelist()
def get_region_name(region):
	data = frappe.db.sql("select name from `tabRegions` where name = %s",region, as_dict=1)
	print "dasdasdasdas",data
	return data