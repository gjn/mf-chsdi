<?xml version="1.0" encoding="UTF-8"?>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
<%!
    def validate_tilematrixset(id):
        if int(id) in [18,21,26,27,28]:
            return id
        return '26'
%>
	<!-- Revision: $Rev$ -->
	% if c.is_swisstopowmts:
	    <%include file="swisstopoHeader.mako"/>
	% else:
	    <%include file="standardHeader.mako"/>
	% endif

   <ows:OperationsMetadata>
		<ows:Operation name="GetCapabilities">
			<ows:DCP>
				<ows:HTTP>
					<ows:Get xlink:href="${c.onlineressource}/1.0.0/WMTSCapabilities.xml">
						<ows:Constraint name="GetEncoding">
							<ows:AllowedValues>
								<ows:Value>REST</ows:Value>
							</ows:AllowedValues>
						</ows:Constraint>
					</ows:Get>
				</ows:HTTP>
			</ows:DCP>
		</ows:Operation>
		<ows:Operation name="GetTile">
			<ows:DCP>
				<ows:HTTP>
					<ows:Get xlink:href="${c.onlineressource}/">
						<ows:Constraint name="GetEncoding">
							<ows:AllowedValues>
								<ows:Value>REST</ows:Value>
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
                                ## TODO relative path
				<% legendName = "/var/www/vhosts/mf-chsdi/private/chsdi/chsdi/public/legend/" + layer.id + "_" + c.lang + ".png" %>
				<%! import os.path %> 
				<% hasLegend = os.path.isfile(legendName) %>
				% if hasLegend:
                <LegendURL format="image/png" xlink:href="${c.scheme}://api.geo.admin.ch/legend/${layer.id|x,trim}_${c.lang|x,trim}.png" />
			  	% endif
			</Style>
			<Format>image/${str(layer.arr_all_formats).split(',')[0]}</Format>
			<Dimension>
				<ows:Identifier>Time</ows:Identifier>
				<Default>${str(layer.timestamp).split(',')[0]}</Default>
				% for timestamp in layer.timestamp.split(','):
				<Value>${timestamp}</Value>
				% endfor
			</Dimension>
			<TileMatrixSetLink>
				<TileMatrixSet>21781_${layer.zoomlevel_max|validate_tilematrixset}</TileMatrixSet>
			</TileMatrixSetLink>
			<ResourceURL format="image/${str(layer.arr_all_formats).split(',')[0]}" resourceType="tile" template="${c.onlineressource}/1.0.0/${layer.id|x,trim}/default/{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.${str(layer.arr_all_formats).split(',')[0]}"/>

      ## <ResourceURL format="application/gml+xml; version=3.1" resourceType="FeatureInfo" template="${c.onlineressource}/1.0.0/{Time}/${str(layer.tile_matrix_set_id).split(',')[0]}/{TileMatrix}/{TileRow}/{TileCol}/{J}/{I}.xml"/>
		</Layer>
  % endfor
  ## End main loop
    <TileMatrixSet>
			<ows:Identifier>21781_18</ows:Identifier>
			<ows:SupportedCRS>urn:ogc:def:crs:EPSG:21781</ows:SupportedCRS>

            <%include file="TileMatrixSet.mako"/>

	</TileMatrixSet>
	<TileMatrixSet>
			<ows:Identifier>21781_21</ows:Identifier>
			<ows:SupportedCRS>urn:ogc:def:crs:EPSG:21781</ows:SupportedCRS>

            <%include file="TileMatrixSet.mako"/>
            <%include file="TileMatrixSet_19.mako"/>
            <%include file="TileMatrixSet_20.mako"/>
            <%include file="TileMatrixSet_21.mako"/>

	</TileMatrixSet>
    <TileMatrixSet>
			<ows:Identifier>21781_26</ows:Identifier>
			<ows:SupportedCRS>urn:ogc:def:crs:EPSG:21781</ows:SupportedCRS>

            <%include file="TileMatrixSet.mako"/>
            <%include file="TileMatrixSet_19.mako"/>
            <%include file="TileMatrixSet_20.mako"/>
            <%include file="TileMatrixSet_21.mako"/>
            <%include file="TileMatrixSet_22.mako"/>
            <%include file="TileMatrixSet_23.mako"/>
            <%include file="TileMatrixSet_24.mako"/>
            <%include file="TileMatrixSet_25.mako"/>
            <%include file="TileMatrixSet_26.mako"/>

	</TileMatrixSet>
	<TileMatrixSet>
			<ows:Identifier>21781_27</ows:Identifier>
			<ows:SupportedCRS>urn:ogc:def:crs:EPSG:21781</ows:SupportedCRS>

            <%include file="TileMatrixSet.mako"/>
            <%include file="TileMatrixSet_19.mako"/>
            <%include file="TileMatrixSet_20.mako"/>
            <%include file="TileMatrixSet_21.mako"/>
            <%include file="TileMatrixSet_22.mako"/>
            <%include file="TileMatrixSet_23.mako"/>
            <%include file="TileMatrixSet_24.mako"/>
            <%include file="TileMatrixSet_25.mako"/>
            <%include file="TileMatrixSet_26.mako"/>
            <%include file="TileMatrixSet_27.mako"/>

	</TileMatrixSet>
    <TileMatrixSet>
			<ows:Identifier>21781_28</ows:Identifier>
			<ows:SupportedCRS>urn:ogc:def:crs:EPSG:21781</ows:SupportedCRS>

            <%include file="TileMatrixSet.mako"/>
            <%include file="TileMatrixSet_19.mako"/>
            <%include file="TileMatrixSet_20.mako"/>
            <%include file="TileMatrixSet_21.mako"/>
            <%include file="TileMatrixSet_22.mako"/>
            <%include file="TileMatrixSet_23.mako"/>
            <%include file="TileMatrixSet_24.mako"/>
            <%include file="TileMatrixSet_25.mako"/>
            <%include file="TileMatrixSet_26.mako"/>
            <%include file="TileMatrixSet_27.mako"/>
            <%include file="TileMatrixSet_28.mako"/>

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
		<% used_layers = theme.sswmts.split(',') %>
		<% layers      = theme.fk_dataset_id.split(',')  %>
		% for i in range(len(layers)):
		    % if used_layers[i] == 't' and c.is_swisstopowmts:
			<LayerRef>${layers[i]}</LayerRef>
			%endif
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
