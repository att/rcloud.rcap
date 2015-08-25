
rcap.result <- function(rcapConfigFileName="rcap_designer.json") {
  
  # Retrieve the designer config from the notebook
  rcapJson <- rcloud.get.asset(name=rcapConfigFileName)
  
  # Convert the JSON into a list
  rcapConfig <- rjson::fromJSON(rcapJson)
  
  # Parse for functions
  
  # Wrap plot and data functions
  
  # Call rcw.result
  
  # Trigger the client-side builder
  rcap.initViewer(rcapConfig)
}