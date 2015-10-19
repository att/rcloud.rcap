
# rcapConfig <- jsonlite::fromJSON(system.file(package="rcloud.rcap", file="testData/testConfig.json"), simplifyVector = FALSE)

#' Read rcap configuration and create OCAPs
#' 
#' @description Load site configuration from the json file in the notebook assests.
#' Parse the controls for any functions that need creating and and setup the OCAPs.
#' This function is a wrapper around \code{rcloud.web::rcw.result}.
#'
#' @param rcapConfigFileName Character vector: The name of the json file in the assets.
#' @param inline logical: If TRUE this will attempt to call rcw.result with the rcw.inline wrapper
#'
#' @return NULL
#' @export
#'
#' @examples
#' \dontrun{
#' rcap.result("rcap_designer.json")
#' }
#' 
rcap.result <- function(rcapConfigFileName="rcap_designer.json", inline=FALSE) {
  
  # Retrieve the designer config from the notebook
  rcapJson <- rcloud.get.asset(name=rcapConfigFileName)
  
  # Convert the JSON into a list
  rcapConfig <- jsonlite::fromJSON(rcapJson, simplifyVector = FALSE)
  
  # Create the controller object from the JSON
  # This builds all the control objects and sets up the dependencies
  rcapController <- Controller(rcapConfig)
  
  # Almost all of this will be replaced with controller functions --------------
  
  # Start building rcw call
  rcwResultList <- list(run=rcap.run, body="", rcapJson=rcapJson)
  

  rcwResultList[['test']] <- function() {rcap.consoleMsg(list(a="asd", b=list(c=1,d=2)))}
  
  # Fire up the viewer
  rcap.initViewer(rcapJson)
  
  # Call rcw.result
  if(inline) {
    rcloud.web::rcw.inline(do.call(rcloud.web::rcw.result, rcwResultList))
  } else {
    do.call(rcloud.web::rcw.result, rcwResultList)
  }
  
}
