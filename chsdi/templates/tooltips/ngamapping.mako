<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
	% if c.feature.nbofprovider > 0:
    <tr>
        <%  
            import numpy
            i=c.feature.nbofprovider
            aliasarr=[unicode(a) for a in c.feature.alias.split(';')]
            urlarr=[unicode(b) for b in c.feature.fdaurl.split(';')]
            inds = numpy.argsort(aliasarr)
            sortedalias = numpy.take(aliasarr, inds)
            sortedurl = numpy.take(urlarr, inds)
        %>
        % for x in xrange(0,i):
                <td><a href="${sortedurl[x] or '-'}" target="_blank">${sortedalias[x] or '-'}</a></td></tr>
	    % endfor
    % else:
       <td> - </td>
	% endif
</%def>
