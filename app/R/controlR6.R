
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
  if (!is.null(new_value) && !is.null(private$variableName)) {
    assign(private$variableName, new_value, envir = rcloudEnv())
  }

  ## Update frontend, if the variable is not set in the notebook,
  ## we'll leave it at the default value, as specified in the JSON
  if (!is.null(private$variableName) &&
       exists(private$variableName, envir = rcloudEnv())) {
    value <- get(private$variableName, envir = rcloudEnv())
    rcap.updateVariable(private$variableName, value)
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
