<ows:ServiceIdentification>
		<ows:Title>${c.service_metadata.title|x,trim}</ows:Title>
		<ows:Abstract>${c.service_metadata.abstract|x,trim}</ows:Abstract>
		<ows:Keywords>
		    <% keywords = c.service_metadata.keywords  %>
		    % if keywords:
		    <%   keywords = keywords.split(',') %>
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
		<ows:ProviderName>${c.service_metadata.name}</ows:ProviderName>
		<ows:ProviderSite xlink:href="http://www.swisstopo.admin.ch"/>
		<ows:ServiceContact>
			<ows:IndividualName>${c.service_metadata.contactperson}</ows:IndividualName>
			<ows:ContactInfo>
				<ows:Address>
					<ows:DeliveryPoint>swisstopo</ows:DeliveryPoint>
					<ows:City>${c.service_metadata.city}</ows:City>
					<ows:PostalCode>${c.service_metadata.postcode}</ows:PostalCode>
					<ows:Country>${c.service_metadata.country}</ows:Country>
					<ows:ElectronicMailAddress>${c.service_metadata.contactelectronicmailaddress}</ows:ElectronicMailAddress>
				</ows:Address>
			</ows:ContactInfo>
		</ows:ServiceContact>
</ows:ServiceProvider>
