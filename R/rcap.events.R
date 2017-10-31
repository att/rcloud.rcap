#' @title Send event to RCAP client UI
#' 
#' @param event object that should be delivered to client, can't be NULL.
#' @importFrom jsonlite fromJSON
#' @importFrom jsonlite toJSON
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

#' @title Receive event from RCAP client UI
#' 
#' @param event JSON formatted string holding an object submitted by the client.
#' @importFrom jsonlite fromJSON
#' @importFrom jsonlite toJSON
#' @return a response object with 'status' attribute set to 'Failure' or 'Success', 'msg' attribute holding error message and 'data' attribute holding result object.
rcap.events.receive <- function(eventString = NULL) {
  if(!haveController()) {
    warning("This functionality is only available in dashboard view.")
    return(toJSON(list("status" = "Failure", "msg" = "This functionality is only available in dashboard view.")))
  }
  if(is.null(eventString)) {
    return(toJSON(list("status" = "Failure", "msg" = "Can't handle NULL events.")))
  } else {
    event <- fromJSON(eventString)
    if(is.null(event)) {
      return(toJSON(list("status" = "Failure", "msg" = "Can't handle NULL events.")))
    }
    if(! 'eventType' %in% names(event) || is.null(event$eventType)) {
      return(toJSON(list("status" = "Failure", "msg" = "Event has no eventType set.")))
    }
    eventHandler <- rcap.eventHandlers[unlist(lapply(rcap.eventHandlers, function(x) { x$supports(event)}))]
    if(length(eventHandler) > 1) {
      stop(paste0("More than one event handler found for event ", eventString))
    }
    if(length(eventHandler) == 0) {
      return(toJSON(list("status" = "Failure", "msg" = "Event handler for event does not exist.")))
    }
    result <- eventHandler[[1]]$handle(event)
    if(is.null(result)) {
      invisible(toJSON(list("status" = "Success")))
    } else {
      invisible(toJSON(result))
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