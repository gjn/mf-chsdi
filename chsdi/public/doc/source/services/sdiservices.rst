Services
========

SwissSearch
-----------

Swisssearch allows the user to search for swiss locations, like postcode, cantons, cities and swissnames

URL
^^^

http://sdi.geo.admin.ch/swisssearch

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- lang: optional lang: de (default) or fr
- query: the query string to find

The service returns a maximum of 50 results.

Example: http://sdi.geo.admin.ch/swisssearch?lang=fr&query=lausanne

Result
^^^^^^

A JSON content is sent back with the following content:

- service: the name of the service. It can be postalcodes, cantons, cities or swissnames
- listlabel: html content presented in the Swissearch widget
- rank: rank of the result, form 1 to 4. 1 for postalcodes, 2 for cantons, 3 for cities and 4 for swissnames
- label: raw information stored in the database
- bbox: array with bottom right and top lef coordinate, for example: [509317.96875, 160040.0, 516755.0, 171050.0]
- id: id of the feature in the database
- objectorig: optional: origin of the data in swissnames dataset. See http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/toponymy.html

BodSearch
---------

This service allows to query all layers present in geoadmin for a certain expression present in their title and description.

URL
^^^

http://sdi.geo.admin.ch/bodsearch/search

Input parameters
^^^^^^^^^^^^^^^^ 

The following parameters are required:

- lang (optional): de (default) or fr (there is no description of layers in other language available in geoadmin for now)
- query: the query string
- cb (optional): the name of the callback funtion

Example: http://sdi.geo.admin.ch/bodsearch/search?lang=de&query=moor

Result
^^^^^^

A JSON 

- id: the BOD Id of the layer
- datenherr: the owner of the data, in full text
- label: the short title of the data
- content: an HTML description of the data, where the searched keyword are highlighted


BodSearch: detailed view
------------------------

This service display detailed informations on a layer, including a detailed description, a legend and various links to additional informations.

URL
^^^

http://sdi.geo.admin.ch/bodsearch/details/[bod id]

Input parameters
^^^^^^^^^^^^^^^^

The following input parameters are required:

- lang (optional): de (default) or fr
- baseUrl (optional): application base url
- print (optional): force window to print

Result
^^^^^^

A HTML document

Example: http://sdi.geo.admin.ch/bodsearch/details/ch.bafu.bundesinventare-moorlandschaften?lang=it&baseUrl=http://map.geo.admin.ch/
