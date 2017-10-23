#' @title Send event to RCAP client UI
#' 
#' @param event object that should be delivered to client, can't be NULL.
#' @return a result object with status 'Failure' or 'Success' and any additional information.
rcap.events.send <- function(event = list()) {
  if(is.null(event)) {
    warning("Event is null.")
    list("status" = "Failure", "msg" = "Can't send NULL events")
  } else {
    result <- rcap.client.send(event)
    if(is.null(result)) {
      invisible(list("status" = "Success"))
    } else {
      invisible(fromJSON(result))
    }
  }
}
