rcap.run <- function(...) {
  
  # Trigger the client-side builder
  if (!missing(rcapJson)) {
    rcap.initViewer(rcapJson)
  }
  
}