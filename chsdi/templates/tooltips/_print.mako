# -*- coding: utf-8 -*-
<html xmlns="http://www.w3.org/1999/xhtml" lang="${c.lang}" xml:lang="${c.lang}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="content-language" content="${c.lang}" />
  <meta name="revisit-after" content="7 days" />
  <meta name="robots" content="index,follow " />

  <link rel="stylesheet" type="text/css" href="${h.url_for('/mfbase/ext/resources/css/ext-all.css')}"/>
  <link rel="stylesheet" type="text/css" href="${h.url_for('/mfbase/ext/resources/css/xtheme-gray.css')}"/>
  <link rel="stylesheet" type="text/css" href="${h.url_for('/MapFishApi/css/api.css')}"/>
  <link rel="stylesheet" type="text/css" href="${h.url_for('/css/geoadmin.css')}"/>
  <link rel="stylesheet" type="text/css" href="${h.url_for('/geoadminApi/css/api.css')}"/>
  <link rel="stylesheet" type="text/css" href="${h.url_for('/mfbase/geoext/resources/css/gxtheme-gray.css')}"/>

  <script type="text/javascript">
      function init() {
          window.print();
      }
  </script>
</head>
<body onload="init()" class="x-window-mc" style="background-color: white">
% for feature in c.features:
  <div style="border: 1px solid #ddd">${feature.html.decode('utf-8')}</div>
% endfor
</body>
