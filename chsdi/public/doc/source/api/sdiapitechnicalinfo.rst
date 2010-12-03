Technical informations
======================

Specifications for the tile storage system (TMS and WMS-C):  `TileCache <http://www.tilecache.org>`_

**Resolution** (meters): 4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,
50,20,10,5,2.5,2,1.5,1,0.5

**Maximum extent**: 420000,30000,900000,350000

**Coordinate system**: EPSG:21781

The resolution is the size of one pixel in the reality. So 5 means, one pixel is 5 meters wide and height, or a 256x256 pixels tile is 1280x1280 meters big.


====================        ==================         ======================        =====================
Resolution (meters)         Server zoom level          Map zoom level                Scale (at 256 dpi)
====================        ==================         ======================        =====================
4000                        0       
3750                        1       
3500                        2       
3250                        3       
3000                        4       
2750                        5       
2500                        6       
2250                        7       
2000                        8       
1750                        9       
1500                        10      
1250                        11      
1000                        12      
750                         13      
650                         14                          0                            6'500'000
500                         15                          1                            5'000'000
250                         16                          2                            2'500'000
100                         17                          3                            1'000'000
50                          18                          4                            500'000
20                          19                          5                            200'000
10                          20                          6                            100'000
5                           21                          7                            50'000
2.5                         22                          8                            25'000
2                           23                          9                            20'000
1.5                         24                          not used for now             not used for now
1                           25                          10                           10'000
0.5                         26                          11                           5'000
====================        ==================         ======================        =====================

