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

API Tutorial
============

Disclaimer. The following documentation ist only for the swiss federal administration.

Create a basic HTML page
------------------------

This is a step by step example showing you how to add an interractive map to your web page. The final result will be like this:

.. raw:: html

   <body>
      <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef1" href="javascript:showdiv('codeBlock1','showRef1','hideRef1')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef1" href="javascript:hidediv('codeBlock1','showRef1','hideRef1')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock1" style="margin:10px !important;">





.. code-block:: html 
    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>My very first GeoAdmin Map</title>
        </head>
        <body>
        </body>
    </html>

Inlcude the API loader. This will load the whole Javascript and CSS to run your map

.. code-block:: html
        
        <body>
           <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script></body>
        </body>
 


Create a simple javascript function initilizing a map

.. code-block:: html

    <script type="text/javascript">
        function init() {
            var geo = new GeoAdmin.API();
            geo.createMap({
                div: "mymap1",
                easting: 720000,
                northing: 90000,
                zoom: 5
            });
        }
    </script>



Do no not forget to add a <div> to receive you map

.. code-block:: html
      
     <body>
        <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
        <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script></body>
    </body>

And launch the `init()` function at load time:

.. code-block:: html

    <body onload="init();">



Final HTML doc

.. code-block:: html
    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>My very fist GeoAdmin API Map</title>
            <script type="text/javascript">
                function init() {
                    var geo = new GeoAdmin.API();
                    geo.createMap({
                        div: "mymap1",
                        easting: 720000,
                        northing: 90000,
                        zoom: 5
                    });
                }
            </script>
        </head>
        <body onload="init();">
            <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
            <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script></body>
        </body>
    </html>


.. raw:: html

    </div> 

Instruction for Day Communiqué
------------------------------

If your are using Day Communiqué to manage the Website of your office, this is how to create a basic map



.. raw:: html

   <script type="text/javascript">
       function init() {
                    var geo = new GeoAdmin.API();
                    geo.createMap({
                        div: "mymap1",
                        easting: 720000,
                        northing: 95000,
                        zoom: 5
                    });
       }

   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
