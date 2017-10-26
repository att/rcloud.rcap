
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
#' \code{updateInOrder(ids)} update the controls in
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
      controllerInitUpdate(self, private, controls),

    getUpdateGraph = function()
      controllerGetUpdateGraph(self, private),
    
    getProfileVariables = function()
      controllerGetProfileVariables(self, private),
    
    getControls = function()
      controllerGetControls(self, private)
  ),

  private = list(
    controls = NULL,                    # controls
    profileVariables = NULL,            # profile variables
    succList = list(),                  # dependency graph
    topoSort = character(),             # update order of controls

    ## Update these controls, in the specified order
    updateInOrder = function(ids)
      controllerUpdateInOrder(self, private, ids),

    ## Update the output size of plot controls
    updatePlotSizes = function(controls)
      controllerUpdatePlotSizes(self, private, controls),

    # Use the topological sort order to update every control
    updateAll = function()
      controllerUpdateAll(self, private)
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
  userDefinedOrder <- lapply(
    private$controls,
    function(x) {
      if(is.null(x$getOrder())) {
        return(NA_character_)
      } else {
        return(x$getOrder())
      }
    }
  )
  ## We have the dependency variables, but we need the control names,
  ## actually
  predList <- lapply(
    predList,
    function(x) { names(private$controls)[match(x, variables)] }
  )
  ## Pre-calculate the order of control updates
  ## We reverse the order, so that plots/maps on the first
  ## page(s) show up first
  predList <- rev(predList)
  userDefinedOrder <- rev(userDefinedOrder)
  
  rcap.consoleMsg(paste0("Reverse order ", paste(predList, collapse = ", ")))
  rcap.consoleMsg(paste0("Reverse order ordering def", paste(userDefinedOrder, collapse = ", ")))
  
  # Consider ordering specified by dashboard designer
  predList <- predList[sort.list(unlist(userDefinedOrder))]
  rcap.consoleMsg(paste0("Ordered ", paste(predList, collapse = ", ")))

  private$succList <- twistAdjlist(predList)

  private$topoSort <- topologicalSort(private$succList)

  # Wait until the front end reports sizes before updating everything

  invisible(self)
}

controllerGetProfileVariables <- function(self, private) {
  Filter(function(x) { x$getType() == 'profileVariable'}, private$controls)
}

controllerGetControls <- function(self, private) {
  private$controls
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

  ## Set variables to the values updated on the front-end
  for (id in names(controls)) {
    private$controls[[id]]$setVariable(controls[[id]])
  }

  ## Push updates to the frontend
  private$updateInOrder(needsUpdate)
}

controllerInitUpdate <- function(self, private, controls) {
  ## The client should report all of the plot sizes
  private$updatePlotSizes(controls)

  ## Now update everything
  private$updateAll()
}

controllerUpdateInOrder <- function(self, private, ids) {
  for (id in ids) private$controls[[id]]$update()
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

controllerUpdateAll <- function(self, private) {
  ## Update everything
  private$updateInOrder(private$topoSort)

  invisible(self)
}

controllerGetUpdateGraph <- function(self, private) {
  vertices <- dataFrame(
    name = names(private$controls),
    type = vapply(private$controls, function(x) x$getType(), ""),
    variable =
      vapply(private$controls, function(x) x$getVariableName(), ""),
    func =
      vapply(private$controls, function(x) x$getControlFunctionName(), "")
  )

  edges <- dataFrame(
    row.names = NULL,
    from = rep(names(private$succList), vapply(private$succList, length, 1L)),
    to   = unlist(private$succList)
  )

  ## Drop forms, they are just placeholders
  forms <- vertices$name[ vertices$type == "form" ]
  forms <- forms[ ! forms %in% edges$from & ! forms %in% edges$to ]
  vertices <- vertices[ ! vertices$name %in% forms, ]

  list(vertices = vertices, edges = edges)
}

## Extract the updated control ids and new values from the JSON
## message from the client. Ids will be names, values will be the
## contents of the result list.
#' @importFrom jsonlite fromJSON

parseUpdateJson <- function(json) {
  controls <- fromJSON(json, simplifyVector = FALSE)

  structure(
    lapply(controls$updatedVariables, "[[", "value"),
    names = vapply(controls$updatedVariables, "[[", "", "controlId")
  )
}

## Extract the updated plot sizes and IDs from the JSON
## message from the client. Ids will be names, widths and heights
## will be a named vector
#' Get plot sizes from JSON
#'
#' Parse the JSON string sent from the client, find the plot IDs and sizes, and
#' return as a neat R object.
#'
#' @param json A JSON string from the client. Must have an element named plotSizes
#' @return List with control IDs as names and named vector of widths and heights
#' as list items.
#' @importFrom jsonlite fromJSON

parseSizesJson <- function(json) {
  controls <- fromJSON(json, simplifyVector = FALSE)

  ## TODO: should this be one call with parseUpdateJson?
  ## The structure is a little different
  structure(
    lapply(
      controls$plotSizes,
      function(x) c(width = x$width, height = x$height)
    ),
    names = vapply(controls$plotSizes, "[[", "", "id")
  )
}
