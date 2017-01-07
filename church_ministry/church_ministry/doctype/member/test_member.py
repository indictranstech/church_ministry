# Copyright (c) 2013, New Indictrans Technologies Pvt. Ltd. and Contributors
# See license.txt

import frappe
import unittest

test_records = frappe.get_test_records('Member')

class TestMember(unittest.TestCase):
	pass
