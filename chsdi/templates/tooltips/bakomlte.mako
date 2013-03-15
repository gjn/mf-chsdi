<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
       % if c.feature.powercode =='P1':
           <tr><td width="150" valign="top">${_('tt_ch.bakom.leistung')}</td><td>${_('tt_bakom_veryweak')}</td></tr>
       % elif c.feature.powercode =='P2':
           <tr><td width="150" valign="top">${_('tt_ch.bakom.leistung')}</td><td>${_('tt_bakom_weak')}</td></tr>
       % elif c.feature.powercode =='P3':
           <tr><td width="150" valign="top">${_('tt_ch.bakom.leistung')}</td><td>${_('tt_bakom_middle')}</td></tr>
       % else:
           <tr><td width="150" valign="top">${_('tt_ch.bakom.leistung')}</td><td>${_('tt_bakom_strong')}</td></tr>
       % endif
</%def>
