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

This step by step tutorial will show you how to add a map in any map page in 2 minutes.

1. Final result
---------------

At the end of this tutorial you will have a map like this in you browser.

.. raw:: html

   <body>
      <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef1" href="javascript:showdiv('codeBlock1','showRef1','hideRef1')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef1" href="javascript:hidediv('codeBlock1','showRef1','hideRef1')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock1" style="margin:10px !important;">



2. Create an empty HTML page
----------------------------

Create an empty web page  `map.html` and place it in your localhost developpement environnement. Check that you can call it with http://localhost/map.html

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

3. Add the API loader
---------------------

Add a script tag to load the API at the end of your web page. This script will load all the necessary JavaScript code and CSS to run the map.

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
        

4. Create a simple javascript function initilizing a map
--------------------------------------------------------


In the header section of your HTML page, create a small Javascript function creating a small map.

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

In the body section of your web page, add a `<div>` with `id="mymap1"`  where the map will be rendered. 



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
      

6. Initialise the map
---------------------

And finally, tell the web page to execute the javascript function you defined, adding  `onload="init()"` to the body tag:


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

And test it in your web browser:  `http://localhost/map.html <../_static/map.html>`_




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
