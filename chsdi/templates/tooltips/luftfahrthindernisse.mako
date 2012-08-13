<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.registrationnumber or '-'}</%def>

<%def name="table_body()">

</%def>

<%def name="body()">
<%
    import time
    from datetime import date
    today = date.today()
%>
% if c.last == False:
<div style="height: 650px !important; page-break-after: always;">
% elif c.last == True:
<div style="height: 650px !important;">
% endif
    <table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
        <tr>
            <td style="font-weight: bold; font-size: 14px; width:100%;">${_('tt_ch.bazl.registrationnummer')} ${c.feature.registrationnumber}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 14px; width:100%;">${_('tt_ch.bazl.status')} ${c.feature.state}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.startofconstruction')} ${c.feature.startofconstruction}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.abortionaccomplished')} ${c.feature.abortionaccomplished}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 14px;">${_('tt_ch.bazl.geometriedaten')}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.maxheight')} ${c.feature.maxheightagl}</td></tr>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.elevation')} ${c.feature.topelevationamsl}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.totallength')} ${c.feature.totallength}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 14px; width:100%;">${_('tt_ch.bazl.standortkoordinaten')}</td>
        <tr>
        <tr>
            <td style="padding-left: 200px;">E=${c.feature.geometry.bounds[0]}  N=${c.feature.geometry.bounds[1]}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">E=${c.feature.geometry.bounds[0]}  N=${c.feature.geometry.bounds[3]}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">E=${c.feature.geometry.bounds[2]}  N=${c.feature.geometry.bounds[1]}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">E=${c.feature.geometry.bounds[2]}  N=${c.feature.geometry.bounds[3]}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 14px; width:100%;">${_('tt_ch.bazl.markierung')}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${c.feature.obstacletype}</td>
        </tr>
    </table>
    </br>

    <%
        width = 600
        height = 400
    %>
    % if c.feature.geometry.bounds[0] == c.feature.geometry.bounds[2] and c.feature.geometry.bounds[1] == c.feature.geometry.bounds[3]:
    <%
        xmin = c.feature.geometry.bounds[0] - 150
        ymin = c.feature.geometry.bounds[1] - 100
        xmax = c.feature.geometry.bounds[0] + 150
        ymax = c.feature.geometry.bounds[1] + 100
    %>
    % else:
    <%
        xlength = c.feature.geometry.bounds[2] - c.feature.geometry.bounds[0]
        ylength = c.feature.geometry.bounds[3] - c.feature.geometry.bounds[1]
    %>
        % if xlength < 300 and ylength < 200:
        <%
            xhalf = 150
            yhalf = 100
        %>
        % elif xlength < 600 and ylength < 400:
        <%
            xhalf = 300 
            yhalf = 200
        %>
        % elif xlength < 1200 and ylength < 800:
        <%
            xhalf = 600
            yhalf = 400
        %>
        % elif xlength < 3000  and ylength < 2000 :
        <%
            xhalf = 1500
            yhalf = 1000
        %>
        % elif xlength < 6000  and ylength < 4000 :
        <%
            xhalf = 3000
            yhalf = 2000
        %>
        % elif xlength < 12000  and ylength < 8000 :
        <%
            xhalf = 6000
            yhalf = 4000
        %>
        % elif xlength < 30000  and ylength < 20000 :
        <%
            xhalf = 15000
            yhalf = 10000
        %>
        % endif
        <%
            xmin = c.feature.geometry.bounds[0] - (xhalf-(xlength/2))
            ymin = c.feature.geometry.bounds[1] - (yhalf-(ylength/2))
            xmax = c.feature.geometry.bounds[2] + (xhalf-(xlength/2))
            ymax = c.feature.geometry.bounds[3] + (yhalf-(ylength/2))
        %>
    % endif
    <img src="http://wms.swisstopo4inspire.admin.ch/?LAYERS=ch.swisstopo.pixelkarte-grau,ch.swisstopo.pixelkarte-farbe&FORMAT=image/png&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&SRS=EPSG:21781&BBOX=${xmin},${ymin},${xmax},${ymax}&WIDTH=${width}&HEIGHT=${height}"/> 
    </br>
    <style> .tooltip_large_header { display: none; } </style>
</div>

</%def>
