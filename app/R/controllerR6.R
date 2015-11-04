
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
  variables <- unique(na.omit(variables))
  predList <- lapply(
    private$controls,
    function(x) x$dependentVariables(variables)
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

  self$updateInOrder(needsUpdate, values)
}


controllerUpdateInOrder <- function(self, private, ids, values) {
  for (id in ids) private$controls[[id]]$update(values[[id]])

  invisible(self)
}

## Extract the updated control ids and new values from the JSON
## message from the client. Ids will be names, values will be the
## contents of the result list.

parseUpdateJson <- function(json) {
  ## TODO
}
