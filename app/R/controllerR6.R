
#' Orchestrate the updates of the controls in the back-end
#'
#' @section Methods:
#'
#' \code{initialize(rcapConfig)} The object is constructed from the
#'   parsed designer JSON configuration file.
#'
#' \code{update(controls)} update some controls. The argument is the
#'   JSON of the update request from the front-end.
#'
#' @section Private methods and variables:
#'
#' \code{controls} named list of all controls, \code{Control} objects.
#'
#' \code{succList} the adjacency list representation of the control
#'   dependency graph. This is used at initialization to calculate the
#'   update order, and at each update to decide which other controls
#'   must be updated.
#'
#' \code{topoSort} ids of all controls, in topological (i.e. update) order.
#'
#' \code{updateInOrder(ids, values)} update the controls in
#'   the specified order, with the specified values. This function is
#'   called to perform the actual updates, once the order is decided
#'   based on the topological sorting.
#'
#' @importFrom R6 R6Class

Controller <- R6::R6Class("Controller",
  public = list(

    initialize = function(rcapConfig)
      controllerInitialize(self, private, rcapConfig),

    update = function(controls)
      controllerUpdate(self, private, controls)
  ),

  private = list(
    controls = NULL,                    # controls
    succList = list(),                  # dependency graph
    topoSort = character(),             # update order of controls

    ## Update these controls, in the specified order
    updateInOrder = function(ids, values)
      controllerUpdateInOrder(self, private, ids, values)
  )
)

controllerInitialize <- function(self, private, rcapConfig) {

  ## List of the controls (from JSON)
  allControls <- getControls(rcapConfig)

  ## Create the objects from the JSON
  private$controls <- lapply(allControls, controlFactory)

  ## Use the ids to name the list items
  names(private$controls) <-
    vapply(private$controls, function(x) x$getId(), "")

  ## Initialize dependency list
  variables <- vapply(private$controls, function(x) x$getVariableName(), "")
  predList <- lapply(
    private$controls,
    function(x) x$dependentVariables(unique(na.omit(variables)))
  )
  ## We have the dependency variables, but we need the control names,
  ## actually
  predList <- lapply(
    predList,
    function(x) { names(private$controls)[match(x, variables)] }
  )

  private$succList <- twistAdjlist(predList)

  ## Pre-calculate the order of control updates
  private$topoSort <- topologicalSort(private$succList)

  ## Update everything
  private$updateInOrder(private$topoSort, values = NULL)

  invisible(self)
}

controllerUpdate <- function(self, private, controls) {
  controls <- parseUpdateJson(controls)

  ## what to update
  needsUpdate <- bfs(private$succList, names(controls))

  ## in what order
  needsUpdate <- needsUpdate[order(match(needsUpdate, private$topoSort))]

  ## with these new values
  values <- structure(
    replicate(length(needsUpdate), NULL),
    names = needsUpdate
  )
  values[names(controls)] <- controls

  private$updateInOrder(needsUpdate, values)
}


controllerUpdateInOrder <- function(self, private, ids, values) {
  for (id in ids) private$controls[[id]]$update(values[[id]])

  invisible(self)
}

## Extract the updated control ids and new values from the JSON
## message from the client. Ids will be names, values will be the
## contents of the result list.
#' @importFrom jsonlite fromJSON

parseUpdateJson <- function(json) {
  controls <- fromJSON(json, simplifyVector = FALSE)

  ## TODO: this is a single update for now
  structure(
    list(controls$updatedVariables[[1]]$value),
    names = controls$updatedVariables[[1]]$controlId
  )
}
