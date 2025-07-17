from odoo import models, fields, api

class CrmTeam(models.Model):
    _inherit = 'crm.team'

    @api.model
    def create(self, vals):
        team = super().create(vals)
        if 'user_id' in vals and vals['user_id']:
            team._update_team_leader_group(None, team.user_id)
        return team

    def write(self, vals):
        for team in self:
            old_user = team.user_id
            res = super(CrmTeam, team).write(vals)
            if 'user_id' in vals:
                new_user = self.env['res.users'].browse(vals['user_id']) if vals['user_id'] else None
                team._update_team_leader_group(old_user, new_user)
        return True

    def unlink(self):
        group = self.env.ref('km_crm.group_crm_team_leader')
        for team in self:
            user = team.user_id
            res = super(CrmTeam, team).unlink()
            # After deleting, check if user is still a leader anywhere
            if user:
                still_leader = self.search_count([('user_id', '=', user.id)])
                if still_leader == 0:
                    user.groups_id -= group
        return res

    def _update_team_leader_group(self, old_user, new_user):
        """ Add/remove users from the CRM Team Leader group based on team leader assignment """
        group = self.env.ref('km_crm.group_crm_team_leader')

        # Remove old team leader if no other team uses them
        if old_user and old_user != new_user:
            still_leader = self.search_count([('user_id', '=', old_user.id)])
            if still_leader == 0:
                old_user.groups_id -= group

        # Add new team leader
        if new_user and group not in new_user.groups_id:
            new_user.groups_id += group
