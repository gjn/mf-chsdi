<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
	% if c.feature.nbofprovider:
        <%        
            i=c.feature.nbofprovider
            aliasarr=[str(a) for a in c.feature.alias.split(';')]
            urlarr=[str(b) for b in c.feature.fdaurl.split(';')]
        %>
        % for x in xrange(0,i):
            <tr><td width="150">${_('tt_ngamapping_provider')}</td>    <td><a href="${urlarr[x] or '-'}" target="_blank">${aliasarr[x] or '-'}</a></td></tr>
	    % endfor
    % else:
       <tr><td width="150">${_('tt_ngamapping_provider')}</td>    <td> - </td></tr>
	% endif
</%def>
