
Control <- R6::R6Class("Control",

  public = list(

    ## Build the object from the input json
    ## cl is the json for the control converted to a list
    initialize = function(cl)
      controlInitialize(self, private, cl),

    getId = function() private$id %||% NA_character_,
    getVariableName = function() private$variableName %||% NA_character_,

    ## Got a new value from the frontend, update var, all dependencies
    update = function(new_value)
      controlUpdate(self, private),

    ## Need to push a value from the server to client,
    ## this happens for example when we initialize
    ## based on the values in the notebook
    updateFrontend = function() { },

    dependentVariables = function(clientVars, envir = .GlobalEnv)
      controlDependentVariables(self, private, clientVars, envir)
  ),

  private = list(

    id = NULL,     # eg rcapac34a
    type = NULL,   # rplot etc
    json = NULL,   # The list as returned from JSON

    ## Control Properties
    controlFunction = NULL,
    variableName = NULL,
    ocapFunction = NULL,

    ## Update the sever side variable associated with the
    ## control, to the value that we got from the frontend
    updateVariable = function(new_value)
      controlUpdateVariable(self, private, new_value)
  )
)

controlInitialize <- function(self, private, cl) {

  if (!is.null(cl$id)) private$id <- cl$id
  if (!is.null(cl$type)) private$type <- cl$type

  ## Grab the code if it's there
  if (!is.null(cl$controlProperties) &&
       length(cl$controlProperties) > 0) {
    ## Pulling various properties
    for (cp in cl$controlProperties) {
      if (cp$uid == "code") private$controlFunction <- cp$value
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
  private$updateVariable(new_value)

  ## Call the ocap
  if (!is.null(private$ocapFunction)) {
    f <- get(private$ocapFunction, envir = .GlobalEnv)
    do.call(f, list(), envir = .GlobalEnv)

    ## We only update the frontend, if something was calculated
    ## Otherwise we might get into an infinite loop
    self$updateFrontend()
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


## This very much depends on the control type.
## Input-like types call rcap.updateControl.
## Output-like types will push HTML to the frontend

controlUpdateFrontend <- function(self, private) {
}


controlUpdateVariable <- function(self, private, new_value) {
  if (!is.null(private$variableName)) {
    assign(private$variableName, new_value, envir = .GlobalEnv)
  }

  invisible(self)
}
