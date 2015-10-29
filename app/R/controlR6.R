
Control <- R6::R6Class("Control",

  public = list(

    ## Build the object from the input json
    ## cl is the json for the control converted to a list
    initialize = function(cl)
      controlInitialize(self, private, cl),

    getId = function() private$id %||% NA_character_,
    getVariableName = function() private$variableName %||% NA_character_,

    update = function()
      controlUpdate(self, private),

    dependentVariables = function(clientVars)
      controlDependentVariables(self, private, clientVars),

    addDownStream = function(downControl)
      controlAddDownStream(self, private, downControl),

    addUpstream = function(upControl)
      controlAddUpstream(self, private, upcontrol)
  ),

  private = list(

    id = NULL,     # eg rcapac34a
    type = NULL,   # rplot etc
    json = NULL,   # The list as returned from JSON

    ## Control Properties
    controlFunction = NULL,
    variableName = NULL,
    ocapFunction = NULL,

    ## Out an in-coming edges from the dependency graph
    downStream = list(),
    upStream = list()
  )
)

controlInitialize <- function(self, private, cl) {

  if (!is.null(cl$id)) private$id <- cl$id
  if (!is.null(cl$type)) private$type <- cl$type

  ## Grab the code if it's there
  if (!is.null(cl$controlProperties)) {
    if (length(cl$controlProperties) > 0) {
      ## Pulling various properties
      for (cp in cl$controlProperties) {
        if (cp$uid == "code") private$controlFunction <- cp$value
        if (cp$uid == "variablename") private$variableName <- cp$value
      }
    }
  }

  ## Copy the input list for future reference
  private$json <- cl
  if (!is.null(private$type)) attr(private$json, "class") <- private$type

  private$ocapFunction <- processControl(private$json)

  invisible(self)
}

controlUpdate <- function(self, private) {
  ## Call the ocap
  ## Fix the environment
  if (is.function(get(private$ocapFunction))) {
    do.call(private$ocapFunction, list())
  }
}

## Compare the variables that are client side to those used in the function
## Return the matches
#' @importFrom codetools findGlobals

dependentVariables = function(clientVars) {

  varsUsed <- character(0)

  if (!is.null(private$controlFunction) &&
       exists(private$controlFunction) &&
       is.function(get(private$controlFunction))) {
    varsUsed <- codetools::findGlobals(get(private$controlFunction))
  }

  ## Only choose from client variables
  clientVars[clientVars %in% varsUsed]
}


## Add a control that should update when this one does
contolAddDownStream <- function(self, private, downControl) {
  private$downStream <- append(private$downStream, downControl)
  invisible(self)
}

## Add a control that causes this one to update
controlAddUpStream <- function(self, private, upControl) {
  private$upStream <- append(private$upStream, upControl)
  upControl$addDownStream(self)
  invisible(self)
}
