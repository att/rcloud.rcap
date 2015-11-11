
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
#' \code{update(new_value = NULL)} method to perform an update.
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

    getId = function() private$id %||% NA_character_,
    getVariableName = function() private$variableName %||% NA_character_,

    update = function(new_value = NULL)
      controlUpdate(self, private, new_value),

    dependentVariables = function(clientVars, envir = rcloudEnv())
      controlDependentVariables(self, private, clientVars, envir)
  ),

  private = list(

    id = NULL,     # eg rcapac34a
    type = NULL,   # rplot etc
    json = NULL,   # The list as returned from JSON

    ## Control Properties
    controlFunction = NULL,
    variableName = NULL
  )
)

#' @importFrom rcloud.web rcw.result

controlInitialize <- function(self, private, cl) {

  if (!is.null(cl$id)) private$id <- cl$id
  if (!is.null(cl$type)) private$type <- cl$type

  ## Grab the code if it's there
  if (!is.null(cl$controlProperties) &&
       length(cl$controlProperties) > 0) {
    ## Pulling various properties
    for (cp in cl$controlProperties) {
      if (cp$uid == "code") private$controlFunction <- cp$value %||% NULL
      if (cp$uid == "variablename") private$variableName <- cp$value
    }
  }

  ## Copy the input list for future reference
  private$json <- cl
  class(private$json) <- private$type

  invisible(self)
}

controlUpdate <- function(self, private, new_value) {

  ## Set variable
  if (!is.null(new_value) && !is.null(private$variableName)) {
    assign(private$variableName, new_value, envir = rcloudEnv())
  }

  ## Variable first, if there is one. This is simply the current value
  ## of the control
  has_value <- !is.null(private$variableName) &&
    exists(private$variableName, envir = rcloudEnv())
  value <- if (has_value) get(private$variableName, envir = rcloudEnv())

  ## Possible values then, e.g. the list of values in a dropdown
  has_possible_values <- !is.null(private$controlFunction)
  pos_values <- if (has_possible_values) {
    do.call(private$controlFunction, list(), envir = rcloudenv())
  }

  ## Do the update
  if (has_value || has_possible_values) {
    ## TODO: update once the client is ready to receive it
    rcap.updateVariable(private$variableName, value) ##, pos_values)
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
