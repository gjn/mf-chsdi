API Widgets
===========

The philosophy of the `GeoExt UX <http://trac.geoext.org/wiki/ux>`_ has been followed in order to create the GeoAdmin widgets.

API Widgets Examples
--------------------

.. toctree::
    :maxdepth: 1

    sdiwidgetsexamples1
    sdiwidgetsexamples2
    sdiwidgetsexamples3
    sdiwidgetsaggregate
    sdiwidgettreepanel
    sdiwidgetlegendwindow
    sdiwidgetmeasure
.. The following lines are commented out
    sdiwidgetredlining
    sdiwidgetwmsbrowser
    sdiwidgetlayermanager
    sdiwidgetadvancedtools
    
API Widgets Description
-----------------------

Base Layer Tool
***************

The base layer tool allows the user to manage the base layer (swissimage, pixelmap and void).
It offers an opacity slider and the possibility to switch between pixelmaps and void layers.

See example: :ref:`base-layer-tool`.

BOD Search
**********

BOD (for Betriebsobjektdatenbank) Search is a combo box allowing the user to search within the layer offered by GeoAdmin API.

See example: :ref:`bod-search`

BOD Search Window
*****************

BOD (for Betriebsobjektdatenbank) Search Window is a tool to present the metadata information about a layer.

See example:  :ref:`bod-search-window`

Catalog Tree
************

This widget contains a tree structure according to INSPIRE with the available layers.

See example: :ref:`catalog-tree`

Custom Catalog Tree
*******************

This wiget structure and parametrization can be cutomized

See example: :ref:`custom-catalog-tree`

Context Popup
*************

This widget allows the user to right click in the map and get a popup with various information.

See example:  :ref:`context-popup`

Layer Tree
**********

This widget presents the layer visible in the map and offer various functions like: opacity management, visibility management, access to metadata and layer deletion.

See example: :ref:`layer-tree1`

TreePanel
*********

This is the classical layer tree widget, which allows the user to naviagte through the tree and to select/unselect layers.

See example: :ref:`treepanel`

Map
***

The map widget contains a map and all the layers of the Switzerland spatial data infrastructure.

See examples: :ref:`default-map` and :ref:`map-with-gray-pixelmap-and-overlay-layer`

Mouse Position
**************

The mouse position widget presents the position of the mouse.

See examples: :ref:`mouse-position`

Navigation History
******************

The navigation history widget stores the various state of the map and allows the user to come back to previous state.

See examples: :ref:`navigation-history`

Permalink
*********

The permalink widget allows the creation and usage of permalinks containing the state of the application. It's based on the ExtJS state manager.

See example:  :ref:`permalink`

Print
*****

The print widget allows the generation of PDF files containing the map information. This UX communicates with a MapFish print server. The MapFish print server of api.geo.admin.ch can be used but if you need a custom configuration, you'll have to setup your own server.

See examples:  :ref:`print`

Swiss Search
************

SwissSearch is a combo box allowing the user to search within various data sources:  SwissNames, Postal Code, Cities, Canton and also coordinates (CH1903 and WGS84).

See example: :ref:`swiss-search`

Tooltip (depracated)
********************

This widget allows the user to click in the map and get a tooltip of the selected features.

See example: :ref:`tooltip`

ExtendedTooltip
***************

This widget allows the user to click in the map and get a tooltip of the selected features. A selection by rectangle is also possible to allow the user to interact with the selected features.

See examples: :ref:`extended_tooltip`
See examples: :ref:`extended_tooltip_box`

LegendWindow
************

This widget display the legend of all activelayers in a new windows.

See example:  :ref:`legendwindow`

Measure
*******
  
This widget allows you to measure distances, surfaces and azimuth on the map.
   
See example:  :ref:`measuresection`

..  Commented out until the end
    WmsBrowser
    **********
    
    This widget allows you to add any layer from any WMS Service.
    
    See example:  :ref:`wmsbrowser`
    
    LayerManager
    ************
    
    This widget allows you to import vector files from various format (currently KML, GeoJSON, GeoRSS and GML).
    
    See example:  :ref:`layermanager`
    
    Redlining
    ************
    
    This widget allows you to draw point, line and polygon feature on the map.
    
    See example:  :ref:`redlining`
    
    Measure
    *******
    
    This widget allows you to measure distances and surfaces on the map.
    
    See example:  :ref:`measure`
    
    AdvancedFunctions
    *****************
    
    This widget windows is a container to regroup some more advanced functionalties you do not want to display in a toolbar.
    
    See example: 
