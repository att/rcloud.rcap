rcap.run <- function(rcapJson, ...) {
  
  # Trigger the client-side builder
  if (!missing(rcapJson)) {
    rcap.initViewer(rcapJson)
  }
  
}