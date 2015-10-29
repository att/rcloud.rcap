
fib <- function(len) {
    fibvals <- numeric(len)
    fibvals[1] <- 1
    fibvals[2] <- 1
    for (i in 3:len) { 
        fibvals[i] <- fibvals[i-1]+fibvals[i-2]
    }
    fibvals
}

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
#' @importFrom rcloud.support rcloud.get.asset
#' @export
#'
#' @examples
#' \dontrun{
#' rcap.result("rcap_designer.json")
#' }
#' 
#' @importFrom rcloud.support rcloud.get.asset

rcap.result <- function(rcapConfigFileName="rcap_designer.json", inline=FALSE) {
  
  # Retrieve the designer config from the notebook
  rcapJson <- rcloud.get.asset(name=rcapConfigFileName)
  
  # Convert the JSON into a list
  rcapConfig <- jsonlite::fromJSON(rcapJson, simplifyVector = FALSE)
  
  # Create the controller object from the JSON
  # This builds all the control objects and sets up the dependencies
  createController(rcapConfig)
  
  # Start building rcw call
  rcwResultList <- list(run=rcap.run, body="", rcapJson=rcapJson)
  
  # Parse for functions
  # Attach the function to the rcw call list
  allFunctions <- parseConfig(rcapConfig)
  
  allFunctions <- unlist(allFunctions)
  names(allFunctions) <- allFunctions
  
  for(funName in allFunctions) {
    rcwResultList[[funName]] <- eval(parse(text=funName))
  }
  
  # Fire up the viewer
  rcap.initViewer(rcapJson)
  
  # Call rcw.result
  if(inline) {
    rcloud.web::rcw.inline(do.call(rcloud.web::rcw.result, rcwResultList))
  } else {
    do.call(rcloud.web::rcw.result, rcwResultList)
  }
  
}

rcapEnv <- new.env()

createController <- function(config) {
  cnt <- Controller$new(config)
  assign("rcapController", cnt, envir = rcapEnv)
  invisible(cnt)
}

updateController <- function(controls) {
  cnt <- get("rcapController", envir = rcapEnv)
  cnt$update(controls)
}
