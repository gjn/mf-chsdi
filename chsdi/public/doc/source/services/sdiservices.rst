Services
========

Services description
********************

Swisssearch
-----------

Swisssearch allows the user to search for swiss locations, like postcode, cantons, cities and swissnames

Services usage
**************

Swissearch
----------

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
