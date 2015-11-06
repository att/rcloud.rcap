
# rcapConfig <- jsonlite::fromJSON(system.file(package="rcloud.rcap", file="testData/testConfig.json"), simplifyVector = FALSE)

#' Read rcap configuration and create OCAPs
#'
#' @description Load site configuration from the json file in the notebook assests.
#' Parse the controls for any functions that need creating and and setup the OCAPs.
#' This function is a wrapper around \code{rcloud.web::rcw.result}.
#'
#' @param rcapConfigFileName Character vector: The name of the json file in the assets.
#'
#' @return NULL
#' @importFrom rcloud.support rcloud.get.asset
#' @export
#' @examples
#' \dontrun{
#' rcap.result("rcap_designer.json")
#' }
#'
#' @importFrom rcloud.support rcloud.get.asset

rcap.result <- function(rcapConfigFileName="rcap_designer.json") {

  # Retrieve the designer config from the notebook
  rcapJson <- rcloud.get.asset(name=rcapConfigFileName)

  ## Fire up the viewer
  rcap.initViewer(rcapJson)

  # Convert the JSON into a list
  rcapConfig <- jsonlite::fromJSON(rcapJson, simplifyVector = FALSE)

  # Create the controller object from the JSON
  # This builds all the control objects and sets up the dependencies,
  # then it updates all of them in the correct order
  createController(rcapConfig)

  rcw.result(run = function(...) { }, body = "")
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
