<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.kbbez or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('tilenumber')}</td> <td>${c.feature.tilenumber or '-'}</td></tr>
    <tr><td width="150">${_('sheetname')}</td> <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('Datenstand')}</td> <td>${int(round(c.feature.datenstand)) or '-'}</td></tr>
	<tr><td width="150">${_('alexandria')}</td> <td><a href="http://libraries.admin.ch/cgi-bin/gwalex/chameleon?function=INITREQ&SourceScreen=NOFUNC&skin=portal&search=FREEFORM&u1=0&t1=aw%3Abv80035759+%26+t%3A${c.feature.kbbez|h,trim}&op1=AND&u2=0&t2=&op2=AND&u3=0&t3=&lng=de&conf=.%2Fchameleon.conf&pos=1&host=biblio.admin.ch+3606+DEFAULT&sortby=pubti&sortdirection=0" target="_blank">${c.feature.kbbez|h,trim}</a></td></tr>
</%def>