API Migration FAQ
&&&&&&&&&&&&&&&&&

Where is the API located ?
--------------------------

The API and the CSS are now loaded with the http://api.geo.admin.ch/loader.js script. Contrary to V1, you don't need to add other script tag to load the css, for example:

.. code-block:: html

   <body>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>
