#' Abstract class for event handlers
#'
#' @section Methods:
#'
#' \code{supports(event = list())} \code{TRUE} if handler supports the event, \code{FALSE} otherwise
#'
#' \code{handle(event = list())} handles the event, returns a response object with outcome of the processing and result data.
#'   
EventHandler <- R6::R6Class("EventHandler",
                       
                       public = list(
                         
                         initialize = function() {
                           
                         },
                         
                         supports = function(event = list()) {
                           FALSE
                         },
                         handle = function(event = list()) {
                           
                         }
                       ),
                       
                       private = list(
                       )
)