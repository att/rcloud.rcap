
#' @importFrom R6 R6Class

Controller <- R6::R6Class("Controller",
  public = list(

    initialize = function(rcapConfig)
      controllerInitialize(self, private, rcapConfig),

    update = function(controls)
      controllerUpdate(self, private, controls)
  ),

  private = list(
    controls = NULL
  )
)

controllerInitialize <- function(self, private, rcapConfig) {

  ## List of the controls (from JSON)
  allControls <- getControls(rcapConfig)

  ## Create the objects from the JSON
  private$controls <- lapply(allControls, Control$new)

  ## Use the ids to name the list items
  names(private$controls) <-
    vapply(private$controls, function(x) x$getId(), "")

  invisible(self)
}

controllerUpdate <- function(self, private, controls) {
  ## TODO
}
