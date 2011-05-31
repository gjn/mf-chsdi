<ows:ServiceIdentification>
		<ows:Title>${c.service_metadata.title|x,trim}</ows:Title>
		<ows:Abstract>${c.service_metadata.abstract|x,trim}</ows:Abstract>
		<ows:Keywords>
		    <% keywords = c.service_metadata.keywords.split(',')  %>
		    % if keywords:
		    %   for i in range(len(keywords)):
		    %     if keywords[i]:
	    	        <ows:Keyword>${keywords[i]}</ows:Keyword>
    	    %     endif
    	    %   endfor
		    % endif
		</ows:Keywords>
		<ows:ServiceType>OGC WMTS</ows:ServiceType>
		<ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
		<ows:Fees>${c.service_metadata.fee}</ows:Fees>
		<ows:AccessConstraints>${c.service_metadata.accessconstraint}</ows:AccessConstraints>
</ows:ServiceIdentification>
<ows:ServiceProvider>
		<ows:ProviderName>Bundesamt fuer Landestopografie swisstopo</ows:ProviderName>
		<ows:ProviderSite xlink:href="http://www.swisstopo.admin.ch"/>
		<ows:ServiceContact>
			<ows:IndividualName>Raphael Bovier</ows:IndividualName>
			<ows:ContactInfo>
				<ows:Address>
					<ows:DeliveryPoint>swisstopo</ows:DeliveryPoint>
					<ows:City>Bern</ows:City>
					<ows:AdministrativeArea>BE</ows:AdministrativeArea>
					<ows:PostalCode>3084</ows:PostalCode>
					<ows:Country>Switzerland</ows:Country>
					<ows:ElectronicMailAddress>geodata@swisstopo.ch</ows:ElectronicMailAddress>
				</ows:Address>
			</ows:ContactInfo>
		</ows:ServiceContact>
</ows:ServiceProvider>
