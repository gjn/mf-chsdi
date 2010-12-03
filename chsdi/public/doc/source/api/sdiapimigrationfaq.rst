API Migration FAQ
&&&&&&&&&&&&&&&&&

Where is the API located ?
--------------------------

The API and the CSS are now loaded with the http://api.geo.admin.ch/loader.js script. Contrary to V1, you don't need to add other script tag to load the css, for example:

.. code-block:: html

   <body>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>


What are the new permalink parameters ?
----------------------------------------

Some parameter names have change between version 1 and version 2 of the API. These are:

=====================        =====================            =====================
Parameters v1                Parameter v2                     Explanantion   
=====================        =====================            =====================
X                            y                                `easting`, between 450'000 and 850'000 (geodetic name)
Y                            x                                `northing`, between 50'000 and 350'000 (geodetic name)
=====================        =====================            =====================
