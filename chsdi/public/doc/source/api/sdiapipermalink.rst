API Permalink
=============



===================            ==========================================================    =========================================================
Parameter                      Description                                                    Example
===================            ==========================================================    =========================================================
lang                           Language of the interface: de, fr, it, rm and en              http://map.geo.admin.ch?lang=rm
zoom                           Zoom level, from 0 to 14                                      http://map.geo.admin.ch?zomm=12
scale                          Scale                                                         http://map.geo.admin.ch?scale=100000
y                              easting value (from 450'000 to                                http://map.geo.admin.ch?y=600000
                               900'000)
x                              northing value, ranging from 50'000 to                        http://map.geo.admin.ch?x=150000
                               350'000 (always smaller than y)
bgOpacity                      Opacity of national map covering the                          http://map.geo.admin.ch?bgOpacity=20
                               underlaying image (0 to 100)
bgLayer                        Base layer: one of `ch.swisstopo.pixelkarte-farbe`,           http://map.geo.admin.ch?bgLayer=voidLayer
                               `ch.swisstopo.pixelkarte-farbe` or `voidLayer`
layers                         Layer to display, see :doc:`./sdiapilayerreference` for a     http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour
                               complete list
layers_opacity                 Layers opaciy, should match number of layers (0-1.0)          http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_opacity=0.5
layers_visibility              Toggle the visibility of layers present in the tree           http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_visibility=False
selectedNode                   Selected node in INSPIRE Catalog tree                         http://map.geo.admin.ch?selectedNode=LT2_3
<layer bod id>                 Layer bod id ( :doc:`./sdiapilayerreference`) from which
                               to hilight  feature(s) with id                                   http://map.geo.admin.ch?ch.bafu.bundesinventare-moorlandschaften=212,213
crosshair                      crosshair=<type>, possible type: cross, circle, bowl and
                               point                                                         http://map.geo.admin.ch?Y=538700&X=165890&zoom=6&crosshair=circle
===================            ==========================================================    =========================================================
