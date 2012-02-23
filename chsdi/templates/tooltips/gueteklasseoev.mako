<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('klasse')}</td>
      % if c.lang == 'de':
           <td>${c.feature.klasse_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.klasse_fr or '-'}</td>
      % endif
    </tr>
</%def>

<%def name="table_body()">
     ${self.preview()}
</%def>
