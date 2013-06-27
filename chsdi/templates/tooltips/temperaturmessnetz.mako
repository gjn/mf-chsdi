<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name or '-'}</%def>

<%def name="table_body()">

<% c.stable_id = True %>
% if c.counter == 1:
    <%
        import xml.etree.ElementTree as et
        import urllib2

        xml_file = urllib2.urlopen('http://www.hydrodaten.admin.ch/lhg/SMS.xml')
        tree = et.parse(xml_file)
        c.root = tree.getroot()
    %>
% endif

    <%
        from chsdi.lib.helpers import parseHydroXML
        import urllib2
        fid = str(c.feature.nr)
        link_image = str(c.feature.nr)
        html_attr = parseHydroXML(fid, c.root)
        try:
            image = "http://www.hydrodaten.admin.ch/lhg/az/plots/surface/3day_mobile/T_" + link_image + ".png"
            image = "http://www.hydrodaten.admin.ch/lhg/az/plots/naduf/3day_mobile/T_" + link_image + ".png"
            file = urllib2.urlopen(image)
        except:
            image = None
            
    %>
    <tr><td width="200">${_('wassertemp_name')}</td>    <td>${c.feature.name or '-'}</td></tr>
    <tr><td>${_('wassertemp_nr')}</td>   <td>${c.feature.nr or '-'()}</td></tr>
    <tr><td style="vertical-align: top;">${_('wassertemp_3tagtemp')}</td>
        <td>
% if image is not None:
            <img src="${image}"/>
% else:
            -
% endif
        </td>
   </tr>
   <tr><td>${_('date_time')}</td>   <td>${html_attr['date_time']}</td></tr>
   <tr><td>${_('wassertemperatur')}</td>    <td>${html_attr['wassertemperatur']}</td></tr>

% if c.lang == 'de' or c.lang == 'rm' :
    <tr><td>${_('aktuelle_daten')}</td>    <td><a target="_blank" href="http://www.hydrodaten.admin.ch/de/${c.feature.url}.html">${_('url') or '-'}</a></td></tr>
% else :
    <tr><td>${_('aktuelle_daten')}</td>    <td><a target="_blank" href="http://www.hydrodaten.admin.ch/${c.lang}/${c.feature.url}">${_('url') or '-'}</a></td></tr>
% endif

</%def>
