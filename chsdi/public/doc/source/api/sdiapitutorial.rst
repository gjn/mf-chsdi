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

This step by step tutorial will show you how to add a map in any web page in 2 minutes.

1. Final result
---------------

At the end of this tutorial you will have a map like this in you browser.

.. raw:: html

   <body>
      <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

2. Create an empty HTML page
----------------------------

Create an empty web page `map.html` and place it in your localhost developpement environnement. Check that you can call it with http://localhost/map.html.

.. code-block:: html 
    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>My very first GeoAdmin Map</title>
        </head>
        <body>
         <h1>This is my very first map</h1>
        </body>
    </html>

3. Add the GeoAdmin API loader
------------------------------

Add a script tag to load the API. This script will load all the necessary JavaScript and CSS code to create the map.

.. code-block:: html

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>My very first GeoAdmin Map</title>
        </head>
        <body>
             <h1>This is my very first map</h1>
            <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script></body>
        </body>
    </html>
        

4. Create a JavaScript function initializing a map
--------------------------------------------------

In the header section of your HTML page, place a JavaScript function which creates one map.

.. code-block:: html

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>My very first GeoAdmin Map</title>
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
        <body>
            <h1>This is my very first map</h1>
            <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script></body>
        </body>
    </html>

5. Add a <div> where the map will be displayed
----------------------------------------------

In the body section of your web page, add a `<div>` with `id="mymap1"`. The map will be rendered within the div.

.. code-block:: html

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>My very first GeoAdmin Map</title>
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
     <body>
        <h1>This is my very first map</h1>
        <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
        <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script></body>
    </body>
    </html>
      

6. Initialize the map
---------------------

And finally, tell the web page to execute the JavaScript function you defined by adding `onload="init()"` in the body tag:

.. code-block:: html

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>My very first GeoAdmin Map</title>
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
        <h1>This is my very first map</h1>
        <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
        <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script></body>
    </body>
    </html>

7. Test it
----------

And test it in your web browser: `http://localhost/map.html <../_static/map.html>`_

8. What are the next steps ?
----------------------------

You can have a look at the :doc:`sdiapiexamples`,  explore the :doc:`sdiapidoc` or experiment with the fantastic :doc:`sdiapigenerator`.  

.. raw:: html

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

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
