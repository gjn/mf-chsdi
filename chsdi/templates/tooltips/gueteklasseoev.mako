<%inherit file="base.mako"/>

<%def name="preview()">   
      % if c.lang == 'de' or c.lang == 'en' or c.lang == 'rm':
           ${c.feature.klasse_de or '-'}
      % elif c.lang == 'fr' or c.lang == 'it':
           ${c.feature.klasse_fr or '-'}
      % endif
</%def>

<%def name="table_body()">
     <tr><td width="150">${_('klasse')}</td><td>${self.preview()}</td></tr>
</%def>
