<?xml version="1.0" encoding="UTF-8"?>
<!-- This is an example of a GetCapabilities response that declares 
	RESTful support for requesting tiles and FeatureInfo documents -->
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
	<ows:ServiceIdentification>
		<ows:Title>Federal Geodata Infrastructure of Switzerland</ows:Title>
		<ows:Abstract>Some Geodata are subject to license and fees</ows:Abstract>
		<!-- Revision: $Rev$ -->
		<ows:Keywords>
			<ows:Keyword>FGDI</ows:Keyword>
			<ows:Keyword>Pixelkarte</ows:Keyword>
			<ows:Keyword>Switzerland</ows:Keyword>
		</ows:Keywords>
		<ows:ServiceType>OGC WMTS</ows:ServiceType>
		<ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
		<ows:Fees>yes</ows:Fees>
		<ows:AccessConstraints>license</ows:AccessConstraints>
	</ows:ServiceIdentification>
	<ows:ServiceProvider>
		<ows:ProviderName>swisstopo</ows:ProviderName>
		<ows:ProviderSite xlink:href="http://www.swisstopo.admin.ch"/>
		<ows:ServiceContact>
			<ows:IndividualName>Marc</ows:IndividualName>
			<ows:PositionName>Senior Software Engineer</ows:PositionName>
			<ows:ContactInfo>
				<ows:Phone>
					<ows:Voice>+41</ows:Voice>
					<ows:Facsimile>+41</ows:Facsimile>
				</ows:Phone>
				<ows:Address>
					<ows:DeliveryPoint>swisstopo</ows:DeliveryPoint>
					<ows:City>Bern</ows:City>
					<ows:AdministrativeArea>BE</ows:AdministrativeArea>
					<ows:PostalCode>3084</ows:PostalCode>
					<ows:Country>Switzerland</ows:Country>
					<ows:ElectronicMailAddress/>
				</ows:Address>
			</ows:ContactInfo>
		</ows:ServiceContact>
	</ows:ServiceProvider>
	<ows:OperationsMetadata>
		<ows:Operation name="GetCapabilities">
			<ows:DCP>
				<ows:HTTP>
					<ows:Get xlink:href="http://www.opengis.uab.es/cgi-bin/world/MiraMon5_0.cgi?">
						<ows:Constraint name="GetEncoding">
							<ows:AllowedValues>
								<ows:Value>KVP</ows:Value>
							</ows:AllowedValues>
						</ows:Constraint>
					</ows:Get>
				</ows:HTTP>
			</ows:DCP>
		</ows:Operation>
		<ows:Operation name="GetTile">
			<ows:DCP>
				<ows:HTTP>
					<ows:Get xlink:href="http://wmts9.geo.admin.ch/wmts/">
						<ows:Constraint name="GetEncoding">
							<ows:AllowedValues>
								<ows:Value>KVP</ows:Value>
							</ows:AllowedValues>
						</ows:Constraint>
					</ows:Get>
				</ows:HTTP>
			</ows:DCP>
		</ows:Operation>
	</ows:OperationsMetadata>
	<Contents>
  ## Main loop
   % for layer in c.layers:
    <Layer>
			<ows:Title>${layer.kurzbezeichnung|x,trim}</ows:Title>
			<ows:Abstract>${layer.abstract|x,trim}</ows:Abstract>
			<ows:WGS84BoundingBox>
				<ows:LowerCorner>5.140242 45.398181</ows:LowerCorner>
				<ows:UpperCorner>11.47757 48.230651</ows:UpperCorner>
			</ows:WGS84BoundingBox>
			<ows:Identifier>${layer.id|x,trim}</ows:Identifier>
			<ows:Metadata xlink:href="http://www.swisstopo.admin.ch/SITiled/world/AdminBoundaries/metadata.htm"/>
			<Style>
				<ows:Title>${layer.kurzbezeichnung|x,trim}</ows:Title>
				<ows:Identifier>${layer.id|x,trim}</ows:Identifier>
			 <LegendURL format="image/png" xlink:href="http://api.geo.admin.ch/legend/${layer.id|x,trim}_${c.lang|x,trim}.png" />
			</Style>
			<Format>image/${str(layer.arr_all_formats).split(',')[0]}</Format>
			<Dimension>
				<ows:Identifier>Time</ows:Identifier>
				<Default>${str(layer.timestamp).split(',')[0]}</Default>
				<Value>${str(layer.timestamp).split(',')[0]}</Value>
			</Dimension>
			<TileMatrixSetLink>
				<!-- this is really not a smart name -->
				<TileMatrixSet>${str(layer.tile_matrix_set_id).split(',')[0]}</TileMatrixSet>
			</TileMatrixSetLink>
			<ResourceURL format="image/${str(layer.arr_all_formats).split(',')[0]}" resourceType="tile" template="http://wmts9.geo.admin.ch/wmts/1.0.0/${layer.id|x,trim}/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.${str(layer.arr_all_formats).split(',')[0]}"/>
      ## <ResourceURL format="application/gml+xml; version=3.1" resourceType="FeatureInfo" template="http://wmts9.geo.admin.ch/wmts/1.0.0/{Time}/${str(layer.tile_matrix_set_id).split(',')[0]}/{TileMatrix}/{TileRow}/{TileCol}/{J}/{I}.xml"/>
		</Layer>
  % endfor
  ## End main loop
    <TileMatrixSet>
			<ows:Identifier>21781</ows:Identifier>
			<ows:SupportedCRS>urn:ogc:def:crs:EPSG:21781</ows:SupportedCRS>
			<!-- ###### zoom 0, resolution 4000.0000, scale 14285714.2857 (tile matrix)
bottomleft (0, 0, 0), topright (0, 0, 0)
width=1, height=1, total=1  -->
			<TileMatrix>
				<ows:Identifier>0</ows:Identifier>
				<ScaleDenominator>14285714.2857</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>1</MatrixWidth>
				<MatrixHeight>1</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 1, resolution 3750.0000, scale 13392857.1429 (tile matrix)
bottomleft (0, 0, 1), topright (1, 0, 1)
width=2, height=1, total=2  -->
			<TileMatrix>
				<ows:Identifier>1</ows:Identifier>
				<ScaleDenominator>13392857.1429</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>1</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 2, resolution 3500.0000, scale 12500000.0000 (tile matrix)
bottomleft (0, 0, 2), topright (1, 0, 2)
width=2, height=1, total=2  -->
			<TileMatrix>
				<ows:Identifier>2</ows:Identifier>
				<ScaleDenominator>12500000.0</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>1</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 3, resolution 3250.0000, scale 11607142.8571 (tile matrix)
bottomleft (0, 0, 3), topright (1, 0, 3)
width=2, height=1, total=2  -->
			<TileMatrix>
				<ows:Identifier>3</ows:Identifier>
				<ScaleDenominator>11607142.8571</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>1</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 4, resolution 3000.0000, scale 10714285.7143 (tile matrix)
bottomleft (0, 0, 4), topright (1, 0, 4)
width=2, height=1, total=2  -->
			<TileMatrix>
				<ows:Identifier>4</ows:Identifier>
				<ScaleDenominator>10714285.7143</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>1</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 5, resolution 2750.0000, scale 9821428.5714 (tile matrix)
bottomleft (0, 0, 5), topright (1, 0, 5)
width=2, height=1, total=2  -->
			<TileMatrix>
				<ows:Identifier>5</ows:Identifier>
				<ScaleDenominator>9821428.57143</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>1</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 6, resolution 2500.0000, scale 8928571.4286 (tile matrix)
bottomleft (0, 0, 6), topright (1, 1, 6)
width=2, height=2, total=4  -->
			<TileMatrix>
				<ows:Identifier>6</ows:Identifier>
				<ScaleDenominator>8928571.42857</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>2</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 7, resolution 2250.0000, scale 8035714.2857 (tile matrix)
bottomleft (0, 0, 7), topright (1, 1, 7)
width=2, height=2, total=4  -->
			<TileMatrix>
				<ows:Identifier>7</ows:Identifier>
				<ScaleDenominator>8035714.28571</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>2</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 8, resolution 2000.0000, scale 7142857.1429 (tile matrix)
bottomleft (0, 0, 8), topright (1, 1, 8)
width=2, height=2, total=4  -->
			<TileMatrix>
				<ows:Identifier>8</ows:Identifier>
				<ScaleDenominator>7142857.14286</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>2</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 9, resolution 1750.0000, scale 6250000.0000 (tile matrix)
bottomleft (0, 0, 9), topright (1, 1, 9)
width=2, height=2, total=4  -->
			<TileMatrix>
				<ows:Identifier>9</ows:Identifier>
				<ScaleDenominator> 6250000.0000</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>2</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 10, resolution 1500.0000, scale 5357142.8571 (tile matrix)
bottomleft (0, 0, 10), topright (1, 1, 10)
width=2, height=2, total=4  -->
			<TileMatrix>
				<ows:Identifier>10</ows:Identifier>
				<ScaleDenominator>5357142.85714</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>2</MatrixWidth>
				<MatrixHeight>2</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 11, resolution 1250.0000, scale 4464285.7143 (tile matrix)
bottomleft (0, 0, 11), topright (2, 1, 11)
width=3, height=2, total=6  -->
			<TileMatrix>
				<ows:Identifier>11</ows:Identifier>
				<ScaleDenominator>4464285.71429</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>3</MatrixWidth>
				<MatrixHeight>2</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 12, resolution 1000.0000, scale 3571428.5714 (tile matrix)
bottomleft (0, 0, 12), topright (2, 1, 12)
width=3, height=2, total=6  -->
			<TileMatrix>
				<ows:Identifier>12</ows:Identifier>
				<ScaleDenominator>3571428.5714</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>3</MatrixWidth>
				<MatrixHeight>2</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 13, resolution 750.0000, scale 2678571.4286 (tile matrix)
bottomleft (0, 0, 13), topright (3, 2, 13)
width=4, height=3, total=12  -->
			<TileMatrix>
				<ows:Identifier>13</ows:Identifier>
				<ScaleDenominator>2678571.4286</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>4</MatrixWidth>
				<MatrixHeight>3</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 14, resolution 650.0000, scale 2321428.5714 (tile matrix)
bottomleft (0, 0, 14), topright (3, 2, 14)
width=4, height=3, total=12  -->
			<TileMatrix>
				<ows:Identifier>14</ows:Identifier>
				<ScaleDenominator>2321428.5714</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>4</MatrixWidth>
				<MatrixHeight>3</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 15, resolution 500.0000, scale 1785714.2857 (tile matrix)
bottomleft (0, 0, 15), topright (4, 3, 15)
width=5, height=4, total=20  -->
			<TileMatrix>
				<ows:Identifier>15</ows:Identifier>
				<ScaleDenominator>1785714.2857</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>5</MatrixWidth>
				<MatrixHeight>4</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 16, resolution 250.0000, scale 892857.1429 (tile matrix)
bottomleft (0, 0, 16), topright (8, 5, 16)
width=9, height=6, total=54  -->
			<TileMatrix>
				<ows:Identifier>16</ows:Identifier>
				<ScaleDenominator>892857.1429</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>9</MatrixWidth>
				<MatrixHeight>6</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 17, resolution 100.0000, scale 357142.8571 (tile matrix)
bottomleft (0, 0, 17), topright (19, 13, 17)
width=20, height=14, total=280  -->
			<TileMatrix>
				<ows:Identifier>17</ows:Identifier>
				<ScaleDenominator>357142.8571</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>20</MatrixWidth>
				<MatrixHeight>14</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 18, resolution 50.0000, scale 178571.4286 (tile matrix)
bottomleft (0, 0, 18), topright (38, 25, 18)
width=39, height=26, total=1014  -->
			<TileMatrix>
				<ows:Identifier>18</ows:Identifier>
				<ScaleDenominator>178571.4286</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>39</MatrixWidth>
				<MatrixHeight>26</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 19, resolution 20.0000, scale 71428.5714 (tile matrix)
bottomleft (0, 0, 19), topright (94, 63, 19)
width=95, height=64, total=6080  -->
			<TileMatrix>
				<ows:Identifier>19</ows:Identifier>
				<ScaleDenominator>71428.5714</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>95</MatrixWidth>
				<MatrixHeight>64</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 20, resolution 10.0000, scale 35714.2857 (tile matrix)
bottomleft (0, 0, 20), topright (188, 125, 20)
width=189, height=126, total=23814  -->
			<TileMatrix>
				<ows:Identifier>20</ows:Identifier>
				<ScaleDenominator>35714.2857</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>189</MatrixWidth>
				<MatrixHeight>126</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 21, resolution 5.0000, scale 17857.1429 (tile matrix)
bottomleft (0, 0, 21), topright (375, 250, 21)
width=376, height=251, total=94376  -->
			<TileMatrix>
				<ows:Identifier>21</ows:Identifier>
				<ScaleDenominator>17857.1429</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>376</MatrixWidth>
				<MatrixHeight>251</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 22, resolution 2.5000, scale 8928.5714 (tile matrix)
bottomleft (0, 0, 22), topright (750, 500, 22)
width=751, height=501, total=376251  -->
			<TileMatrix>
				<ows:Identifier>22</ows:Identifier>
				<ScaleDenominator>8928.57142857</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>751</MatrixWidth>
				<MatrixHeight>501</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 23, resolution 2.0000, scale 7142.8571 (tile matrix)
bottomleft (0, 0, 23), topright (938, 625, 23)
width=939, height=626, total=587814  -->
			<TileMatrix>
				<ows:Identifier>23</ows:Identifier>
				<ScaleDenominator>7142.85714286</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>939</MatrixWidth>
				<MatrixHeight>626</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 24, resolution 1.5000, scale 5357.1429 (tile matrix)
bottomleft (0, 0, 24), topright (1250, 833, 24)
width=1251, height=834, total=1043334  -->
			<TileMatrix>
				<ows:Identifier>24</ows:Identifier>
				<ScaleDenominator>5357.14285714</ScaleDenominator>
				<TopLeftCorner>420000.0 350000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>1251</MatrixWidth>
				<MatrixHeight>834</MatrixHeight>
			</TileMatrix>
			<!-- ###### zoom 25, resolution 1.0000, scale 3571.4286 (tile matrix)
bottomleft (0, 0, 25), topright (1875, 1250, 25)
width=1876, height=1251, total=2346876  -->
			<TileMatrix>
				<ows:Identifier>25</ows:Identifier>
				<ScaleDenominator>3571.42857143</ScaleDenominator>
				<TopLeftCorner>420000.0 900000.0</TopLeftCorner>
				<TileWidth>256</TileWidth>
				<TileHeight>256</TileHeight>
				<MatrixWidth>1876</MatrixWidth>
				<MatrixHeight>1251</MatrixHeight>
			</TileMatrix>
		</TileMatrixSet>
	</Contents>
	<Themes>
  ## Main loop for the themes
  ## The DB-list is ordered by oberthema_id
   <% pre_oberthema= 'not_yet' %>
   <% counter_i = 0 %>
   % for theme in c.themes:
   ## Oberthema
   % if not(pre_oberthema== theme.oberthema_id):
	   <Theme>
				<ows:Title>${theme.inspire_oberthema_name|x,trim}</ows:Title>
				<ows:Abstract>${theme.inspire_oberthema_abstract|x,trim}</ows:Abstract>
				<ows:Identifier>${theme.oberthema_id|x,trim}</ows:Identifier>
   % endif  
   ## Thema
   <Theme>
			<ows:Title>${theme.inspire_name|x,trim}</ows:Title>
			<ows:Abstract>${theme.inspire_abstract|x,trim}</ows:Abstract>
			<ows:Identifier>${theme.id|x,trim}</ows:Identifier>
		## Refs
		% for x in str(theme.fk_dataset_id).split(','):
			<LayerRef>${x}</LayerRef>
		% endfor
      </Theme>
      ## No overflow
      % if counter_i < (len(c.themes) - 1):
		  <% counter_i = counter_i + 1 %>
      % endif
      ## End Oberthema
      % if not(theme.oberthema_id == c.themes[counter_i].oberthema_id):
		  </Theme>
      % endif 
      ## remember the precedent Oberthema
       <% pre_oberthema= theme.oberthema_id %>
    % endfor
	## End main loop
    ## could be that the db ist empty
    % if len(c.themes) > 0:
    </Theme>
    % endif
  </Themes>
	<ServiceMetadataURL xlink:href="http://www.opengis.uab.es/SITiled/world/1.0.0/WMTSCapabilities.xml"/>
</Capabilities>
