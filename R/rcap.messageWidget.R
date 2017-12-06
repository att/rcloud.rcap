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

#' @title Write message to a collection of Message widgets
#' 
#' @param msg named list of messages, with keys being Message widget variableNames
#' @param append flag specifying if the messages should be appended to widgets' content or not
#' @param ... named parameters, if 'msg' is not defined, these specify progress spinners and messages that should be written.
#' @return NULL invisibly
#' @export
rcap.messageWidget.msg <- function(msg=NULL, append=FALSE, ...) {
  parms <- list(...)
  if(is.null(msg) && length(parms) >0 ) {
    msg <- parms
  }
  if( length(msg) > 0 ) {
    msg <- as.list(msg)
    for(p in 1:length(msg)) {
      if(!is.na(names(msg)[[p]])) {
        rcloud.rcap:::rcap.messageWidget.write(names(msg)[[p]], msg[[p]], append = append)
      }
    }
  }
  invisible(NULL)
}