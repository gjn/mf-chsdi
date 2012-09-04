<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.zkob or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('beschreibung')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('x')}</td>          <td>${c.feature.x or '-'}</td></tr>
    <tr><td width="150">${_('y')}</td>         <td>${c.feature.y or '-'}</td></tr>
    <tr><td width="150">${_('gemeinde')}</td>          <td>${c.feature.gemeinde or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td>         <td>${c.feature.kt_kz or '-'}</td></tr>
</%def>

<%def name="body()">
<link rel="stylesheet" type="text/css" href="/${c.instanceid}/wsgi/GeoAdmin.ux/Lightbox/css/lightbox.css">
<script type="text/javascript" src="/${c.instanceid}/wsgi/lib/ext/Ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/${c.instanceid}/wsgi/lib/ext/Ext/ext-all.js"></script>
<script type="text/javascript" src="/${c.instanceid}/wsgi/GeoAdmin.ux/Lightbox/lib/Lightbox.js"></script>
<style>
    .thumbnail {
        padding: 4px;
        background-color: #e6e6e0;
        border: 1px solid #d6d6d0;
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
        margin-top: 5px;
    }
    .tooltip_large_header {
        margin-left: 7px !important;
    } 
</style>

<% objektart = c.feature.objektart.split(',') %>
<table border="0" cellspacing="10" cellpadding="5" width="100%" style="font-size: 100%;" padding="1 1 1 1">
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('name')}:</td>
         <td style="width: 300px; float: left;">${c.feature.zkob or '-'}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('kategorie')}:</td>
         <td style="width: 300px; float: left;">${c.feature.kategorie or '-'}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('tt_kbs_objektart')}:</td>
         <td style="width: 300px; float: left;">
% for objart in objektart:
<% obj = 'kultur' + objart %>
     ${_(obj)}
% endfor
         </td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('tt_kbs_nbr')}:</td>
         <td style="width: 300px; float: left;">${c.feature.id or '-'}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('nfadresse')}:</td>
         <td style="width: 300px; float: left;">${c.feature.adresse or ''}  ${c.feature.hausnr or ''}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('tt_kbs_gemeinde')} / ${_('tt_kbs_gemeinde_ehemalige')}:</td>
         <td style="width: 300px; float: left;">${c.feature.gemeinde or '-'} / ${c.feature.gemeinde_ehemalig or '-'}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('Coordinates')}:</td>
         <td style="width: 300px; float: left;">${c.feature.x or '-'} / ${c.feature.y or '-'}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;"></td>
         <td style="width: 300px; float: left;"><div style="margin-left: -313px;">${c.feature.kurztexte or ''}</div></td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;"></td>
         <td style="width: 300px; float: left;"><div style="margin-left: -313px;" id="images"></div></td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('Feature tooltip')}:</td>
         <td style="width: 300px; float: left;"><a id="pdf">PDF</a></td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('official object webpage')}:</td>
         <td style="width: 300px; float: left;"><a href="${c.feature.link_uri or ''}">${c.feature.link_title or ''}</a></td>
     </tr>
     <tr>
         <td><a href="http://kgs.admin.ch/kgs_inventar/statistik.pdf">${_('tt_kbs_statistik')}</a></td>
     </tr>
</table>

<%
    from chsdi.lib.helpers import MyHTMLParser
    from urllib2 import urlopen

    url = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/bilder/'
    f = urlopen(url)
    s = f.read()
    parser = MyHTMLParser(flayer='kgs',fid=str(c.feature.id))
    parser.feed(s)

    url2 = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/matrizen/'
    f2 = urlopen(url2)
    s2 = f2.read()
    parser2 = MyHTMLParser(flayer='kgs',fid=str(c.feature.id))
    parser2.feed(s2)
    pdfs = parser2.filesMatched

    url3 = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/bilder/meta.txt'
    f3 = urlopen(url3)
    s3 = f3.read()
    d = s3.split('\n')
    meta = []
%>
% for i in d:
<% e = i.split(';') %>
% if e[0] == parser.pattern and e[len(e)-1] not in meta:
<% meta.append(e[len(e)-1]) %>
% endif
% if e[0] == parser.pattern and e[len(e)-2] not in meta and len(e[len(e)-2]) != 0:
<% meta.append(e[len(e)-2]) %>
% endif
% endfor
<script type="text/javascript">
    var pictures, url, pdfs, url2, meta;
    pictures = ${parser.filesMatched};
    url = '${url}';
    pdfs = ${parser2.filesMatched};
    url2 = '${url2}';
    meta = ${meta};
    window.onload = function () {
% if len(parser.filesMatched) != 0:
        var div = document.getElementById('images');
        for (var n = 0; n < pictures.length; n++) {
            var title = '';
            var pic = pictures[n];
            var div_child = document.createElement('DIV');
            div_child.className = 'thumbnail';
            var a = document.createElement('A');
            a.className = 'lightbox';
            a.href = url + pic;
            for (var m = 0; m < meta.length; m++) {
                 title = title + meta[m].replace("/","");
            }
            a.title = title;
            var img = document.createElement('IMG');
            img.width = 100;
            img.src = url + pic;
            a.appendChild(img);
            div_child.appendChild(a);
            div.appendChild(div_child);
        }
        Ext.ux.Lightbox.register('a.lightbox', true);
% endif
        var a = document.getElementById('pdf');
        if (pdfs.length !== 0) {
            a.href = url2 + pdfs[0];
        } else {
            a.innerHTML = '-';
        }
    var disclamer = document.getElementsByClassName('disclamer')[0];
    disclamer.setAttribute("href","http://www.disclamer.admin.ch")
    }
</script>
</%def>
