# Copyright (c) 2015, New Indictrans Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import throw, _, msgprint

class PartnershipRecord(Document):
	def validate(self):
		if self.giving_type=='Cheque':
			if (not self.instrument__no  or not self.instrument_date or  not self.bank_name) :
				frappe.throw(_(" 'Instrument No' , 'Instrument Date' and 'Bank Name' are mandatory for giving type 'Cheque' ..!"))

		self.validate_member_ft()

	def validate_member_ft(self):
		if self.is_member=="Member" and not self.member:
			frappe.throw(_("Please select Member for Partnership Record before save..!"))

		if self.is_member=="FT" and not self.ftv:
			frappe.throw(_("Please select FTV for Partnership Record before save..!"))

	def on_submit(self):
		if self.is_member==1:
			email=frappe.db.sql("select email_id,member_name from `tabMember` where name='%s'"%(self.member))
		else:
			email=frappe.db.sql("select email_id,ftv_name from `tabFirst Timer` where name='%s'"%(self.ftv))
		if email:
			msg="""Hello %s,\n 
				Thank you so much for your donation of amount '%s'. \n
				\n
				Regards,\n
				Verve"""%(email[0][1],self.amount)
			frappe.sendmail(recipients=email[0][0], sender='gangadhar.k@indictranstech.com', content=msg, subject='Partnership Record')

def get_permission_query_conditions(user):
	if not user: user = frappe.session.user

	if "System Manager" in frappe.get_roles(user):
		return None
	else:
		abc="""
			`tabPartnership Record`.church in (select distinct defvalue from `tabDefaultValue` where parent='%(user)s' and defkey='Churches')
			or
			`tabPartnership Record`.church_group in (select distinct defvalue from `tabDefaultValue` where parent='%(user)s' and defkey='Group Churches')
			or
			`tabPartnership Record`.zone in (select distinct defvalue from `tabDefaultValue` where parent='%(user)s' and defkey='Zones')
			or
			`tabPartnership Record`.region in (select distinct defvalue from `tabDefaultValue` where parent='%(user)s' and defkey='Regions')
			or 
			`tabPartnership Record`.member in (select distinct defvalue from `tabDefaultValue` where parent='%(user)s' and defkey='Member')
			""" % {
				"user": frappe.db.escape(user),
				"roles": "', '".join([frappe.db.escape(r) for r in frappe.get_roles(user)])
			}
		return abc

def has_permission(doc, user):

	if "System Manager" in frappe.get_roles(user):
		return True

	if doc.region:
		res=frappe.db.sql("select distinct defvalue from `tabDefaultValue` where parent='%s' and defkey='Regions'"%(user))
		if res:
			return True

	if doc.zone:
		res=frappe.db.sql("select distinct defvalue from `tabDefaultValue` where parent='%s' and defkey='Zones'"%(user))
		if res:
			return True

	if doc.church_group:
		res=frappe.db.sql("select distinct defvalue from `tabDefaultValue` where parent='%s' and defkey='Group Churches'"%(user))
		if res:
			return True

	if doc.church:
		res=frappe.db.sql("select distinct defvalue from `tabDefaultValue` where parent='%s' and defkey='Churches'"%(user))
		if res:
			return True

	if doc.member:
		res=frappe.db.sql("select distinct defvalue from `tabDefaultValue` where parent='%s' and defkey='Member'"%(user))
		if res:
			return True

	return False