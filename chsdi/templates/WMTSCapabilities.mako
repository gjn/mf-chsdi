<?xml version="1.0" encoding="UTF-8"?>
<Capabilities xmlns="http://schemas.opengis.net/wmts/1.0" xmlns:ows="http://schemas.opengis.net/ows/1.1.0"
              xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xmlns:gml="http://www.opengis.net/gml"
              xsi:schemaLocation="http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
    <ows:ServiceIdentification>
        <ows:Title>GeoAdmin WMTS SAMPLE IMPLEMENTATION</ows:Title>
        <ows:Abstract>WMTS service for www.geo.admin.ch. NOT FOR PRODUCTION USE !
        </ows:Abstract>
        <ows:Keywords>
            <ows:Keyword>Switzerland</ows:Keyword>
            <ows:Keyword>www.geo.admin.ch</ows:Keyword>
        </ows:Keywords>
        <ows:ServiceType>OGC WMTS</ows:ServiceType>
        <ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
        <ows:Fees>Contact Swisstopo</ows:Fees>
        <ows:AccessConstraints>Contact Swisstopo</ows:AccessConstraints>
    </ows:ServiceIdentification>
    <ows:ServiceProvider>
        <ows:ProviderName>Swisstopo</ows:ProviderName>
        <ows:ProviderSite xlink:href="http://www.geo.admin.ch"/>
        <ows:ServiceContact>
            <ows:IndividualName>David Oesch</ows:IndividualName>
            <ows:PositionName>Senior Project Manager</ows:PositionName>
            <ows:ContactInfo>
                <ows:Address>
                    <ows:ElectronicMailAddress>david.oesch@swisstopo.com
                    </ows:ElectronicMailAddress>
                </ows:Address>
            </ows:ContactInfo>
        </ows:ServiceContact>
    </ows:ServiceProvider>
    <ows:OperationsMetadata>
        <ows:Operation name="GetCapabilities">
            <ows:DCP>
                <ows:HTTP>
                    <ows:Get
                            xlink:href="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/wmts">
                        <ows:Constraint name="GetEncoding">
                            <ows:AllowedValues>
                                <ows:Value>RESTful</ows:Value>
                            </ows:AllowedValues>
                        </ows:Constraint>
                    </ows:Get>
                </ows:HTTP>
            </ows:DCP>
        </ows:Operation>
        <ows:Operation name="GetTile">
            <ows:DCP>
                <ows:HTTP>
                    <ows:Get xlink:href="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/wmts">
                        <ows:Constraint name="GetEncoding">
                            <ows:AllowedValues>
                                <ows:Value>RESTful</ows:Value>
                            </ows:AllowedValues>
                        </ows:Constraint>
                    </ows:Get>
                </ows:HTTP>
            </ows:DCP>
        </ows:Operation>
    </ows:OperationsMetadata>
    <Contents>
        <Layer>
            <ows:Title>ch.swisstopo.pixelkarte-farbe</ows:Title>
            <ows:Abstract>
                Switzerland Pixel map
            </ows:Abstract>
            <Format>
                <MIME>image/jpeg</MIME>
                <FileExtension>jpeg</FileExtension>
            </Format>
            <InfoFormat>
                <MIME>image/xml</MIME>
                <FileExtension>xml</FileExtension>
            </InfoFormat>
            <TileMatrixSet>ch.swisstopo.pixelkarte-farbe</TileMatrixSet>
            <Style isDefault="true">
               <ows:Title>default</ows:Title>
               <ows:Identifier>null</ows:Identifier>
            </Style>
        </Layer>
        <TileMatrixSet>
            <ows:Identifier>ch.swisstopo.pixelkarte-farbe</ows:Identifier>
            <ows:SupportedCRS>urn:ogc:def:parameter:EPSG::21781</ows:SupportedCRS>
            <!-- resolutions: 4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5 -->
            <TileMatrix>
                <ows:Identifier>0</ows:Identifier>
                <ScaleDenominator>40000000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>1</ows:Identifier>
                <ScaleDenominator>37500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>2</ows:Identifier>
                <ScaleDenominator>35000000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>3</ows:Identifier>
                <ScaleDenominator>32500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>4</ows:Identifier>
                <ScaleDenominator>30000000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>5</ows:Identifier>
                <ScaleDenominator>27500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>6</ows:Identifier>
                <ScaleDenominator>25000000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>7</ows:Identifier>
                <ScaleDenominator>22500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>8</ows:Identifier>
                <ScaleDenominator>20000000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>9</ows:Identifier>
                <ScaleDenominator>17500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>10</ows:Identifier>
                <ScaleDenominator>15000000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>11</ows:Identifier>
                <ScaleDenominator>12500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>12</ows:Identifier>
                <ScaleDenominator>10000000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>2</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>13</ows:Identifier>
                <ScaleDenominator>7500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>3</MatrixWidth>
                <MatrixHeight>2</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>14</ows:Identifier>
                <ScaleDenominator>2500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>3</MatrixWidth>
                <MatrixHeight>2</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>15</ows:Identifier>
                <ScaleDenominator>1000000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>4</MatrixWidth>
                <MatrixHeight>3</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>16</ows:Identifier>
                <ScaleDenominator>500000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>8</MatrixWidth>
                <MatrixHeight>5</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>17</ows:Identifier>
                <ScaleDenominator>200000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>19</MatrixWidth>
                <MatrixHeight>13</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>18</ows:Identifier>
                <ScaleDenominator>100000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>38</MatrixWidth>
                <MatrixHeight>25</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>19</ows:Identifier>
                <ScaleDenominator>50000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>94</MatrixWidth>
                <MatrixHeight>63</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>20</ows:Identifier>
                <ScaleDenominator>25000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>188</MatrixWidth>
                <MatrixHeight>125</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>21</ows:Identifier>
                <ScaleDenominator>20000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>375</MatrixWidth>
                <MatrixHeight>250</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>22</ows:Identifier>
                <ScaleDenominator>10000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>750</MatrixWidth>
                <MatrixHeight>500</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>23</ows:Identifier>
                <ScaleDenominator>5000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>938</MatrixWidth>
                <MatrixHeight>625</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>24</ows:Identifier>
                <ScaleDenominator>4000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1280</MatrixWidth>
                <MatrixHeight>834</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>25</ows:Identifier>
                <ScaleDenominator>2500</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>1875</MatrixWidth>
                <MatrixHeight>1250</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>26</ows:Identifier>
                <ScaleDenominator>1000</ScaleDenominator>
                <!-- top left point of tile matrix bounding box -->
                <TopLeftCorner>420000 350000</TopLeftCorner>
                <!-- width and height of each tile in pixel units -->
                <TileWidth>256</TileWidth>
                <TileHeight>256</TileHeight>
                <!-- width and height of matrix in tile units -->
                <MatrixWidth>3750</MatrixWidth>
                <MatrixHeight>2500</MatrixHeight>
            </TileMatrix>
        </TileMatrixSet>
    </Contents>
</Capabilities>