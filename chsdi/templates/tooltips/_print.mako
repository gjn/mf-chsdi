# -*- coding: utf-8 -*-
<html xmlns="http://www.w3.org/1999/xhtml" lang="${c.lang}" xml:lang="${c.lang}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="content-language" content="${c.lang}" />
  <meta name="revisit-after" content="7 days" />
  <meta name="robots" content="index,follow " />
  <style type="text/css">
    <%include file="../../public/build/api.css" />
  </style>

  <script type="text/javascript">
      function init() {
          window.print();
      }
  </script>
</head>
<body onload="init()" class="x-window-mc" style="background-color: white">
% for feature in c.features:
  <div style="border: 1px solid #ddd">${feature.html}</div>
% endfor
</body>
