# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import odoo.http as http

from odoo.http import request
from odoo.tools.misc import get_lang
import json

class LeadSubmission(http.Controller):
    
    @http.route('/api/submit_lead', type='http', auth='none', methods=['POST'], csrf=False)
    def submit_lead(self, **kwargs):
    	   
        try:
            data = json.loads(request.httprequest.data)
            print("********************************************************************** api got hit **********************************************************************")
            # Validate secret key
            if data.get('secret_key') != "your_secret_key_here":
                return json.dumps({"error": "Invalid authentication"})
            
            # Process data (example - store in custom model)
            env['crm.lead'].create({
                'name': data.get('name'),
                'phone': data.get('phone'),
                'plan': data.get('plan'),
                'source': data.get('source')
            })
            
            return json.dumps({"status": "success"})
            
        except Exception as e:
            return json.dumps({"error": str(e)})