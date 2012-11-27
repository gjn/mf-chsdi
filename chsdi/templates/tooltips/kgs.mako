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

% if c.last == True:
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
    table {
        border: 1px solid black; 
    }
    #ux-lightbox-overlay {
        height: 5000px !important;
    }
    @media print {
        table {
            border: none;
        }
    }
</style>
<div id="main_div" style="height: auto;">
% else:
<div id="main_div" style="height: auto; page-break-after: always;">
% endif

<% objektart = c.feature.objektart.split(',') %>
% if c.last == True:
<table border="0" cellspacing="15" cellpadding="15" width="100%" style="font-size: 100%; margin-bottom: 10px;" padding="1 1 1 1">
% else:
<table border="0" cellspacing="15" cellpadding="15" width="100%" style="font-size: 100%;" padding="1 1 1 1">
% endif
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 14px; vertical-align: top; color: #660099;">${_('name')}:</td>
         <td style="width: 300px; font-weight: bold; float: left; color: #660099; font-size: 14px;">${c.feature.zkob or '-'}</td>
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
         <td style="width: 300px; float: left; text-align: justify;"><div style="margin-left: -309px;">${c.feature.kurztexte or ''}</div></td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;"></td>
         <td style="width: 300px; float: left;"><div style="margin-left: -313px;" class="images" id="${c.feature.id}"></div></td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('Feature tooltip')}:</td>
         <td style="width: 300px; float: left;"><a class="pdf" id="${c.feature.id}">PDF</a></td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('official object webpage')}:</td>
         <td style="width: 300px; float: left;"><a href="${c.feature.link_uri or ''}">${c.feature.link_title or ''}</a></td>
     </tr>
     <tr>
         <td><a href="http://kgs.admin.ch/kgs_inventar/statistik.pdf">${_('tt_kbs_statistik')}</a></td>
     </tr>
</table>

% if c.first == True:
<% 
    c.fid_list = []
    c.fid_list.append(str(c.feature.id))
%>
% else:
<% 
    c.fid_list.append(str(c.feature.id))
%>
% endif

% if c.last == True:
<%
    import json 
    from urllib2 import urlopen
    from chsdi.lib.helpers import MyHTMLParser
    
    url = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/bilder/'
    f = urlopen(url)
    s = f.read()
    
    url2 = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/matrizen/'
    f2 = urlopen(url2)
    s2 = f2.read()
    
    url3 = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/bilder/meta.txt'
    f3 = urlopen(url3)
    s3 = f3.read()
    d = s3.split('\n')
    
    hpictures = {}
    hpdfs = {}
    hmeta = {}
    for fid in c.fid_list:
        parser = MyHTMLParser(flayer='kgs',fid=str(fid))
        parser2 = MyHTMLParser(flayer='kgs',fid=str(fid))
        parser.feed(s)
        parser2.feed(s2)
        meta = list()
        for i in d:
            e = i.split(';')
            if e[0] == parser.pattern and e[len(e)-1] not in meta:
                meta.append(e[len(e)-1])
            endif
            if e[0] == parser.pattern and e[len(e)-2] not in meta and len(e[len(e)-2]) != 0:
                meta.append(e[len(e)-2])
            endif
        hpictures[str(fid)] = parser.filesMatched
        hpdfs[str(fid)] = parser2.filesMatched
        hmeta[str(fid)] = meta        
        endfor
    endfor
    hpictures = json.dumps(hpictures)
    hpdfs = json.dumps(hpdfs)
    hmeta = json.dumps(hmeta)
%>


<script type="text/javascript">
    var hpictures = ${hpictures};
    var hpdfs = ${hpdfs};
    var hmeta = ${hmeta};
    var url = '${url}';
    var url2 = '${url2}';
    window.onload = function () {
        var idivs = document.querySelectorAll('.images');
        for (var i=0; i<idivs.length; i++){
            var div = idivs[i];
            var fid = div.id;

            var pictures = hpictures[fid];
            if (pictures.length > 0){
                var pictures = hpictures[fid];
                var pdfs = hpdfs[fid];
                var meta = hmeta[fid];
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
            }
        }
        var aels = document.querySelectorAll('.pdf');
        for (var i=0; i<aels.length; i++){
            var a = aels[i];
            var fid = a.id;
            var pdfs = hpdfs[fid];
            if (pdfs.length !== 0) {
                a.href = url2 + pdfs[0];
            } else {
                a.innerHTML = '-';
            }
        }
    var disclamer = document.querySelector('.disclamer');
    disclamer.setAttribute("href","http://www.disclamer.admin.ch")
    }
</script>
% endif
</div>
</%def>
