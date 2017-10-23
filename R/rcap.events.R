#' @title Send event to RCAP client UI
#' 
#' @param event object that should be delivered to client, can't be NULL.
#' @return a response object with 'status' attribute set to 'Failure' or 'Success', 'msg' attribute holding error message and 'data' attribute holding result object.
rcap.events.send <- function(event = list()) {
  if(is.null(event)) {
    warning("Event is null.")
    list("status" = "Failure", "msg" = "Can't send NULL events")
  } else {
    result <- rcap.client.send(toJSON(event))
    if(is.null(result)) {
      invisible(list("status" = "Success"))
    } else {
      invisible(fromJSON(result))
    }
  }
}

#' @title Send ProcessingStart event to RCAP client UI
#' 
#' @return a result object with status 'Failure' or 'Success' and any additional information.
rcap.events.sendProcessingStart <- function() {
  invisible(rcap.events.send(list(eventType = 'ProcessingStart')))
}

#' @title Send ProcessingEnd event to RCAP client UI
#' 
#' @return a result object with status 'Failure' or 'Success' and any additional information.
rcap.events.sendProcessingEnd <- function() {
  invisible(rcap.events.send(list(eventType = 'ProcessingEnd')))
}