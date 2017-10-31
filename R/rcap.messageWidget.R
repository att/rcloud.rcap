#' @title Write message to message widget with specified id
#' 
#' @param variableName the name of the variable linked with message widget control
#' @param message the message that should be displayed
#' @param append should the message be appended
#' @return NULL invisibly
#' @export
rcap.messageWidget.write <- function(variableName, message, append=FALSE) {
  if(haveController()) {
    cnt <- get("rcapController", envir = rcapEnv)
    control <- Filter(function(x) {x$getVariableName()==variableName}, cnt$getControls())
    if(length(control)!=1) {
      stop(paste0("Control for variable '", variableName, "' not found!"));
    }
    control <- control[[1]]
    event <- list("eventType" = "MessageWidgetWrite",
                  "controlId" = control$getId(),
                  "data" = list("append" = append, "message" = message)
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