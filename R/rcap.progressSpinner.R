#' @title Write message to ProgressSpinner with specified id
#' 
#' @param variableName the name of the variable linked with ProgressSpinner widget control
#' @param message the message that should be displayed
#' @param append should the message be appended to already displayed content
#' @return NULL invisibly
#' @export
rcap.progressSpinner.write <- function(variableName, message, append = FALSE) {
  if(haveController()) {
    cnt <- get("rcapController", envir = rcapEnv)
    control <- Filter(function(x) {x$getVariableName()==variableName}, cnt$getControls())
    if(length(control)!=1) {
      stop(paste0("Control for variable '", variableName, "' not found!"));
    }
    control <- control[[1]]
    event <- list("eventType" = "ProgressSpinnerWrite",
                  "controlId" = control$getId(),
                  "data" = list("message" = message, 
                                "append" = append)
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

#' @title Write message to a collection of ProgressSpinner widgets
#' 
#' @param msg named list of messages, with keys being ProgressSpinner widget variableNames
#' @param append single flag or vector of flags controlling if corresponding message should be appended to the widgets content. Last element gets replicated to fit the number of targets.
#' @param ... named parameters, if 'msg' is not defined, these specify progress spinners and messages that should be written.
#' @return NULL invisibly
#' @export
rcap.progressSpinner.msg <- function(msg=NULL, append=FALSE, ...) {
  parms <- list(...)
  if( is.null(msg) && length(parms) >0 ) {
    msg <- parms
    }
  if( length(msg) > 0 ) {
    if(length(append) >= length(msg)) {
      appends <- append
    } else {
      appends <- c(append, rep(append[[length(append)]], length.out = (length(msg) - length(append))))
    }
    msg <- as.list(msg)
    for(p in 1:length(msg)) {
      if(!is.na(names(msg)[[p]])) { 
        rcloud.rcap:::rcap.messageWidget.write(names(msg)[[p]], msg[[p]], append = appends[p])
      }
    }
  }
  invisible(NULL)
}
