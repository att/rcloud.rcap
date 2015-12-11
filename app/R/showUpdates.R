
#' @export

showUpdates <- function(rcapConfigFileName = "rcap_designer.json",
                        mar = c(0, 7, 0, 5) + 0.2, ...) {

  ## Only run in edit mode
  if (!isEditMode()) return(invisible())

  ## We also need the sankey package
  if (!havePackage("sankey")) {
    stop("you need the 'sankey' package for update plots")
  }

  ## Retrieve the designer config from the notebook
  rcapJson <- rcloud.get.asset(name = rcapConfigFileName)

  ## Convert the JSON into a list
  rcapConfig <- jsonlite::fromJSON(rcapJson, simplifyVector = FALSE)

  ## Create controller object. This does not do any updates
  ## until contacted from the front end, so it is perfect for us
  cnt <- Controller$new(rcapConfig)

  ## This is the graph
  graph <- cnt$getUpdateGraph()

  ## Create better labels
  graph$vertices$label <- with(
    graph$vertices,
    setGraphLabel(type, variable, func)
  )

  print(graph$vertices)

  ## Create and do the sankey plot
  sp <- sankey::make_sankey(graph$vertices, graph$edges)
  sankey::sankey(sp, mar = mar, ...)
}

setGraphLabel <- function(type, variable, func) {
  ifelse(
    !is.na(variable) & !is.na(func),
    paste0(type, "\n", variable, " -> ", func, "()"),
  ifelse(
    is.na(variable) & is.na(func),
    type,
  ifelse(
    is.na(variable),
    paste0(type, "\n-> ", func, "()"),
    paste0(type, "\n", variable, " ->")
  )))
}
