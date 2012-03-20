<%inherit file="base.mako"/>

<%def name="preview()">   
      % if c.lang == 'de':
           ${c.feature.klasse_de or '-'}
      % elif c.lang == 'fr':
           ${c.feature.klasse_fr or '-'}
      % endif
</%def>

<%def name="table_body()">
     <tr><td width="150">${_('klasse')}</td><td>${self.preview()}</td></tr>
</%def>
