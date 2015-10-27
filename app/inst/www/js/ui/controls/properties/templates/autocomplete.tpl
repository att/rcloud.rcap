<div class="form-group" id="form-group-<%=property.id%>">
	<label for="<%=property.id%>"><%=property.label%></label>
	<input class="form-control" id="<%=property.id%>" value="<%=property.value%>" />
	<div class="description"><%=property.helpText%></div>
</div>

<script type="text/javascript">

      // utilise the service:
      var serviceName = '<%=property.serviceName%>';

      // ### temporary code
      window.notebook_result = {};
      window.notebook_result[serviceName] = function() {
            return [
                  'getPlot',
                  'getTowersPlot',
                  'getCellPlot',
                  'getComplicatedPlot',
                  'getAmazingColorfulPlot',
                  'getLatticePlot',
                  'getSpaghettiPlot',
                  'getSine',
                  'getCosine',
                  'getTangent',
                  'getSecant',
                  'getCotangent'
            ];
      };
      // ### end temporary code

      var autocompleteSrc = window.notebook_result[serviceName]();

	$('#<%=property.id%>').autocomplete({
            source: autocompleteSrc
      });

</script>