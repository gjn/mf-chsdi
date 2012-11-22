<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.gemeindename or '-'}</%def>

<%def name="table_body()">
    % if hasattr(c.feature, 'kanton'):
    <tr><td width="150" valign="top">${_('gemkanton')}</td><td>${c.feature.kanton or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'gemeindename'):
    <tr><td width="150">${_('gemgemeinde')}</td><td>${c.feature.gemeindename or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'flaeche_ha'):
    <tr><td width="150">${_('gemflaeche')}</td><td>${c.feature.flaeche_ha or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'bfs_nr'):
    <tr><td width="150">${_('gembfs')}</td>    <td>${c.feature.bfs_nr or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'abgabestelle'):
    <tr><td width="150">${_('gemdarstellung')}</td>
       % if c.feature.abgabestelle == None:
         <td>-</td>
      % else:
         <td><a target="_blank" href="http://${c.feature.abgabestelle.replace("http://","")}">${"Link" or '-'}</a></td>
      % endif 
    </tr>
    % endif
    % if hasattr(c.feature, 'pdf_liste'):
    <tr><td width="150">${_('geompdf_liste')}</td>
      % if c.lang == 'de'or c.lang == 'rm' or c.lang == 'en':
    <%
        myarr=c.feature.pdf_liste.split(';')
        link = ''
        t = myarr[0]
        link += "<a href=\"" + t + "\" target=\"_blank\">" + t[34:].replace(".pdf","") + "</a><br />"
     %>
      % elif c.lang == 'fr':
    <%
        myarr=c.feature.pdf_liste.split(';')
        link = ''
        t = myarr[1]
        link += "<a href=\"" + t + "\" target=\"_blank\">" + t[34:].replace(".pdf","") + "</a><br />"
     %>
      % elif c.lang == 'it':
    <%
        myarr=c.feature.pdf_liste.split(';')
        link = ''
        t = myarr[2]
        link += "<a href=\"" + t + "\" target=\"_blank\">" + t[34:].replace(".pdf","") + "</a><br />"
     %>
      % endif
    <td>${link}</td></tr>
    % endif
</%def>
