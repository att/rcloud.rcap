
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
      controllerUpdate(self, private, controls),
    
    initUpdate = function(controls)
      controllerInitUpdate(self, private, controls)
  ),

  private = list(
    controls = NULL,                    # controls
    succList = list(),                  # dependency graph
    topoSort = character(),             # update order of controls

    ## Update these controls, in the specified order
    updateInOrder = function(ids, values)
      controllerUpdateInOrder(self, private, ids, values),
    
    ## Update the output size of plot controls
    updatePlotSizes = function(controls)
      controllerUpdatePlotSizes(self, private, controls),

    # Use the topological sort order to update every control
    updateAll = function(values)
      controllerUpdateAll(self, private, values)
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

  # Wait until the front end reports sizes before updating everything

  invisible(self)
}

controllerUpdate <- function(self, private, controls) {
  
  # Client reports all plot sizes
  # Extract these from the input
  private$updatePlotSizes(controls)
  
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

controllerInitUpdate <- function(self, private, controls) {
  # The client should report all of the plot sizes
  private$updatePlotSizes(controls)

  # TODO: Could controls contain some initial values?
  values <- NULL

  # Now update everything
  private$updateAll(values)
}

controllerUpdateInOrder <- function(self, private, ids, values) {
  for (id in ids) private$controls[[id]]$update(values[[id]])

  invisible(self)
}

controllerUpdatePlotSizes <- function(self, private, controls) {

  # Extract the sizes from the JSON
  controlSizes <- parseSizesJson(controls)

  for (id in names(controlSizes)) {
    private$controls[[id]]$updateSize(controlSizes[[id]])
  }
  
  invisible(self)
}

controllerUpdateAll <- function(self, private, values) {
  ## Update everything
  private$updateInOrder(private$topoSort, values = values)

  invisible(self)
}

## Extract the updated control ids and new values from the JSON
## message from the client. Ids will be names, values will be the
## contents of the result list.
#' @importFrom jsonlite fromJSON

parseUpdateJson <- function(json) {
  controls <- fromJSON(json, simplifyVector = FALSE)

  if(!is.null(controls$updatedVariables)) {
    return(structure(
      lapply(controls$updatedVariables, function(x) x$value),
      names = sapply(controls$updatedVariables, function(x) x$controlId)
    ))
  } else {
    return(list())
  }
}

## Extract the updated plot sizes and IDs from the JSON
## message from the client. Ids will be names, widths and heights
## will be a named vector
#' @return List with control IDs as names and named vector of widths and heights
#' as list items.
#' @importFrom jsonlite fromJSON

parseSizesJson <- function(json) {
  controls <- fromJSON(json, simplifyVector = FALSE)
  
  ## TODO: should this be one call with parseUpdateJson?
  ## The structure is a little different
  if(!is.null(controls$plotSizes)) {
    return(structure(
      lapply(controls$plotSizes, function(x) c(width=x$width, height=x$height)),
      names = sapply(controls$plotSizes, function(x) x$id)
    ))
  } else {
    return(list())
  }
}

