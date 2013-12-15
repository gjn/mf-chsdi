<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
	% if c.feature.nbofprovider > 0:
    <tr>
        <%        
            i=c.feature.nbofprovider
            aliasarr=sorted([unicode(a) for a in c.feature.alias.split(';')])
            urlarr=sorted([unicode(b) for b in c.feature.fdaurl.split(';')])
        %>
        % for x in xrange(0,i):
                <td><a href="${urlarr[x] or '-'}" target="_blank">${aliasarr[x] or '-'}</a></td></tr>
	    % endfor
    % else:
       <td> - </td>
	% endif
</%def>
