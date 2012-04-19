
.. currentmodule:: GeoAdmin

:class:`GeoAdmin.Map`
================================================================================


.. cssclass:: meta


Extends
    * `OpenLayers.Map <http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html>`_
    





.. class:: Map(div, options)

:param div:    ``String`` The element where the map will be rendered (or the id for that element).
:param config: ``Object`` options (optional).


Valid properties for the options argument:
 * ``scale`` - ``Number`` : scaledenom of the map, e.g. 500000
 * ``doZoomToMaxExtent`` - ``Boolean``: zoom to the maximal extent of the map

:return: ``OpenLayers.Map``

Create an Openlayers.Map containing the GeoAdmin layer and configuration



Example Use
-----------

Sample code to create a map (see also `demo <http://api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples1.html>`_):

.. code-block:: javascript

   var map = new GeoAdmin.Map("mapdiv", {doZoomToMaxExtent: true});


    






Public Methods
--------------

Public methods in addition to those
listed for `OpenLayers.Map <http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html>`_.


.. method:: Map.addLayerByName

    :param layername: ``String`` Layer name id. The layer list can be found `there <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
    :param options: ``Object`` Layer options (optional)
    
    Add a layer overlay to the map.

.. method:: Map.attribution

    :return: ``String`` - List with data owner of layers displayed in the map.
    
    Return the layers attribution

.. method:: Map.destroy

    Destroy the map

.. method:: Map.getLayerByLayerName

    :param layername: ``String`` Layer name id. The layer list can be found `here <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
    
    :return: ``OpenLayers.Layer``
    
    Get a layer of the map by its name

.. method:: Map.switchComplementaryLayer

    :param layername: ``String`` Layer name id of the base layers. The complete layer list can be found `over there <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
    :param options: ``Object`` - Layer option (optional)
    
    :return:  ``OpenLayers:Layer``
    
    Switch the complementary layer.





