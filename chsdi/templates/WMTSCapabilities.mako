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
			<ows:IndividualName>David Oesch</ows:IndividualName>
			<ows:PositionName></ows:PositionName>
			<ows:ContactInfo>
				<ows:Phone>
					<ows:Voice>+41 (0)31 / 963 21 11</ows:Voice>
					<ows:Facsimile>+41 (0)31 / 963 24 59</ows:Facsimile>
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
					<ows:Get xlink:href="${c.onlineressource}/wmts/">
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
			 <LegendURL format="image/png" xlink:href="${c.onlineressource}/legend/${layer.id|x,trim}_${c.lang|x,trim}.png" />
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
			<ResourceURL format="image/${str(layer.arr_all_formats).split(',')[0]}" resourceType="tile" template="${c.onlineressource}/wmts/1.0.0/${layer.id|x,trim}/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.${str(layer.arr_all_formats).split(',')[0]}"/>
      ## <ResourceURL format="application/gml+xml; version=3.1" resourceType="FeatureInfo" template="${c.onlineressource}/wmts/1.0.0/{Time}/${str(layer.tile_matrix_set_id).split(',')[0]}/{TileMatrix}/{TileRow}/{TileCol}/{J}/{I}.xml"/>
		</Layer>
  % endfor
  ## End main loop
    <TileMatrixSet>
			<ows:Identifier>21781</ows:Identifier>
			<ows:SupportedCRS>urn:ogc:def:crs:EPSG:21781</ows:SupportedCRS>

            <%include file="TileMatrixSet.mako"/>

            

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
