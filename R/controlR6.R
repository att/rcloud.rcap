
#' Abstract class for controls
#'
#' @section Methods:
#'
#' \code{initialize(cl)} Initialization from the parsed JSON
#'   control descriptions, from \code{\link{getControls}}.
#'
#' \code{getId()} get the controls id. All controls should have a
#'   unique id.
#'
#' \code{getVariableName()} get name of associated global variable.
#'   If there is no such variable, then \code{NULL} is returned.
#'   
#' \code{getExecutionOrder()} get order defined by the designer in which the control should be processed.
#'   If there is no such variable, then \code{NULL} is returned.
#'   N.B. This order is just a hint, it may be overriden by backend if it is in conflict with default dependency resolution.
#'   
#' \code{setVariable(new_value = NULL)} set an R variable
#'   of a control to the specified value, coming from a
#'   front-end update.
#'
#' \code{update()} method to perform an update.
#'   This method is called when an update is requested from the
#'   frontend, and also when the dashboard page is built up the
#'   first time. It is also called when the control depends on
#'   another control that was changed in the frontend.
#'
#' \code{dependentVariables(clientVars, envir = rcloudEnv())}
#'   find all variables the update function of the control
#'   depends on, in the rcloud environment by default.
#'
#' @section Private variables:
#'
#' \code{id} the control id.
#'
#' \code{type} the control type, see \code{\link{control_classes}}
#'   for the list of control types.
#'
#' \code{json} the original (parsed) JSON configuration of the control.
#'
#' \code{controlFunction} the function to run to update the
#'   back-end side representation of the control.
#'
#' \code{varibaleName} name of the associated R varible, in the
#'   rcloud environment (i.e. the notebook environment).

Control <- R6::R6Class("Control",

  public = list(

    ## Build the object from the input json
    ## cl is the json for the control converted to a list
    initialize = function(cl)
      controlInitialize(self, private, cl),

    getType = function() private$type %||% NA_character_,
    getId = function() private$id %||% NA_character_,
    getVariableName = function() private$variableName %||% NA_character_,
    getExecutionOrder = function() private$executionOrder %||% NA_integer_,
    getControlFunctionName = function() {
      private$controlFunction %||% NA_character_
    },

    setVariable = function(new_value = NULL)
      controlSetVariable(self, private, new_value),

    update = function() {
      controlUpdate(self, private)
    },

    valueToClient = function(value) {
      value
    },

    dependentVariables = function(clientVars, envir = rcloudEnv())
      controlDependentVariables(self, private, clientVars, envir)
  ),

  private = list(

    id = NULL,     # eg rcapac34a
    type = NULL,   # rplot etc
    json = NULL,   # The list as returned from JSON
    executionOrder = NULL,   # User defined execution order

    ## Control Properties
    controlFunction = NULL,
    variableName = NULL
  )
)

#' @importFrom rcloud.web rcw.result

controlInitialize <- function(self, private, cl) {

  if (!is.null(cl$id)) private$id <- cl$id
  if (!is.null(cl$type)) private$type <- cl$type
  if (!is.null(cl$executionOrder)) private$executionOrder <- cl$executionOrder

  ## This is only for data sources
  if (!is.null(cl$code)) private$controlFunction <- cl$code
  if (!is.null(cl$variable) &
      !identical(cl$variable, "")) private$variableName <- cl$variable
  
  ## Grab the code if it's there
  if (!is.null(cl$controlProperties) &&
       length(cl$controlProperties) > 0) {
    ## Pulling various properties
    for (cp in cl$controlProperties) {
      if (cp$uid == "code") private$controlFunction <- cp$value %||% NULL
      if (cp$uid == "variablename" && !identical(cp$value, ""))
        private$variableName <- cp$value
      ## This is for populating dropdowns, etc.
      if (cp$uid == "options" &&
          identical(cp$optionsDerivedFrom, "code")) {
        private$controlFunction <- cp$value %||% NULL
      }
      
      # Special addition for iframe
      if (cp$uid == "source") {
        if (private$type == "iframe" && !is.null(cp$value)) {
          # If it's not a valid URL then it's code
          if(!grepl("^https?://", cp$value)) {
            private$controlFunction <- cp$value
          }
        }
      }  # end frame addition
      
    }
  }

  ## Copy the input list for future reference
  private$json <- cl
  class(private$json) <- private$type

  invisible(self)
}

controlSetVariable <- function(self, private, new_value) {
  if (!is.null(new_value) && !is.null(private$variableName)) {
    assign(private$variableName, new_value, envir = rcloudEnv())
  }

  invisible(self)
}

controlUpdate <- function(self, private) {

  ## Variable first, if there is one. This is simply the current value
  ## of the control
  has_value <- !is.null(private$variableName) &&
    exists(private$variableName, envir = rcloudEnv())
  value <- if (has_value) {
    self$valueToClient(
      get(private$variableName, envir = rcloudEnv())
    )
  }

  ## Possible values then, e.g. the list of values in a dropdown
  has_possible_values <- !is.null(private$controlFunction)
  pos_values <- if (has_possible_values) {
    do.call(private$controlFunction, list(), envir = rcloudEnv())
  }

  ## Do the update
  if (has_value && has_possible_values) {
    rcap.updateVariable(private$variableName, value, as.list(pos_values))

  } else if (has_value) {
    rcap.updateVariable(private$variableName, value)

  } else {
    rcap.updateControl(private$id, pos_values)
  }

  invisible(self)
}

## Compare the variables that are client side to those used in the function
## Return the matches
#' @importFrom codetools findGlobals

controlDependentVariables <- function(self, private, clientVars, envir) {
  if (!is.null(private$controlFunction) &&
       exists(private$controlFunction, envir = envir) &&
       is.function(fun <- get(private$controlFunction, envir = envir))) {
    intersect(clientVars, findGlobals(fun))
  } else {
    character()
  }
}
