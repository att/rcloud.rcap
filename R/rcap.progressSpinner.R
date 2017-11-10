#' @title Write message to ProgressSpinner with specified id
#' 
#' @param variableName the name of the variable linked with ProgressSpinner widget control
#' @param message the message that should be displayed
#' @return NULL invisibly
#' @export
rcap.progressSpinner.write <- function(variableName, message) {
  if(haveController()) {
    cnt <- get("rcapController", envir = rcapEnv)
    control <- Filter(function(x) {x$getVariableName()==variableName}, cnt$getControls())
    if(length(control)!=1) {
      stop(paste0("Control for variable '", variableName, "' not found!"));
    }
    control <- control[[1]]
    event <- list("eventType" = "ProgressSpinnerWrite",
                  "controlId" = control$getId(),
                  "data" = list("message" = message)
    )
    response <- rcap.events.send(event)
    if(response$status != 'Success') {
      warning(paste0("Event processing failed ", response$msg))
    }
  } else {
    warning("Writting to message widget is only available in dashboard view.")
  }
  invisible(NULL)
}