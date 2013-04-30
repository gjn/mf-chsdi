<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.nr or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_ch.bafu.fauna-wildtierkorridor_national_nr')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_ch.bafu.fauna-wildtierkorridor_national_zustand')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.zusta_dt or '-'}</td>
      % elif c.lang == 'fr' or c.lang == 'it':
           <td>${c.feature.zusta_fr or '-'}</td>
      % endif
    </tr>
</%def>
