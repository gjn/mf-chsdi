<%inherit file="base.mako"/>

<%def name="preview()"></%def>



<%def name="table_body()">
    <% c.stable_id = False %>
    % if c.feature.kanton == 'AG':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://www.ag.ch/geoportal/agisviewer/viewer.aspx?PageWidth=1000&PageHeight=700&map=va_avdaten&Benutzergruppe=3&xmin=${c.extent.bounds[0]}&ymin=${c.extent.bounds[1]}&xmax=${c.extent.bounds[2]}&ymax=${c.extent.bounds[3]}" target="_blank">AG</a></td></tr>
    % elif c.feature.kanton == 'BS':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://www.stadtplan.bs.ch/geoviewer/index.php?theme=258&extent=${','.join(map(str,c.extent.bounds))}&layers=parzplan_vektor_grau_1000,av_parzellen_labels" target="_blank">BS</a></td></tr>
    % elif c.feature.kanton == 'BE':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://webmap.be-geo.ch/geodaten.php?lang=${c.lang}&recenter_bbox=${','.join(map(str,c.extent.bounds))}" target="_blank">BE</a></td></tr>
    % elif c.feature.kanton == 'FR':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://www.geo.fr.ch/index.php?reset_session&linkit=1&switch_id=switch_localisation&layer_select=Adresses,ParcVect,ParcVectnum,GrpMasque,GrpSituation,FondPlanContinu,copyright,Parcellaire,ParcScan&mapsize=0&recenter_bbox=${','.join(map(str,c.extent.bounds))}" target="_blank">FR</a></td></tr>
    % elif c.feature.kanton == 'GE':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://etat.geneve.ch/geoportail/monsitg/?X=${c.extent.centroid.x + 2000000}&Y=${c.extent.centroid.y + 1000000}&SCALE=${c.scale}" target="_blank">GE</a></td></tr>
    % elif c.feature.kanton == 'GL':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://geo.gl.ch/maps/Public?visibleLayers=MOpublic" target="_blank">GL</a></td></tr>
    % elif c.feature.kanton == 'JU':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://sitn.ne.ch/jura.php?Y=${c.extent.centroid.y}&X=${c.extent.centroid.x}&echelle=${c.scale}&theme=cadastre" target="_blank">JU</a></td></tr>
    % elif c.feature.kanton == 'SG':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://schnittstelle.geoportal.ch/aufruf.aspx?VERSION=1.0&REQUEST=GetIGis&MAP=&WIDTH=600&TOPIC=Coord&ATTRIBUTE1=${c.extent.centroid.x}&ATTRIBUTE2=${c.extent.centroid.y}" target="_blank">SG</a></td></tr>
    % elif c.feature.kanton == 'SH':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://www.gis.sh.ch/GIS_SH_Beta/?idp=1&uid=1&pwd=&map=10&lan=de&typ=3&bmurl=Nav@g@98@u@West@g@${c.extent.centroid.x}@u@Nord@g@${c.extent.centroid.y}@u@B@g@600" target="_blank">SH</a></td></tr>
    % elif c.feature.kanton == 'SZ':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://webmap.sz.ch/bm31_webmap/?idp=1&uid=3&bmurl=Nav@g@129@u@West@g@${c.extent.centroid.x}@u@Nord@g@${c.extent.centroid.y}@u@B@g@${c.scale}" target="_blank">SZ</a></td></tr>
    % elif c.feature.kanton == 'SO':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://www.sogis1.so.ch/sogis/internet/pmapper/somap.php?karte=ortsplan&extent=${','.join(map(str,c.extent.bounds))}" target="_blank">SO</a></td></tr>
    % elif c.feature.kanton == 'TI':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://www.sitinfo.ti.ch/WebsiteProd/htmlviewer/mu93pubblicoe?Box=${':'.join(map(str,c.extent.bounds))}" target="_blank">TI</a></td></tr>
    % elif c.feature.kanton == 'VD':
        <tr><td width="150">${_('link to canton geoportal')}</td><td><a href="http://www.geoplanet.vd.ch/index.php?reset_session&linkit=1&switch_id=switch_cadastre&layer_select=complement_vd2,fond_continu_gris,canton_select,gc_mensuration_select,cad_parv_select,cad_parv_numero_select,ddp_select,ddp_npcs_select,cad_parv_plim_select,cad_bat_hs_cadastre_select,cad_bat_ss_select,npcs_bat_hs_select,npcs_bat_ss_select,couverture_sol,cad_cs_dur,cad_cs_vert,cad_cs_bois,cad_cs_eau,cad_cs_div&recenter_bbox=${','.join(map(str,c.extent.bounds))}&mapSize=1">VD</a></td></tr>
    % else:
        <tr><td width="150">${_('link to canton geoportal')}</td><td>${_('Canton has provided no link to portal')}</td></tr>
    % endif
</%def>
