.. raw:: html

   <script language=javascript type='text/javascript'>

   function hidediv(div, showDiv, hideDiv) {
      document.getElementById(div).style.visibility = 'hidden';
      document.getElementById(div).style.display = 'none';
      document.getElementById(hideDiv).style.visibility = 'hidden';
      document.getElementById(hideDiv).style.display = 'none';
      document.getElementById(showDiv).style.visibility = 'visible';
      document.getElementById(showDiv).style.display = 'block';
   }

   function showdiv(div, showDiv, hideDiv) {
      document.getElementById(div).style.visibility = 'visible';
      document.getElementById(div).style.display = 'block';
      document.getElementById(showDiv).style.visibility = 'hidden';
      document.getElementById(showDiv).style.display = 'none';
      document.getElementById(hideDiv).style.visibility = 'visible';
      document.getElementById(hideDiv).style.display = 'block';
   }
   </script>


Print with Proxy
----------------

If you want to generate a PDF from your application developped with the API, you need to setup a proxy in your environment.
This proxy will redirect the requests to the print server provided by api.geo.admin.ch

.. raw:: html

   <body>
      <div id="mymap22" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myprint22" style="width: 200px; margin-left: 10px; margin-top: 20px;"></div>
   </body>

.. raw:: html

    <a id="showRef22" href="javascript:showdiv('codeBlock22','showRef22','hideRef22')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef22" href="javascript:hidediv('codeBlock22','showRef22','hideRe22')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock22" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
           api22 = new GeoAdmin.API();
           api22.createMapPanel({
               height: 350,
               renderTo: "mymap22",
               bbar: new Ext.Toolbar()
           });
           api22.mapPanel.getBottomToolbar().add([
               api22.createPrint({
                   text: OpenLayers.i18n('print map (popup)'),
                   printBaseUrl: '/apiprintproxy?path=',
                   printPanelOptions: {
                      mapPanel: api22.mapPanel
                   },
                   windowOptions: {
                      title: OpenLayers.i18n('print')
                   }
               })
           ]);
      }
   </script>
   <body onload="init();">
      <div id="mymap22" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

Proxy Setup
-----------

As example, we provide here the code of a `MapFish <http://www.mapfish.org>`_ controller that can be used as proxy. The important thing is to redirect the cookies, since the print is not stateless.

.. code-block:: python

  import logging
  import httplib2

  from pylons import request, response
  from pylons.controllers.util import abort

  from chsdi.lib.base import BaseController

  log = logging.getLogger(__name__)

  class ApiprintproxyController(BaseController):

    def index(self):

        url_scheme = request.environ["wsgi.url_scheme"]
        if url_scheme not in ("http", "https"):
            abort(403) # Forbidden

        if "url" in request.params:
            url = request.params["url"]

        printpath = request.params["path"]

        # get method
        method = request.method

        # get body
        body = None
        if method in ("POST", "PUT"):
            body = request.body

        # forward request to target (without Host Header)
        http = httplib2.Http()
        h = dict(request.headers)
        h.pop("Host", h)

        try:
            if "url" in request.params:
                resp, content = http.request("http://api.geo.admin.ch/main/wsgi/print/" + str(printpath) + "?url=" + url, method=method, body=body, headers=h)
            else:
                resp, content = http.request("http://api.geo.admin.ch/main/wsgi/print/" + str(printpath), method=method, body=body, headers=h)
        except:
            abort(502) # Bad Gateway

        if resp.has_key("content-type"):
            response.headers["Content-Type"] = resp["content-type"]
        if resp.has_key("set-cookie"):
            response.headers["set-cookie"] = resp["set-cookie"]
        if resp.has_key("Cookie"):
            response.headers["Cookie"] = resp["Cookie"]
        if resp.has_key("Content-Disposition"):
            response.headers["Content-Disposition"] = resp["Content-Disposition"]
        if resp.has_key("content-disposition"):
            response.headers["Content-Disposition"] = resp["content-disposition"]

        response.status = resp.status

        return content


.. raw:: html

   <script type="text/javascript">
      function init() {
           api22 = new GeoAdmin.API();
           api22.createMapPanel({
               height: 350,
               renderTo: "mymap22",
               bbar: new Ext.Toolbar()
           });
           api22.mapPanel.getBottomToolbar().add([
               api22.createPrint({
                   text: OpenLayers.i18n('print map (popup)'),
                   printBaseUrl: '../../../apiprintproxy?path=',
                   printPanelOptions: {
                      mapPanel: api22.mapPanel
                   },
                   windowOptions: {
                      title: OpenLayers.i18n('print')
                   }
               })
           ]);
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
