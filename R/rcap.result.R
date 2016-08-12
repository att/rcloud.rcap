
#' Set up a dashboard
#'
#' This function must called from the last cell of the notebook.
#' When running in mini.html, it requests the asset that contains the
#' configuration of the dashboard, and initializes the viewer from it.
#'
#' Then it creates the server side controller, and the controller
#' creates all the control objects that corresponds to the elements
#' of the dashboard.
#'
#' This function should not be called from the notebook itself.
#'
#' @param rcapConfigFileName Character vector:
#'   The name of the json file in the assets.
#' @return NULL
#' @importFrom rcloud.support rcloud.get.asset
#' @export

rcap.result <- function(rcapConfigFileName="rcap_designer.json", rcapThemeFileName="rcap_designer.css") {

  ## Don't run in edit mode
  if(isEditMode()) return(invisible(NULL))

  ## Retrieve the designer config from the notebook
  rcapJson <- rcloud.get.asset(name = rcapConfigFileName)

  ## Retrieve the designer CSS from the notebook
  rcapCss <- rcloud.get.asset(name = rcapThemeFileName, quiet=TRUE)

  ## Fire up the viewer
  rcap.initViewer(rcapJson, if(is.null(rcapCss)) FALSE else TRUE, rcapSessionInfo())

  # Convert the JSON into a list
  rcapConfig <- jsonlite::fromJSON(rcapJson, simplifyVector = FALSE)

  ## Create the controller object from the JSON
  ## This builds all the control objects and sets up the dependencies,
  ## then it updates all of them in the correct order
  createController(rcapConfig)

  ## This is needed, because the mini expects this kind
  ## of structure from the last cell.
  rcw.result(run = function(...) { }, body = "")
}

## Temporary environment to store the controller in.
rcapEnv <- new.env()

createController <- function(config) {
  cnt <- Controller$new(config)
  assign("rcapController", cnt, envir = rcapEnv)
  invisible(cnt)
}

haveController <- function() {
  exists("rcapController", envir = rcapEnv)
}

updateController <- function(controls) {
  cnt <- get("rcapController", envir = rcapEnv)
  cnt$update(controls)
}

updateAllControls <- function(controls) {
  cnt <- get("rcapController", envir = rcapEnv)
  cnt$initUpdate(controls)
}

#' Is the page that called this function edit or mini (or derviatives)
#'
#' Retrieves the url from the .session info and regex's it for edit.html
#' 
#' @return Logical: TRUE if it is the edit page
#' @importFrom rcloud.support rcloud.get.url
isEditMode <- function() {
  sessionMode <- rcloud.support:::.session$mode
  res <- FALSE
  if(!is.null(sessionMode)) {
    if(sessionMode == "IDE") {
      res <- TRUE
    }
  }
  res
}
