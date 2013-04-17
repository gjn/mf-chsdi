# -*- coding: utf-8 -*-

<!DOCTYPE html>
<html>
    <head>
        <meta content="text/html" charset="utf-8" http-equiv="Content-Type">
        <meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1" >
        <link href="/${c.api_version}/${c.instanceid}/wsgi/build/api.css" type="text/css" rel="stylesheet">
        <style>
        @media print
            {
                .tooltip_black_border { border: none; }
            }            
        </style>

    </head>
    <body>
    <div class="tooltip_black_border">
    <div class="tooltip_large_header">
       <span style="font-weight:bold;">${c.layer_bezeichnung}</span> (${c.layer_datenherr})
    </div>
        ${c.feature.html or '-'}
    <div>
        <div style="float:left; align: left" class="tooltip_large_footer"><a class='disclamer' href="${_('disclaimer url')}" target="_blank">${_('disclaimer title')}</a></div>
            <div style="float:right; align: right" class="tooltip_large_footer">
    <%
        if len(c.baseUrl.split('?topic=')) == 2:
            baseUrl = c.baseUrl.split('?topic=')[0]
            topic = 'topic=' + c.baseUrl.split('?topic=')[1] + '&'
        else:
            baseUrl = c.baseUrl
            topic = ''
    %>
        % if c.stable_id is True:
            <a class="tooltip_red_link" href="${baseUrl}?${topic}${c.layer_id}=${c.feature.id}&lang=${c.lang}" target="new">${_('Link to object')}</a>&nbsp;|&nbsp;
        % endif
            <a class="tooltip_red_link" href="javascript:window.print();">${_('print')}</a></div>
    </div>
    </body>
</html>
