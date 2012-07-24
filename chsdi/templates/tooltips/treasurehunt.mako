<%inherit file="base.mako"/>
<%def name="preview()">
% if c.lang =='fr':
   ${c.feature.title_fr or '-'}
   % elif c.lang == 'it':
   ${c.feature.title_it or '-'}
   % else:
   ${c.feature.title_de or '-'}
% endif
</%def>
<%def name="table_body()">
<tr><td width="150">${_('title')}</td><td>${self.preview()}</td></tr>
% if c.feature.type_coord =='info':
	% if c.lang =='fr':
	<tr><td width="150" style="vertical-align: top;">${_('information')}</td><td>${c.feature.info_fr or '-'}</td></tr>
	% elif c.lang == 'it':
	<tr><td width="150" style="vertical-align: top;">${_('information')}</td><td>${c.feature.info_it or '-'}</td></tr>
	% else:
	<tr><td width="150" style="vertical-align: top;">${_('information')}</td><td>${c.feature.info_de or '-'}</td></tr>
	% endif
% else:
	% if c.lang =='fr':
	<tr><td width="150" style="vertical-align: top;">${_('link')}</td><td><span>Bravo! Clic ci-dessous sur </span><a href="${c.feature.link_fr or '-'}" target="_parent">${_('link')}</a><span> afin de découvrir l'indice suivant!</span></td></tr>
	% elif c.lang == 'it':
	<tr><td width="150" style="vertical-align: top;">${_('link')}</td><td><span>Bravo! Clicca sul <a href="${c.feature.link_it or '-'}" target="_parent">${_('link')}</a><span> qui sotto per trovare l'indizio successivo!</span></td></tr>
	% else:
	<tr><td width="150" style="vertical-align: top;">${_('link')}</td><td><span>Bravo! Klicke unten auf </span><a href="${c.feature.link_de or '-'}" target="_parent">${_('link')}</a><span> um den nächsten Hinweis zu erhalten!</span></td></tr>
	% endif
% endif
</%def>

