
#' 
#' Class representing profile variable
#'
#' @section Methods:
#'
#' \code{initialize(cl)} Initialization from the parsed JSON
#'   variable description.
#'
#' \code{getName()} get the name of variable. 
#' 
#' \code{getLabel()} get the label of variable. 
#'
#' @section Private variables:
#'
#' \code{name} the variable name.
#'
#' \code{label} the variable label.
#'
#' \code{json} the original (parsed) JSON configuration of the control.
#'

ProfileVariable <- R6::R6Class("ProfileVariable",
                       
                       public = list(
                         
                         ## Build the object from the input json
                         ## cl is the json for the variable converted to a list
                         initialize = function(cl)
                           variableInitialize(self, private, cl),
                         
                         getName = function() 
                           private$name %||% NA_character_,
                         
                         getLabel = function() 
                           private$label %||% NA_character_
                         
                       ),
                         
                       private = list(
                         
                         name = NULL,     # e.g. my-variable
                         label = NULL,   # e.g. "My Variable"
                         json = NULL   # The list as returned from JSON
                         
                       )
)

variableInitialize <- function(self, private, cl) {
  
  if (!is.null(cl$name)) private$name <- cl$name
  if (!is.null(cl$label)) private$label <- cl$label
  
  ## Copy the input list for future reference
  private$json <- cl
  class(private$json) <- private$name
  
  invisible(self)
}

variableSetName <- function(self, private, new_value) {
  
  if (!is.null(new_value) && !is.null(private$name)) {
    assign(private$name, new_value, envir = rcloudEnv())
  }
  
  invisible(self)
}

variableSetLabel <- function(self, private, new_value) {
  
  if (!is.null(new_value) && !is.null(private$label)) {
    assign(private$label, new_value, envir = rcloudEnv())
  }
  
  invisible(self)
}
