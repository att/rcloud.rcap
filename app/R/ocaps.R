
#' Find all functions in the rcloud environment
#'
#' The rcloud environment is the environment the notebook
#' runs in. This is currently the global environment, i.e. .GlobalEnv.
#'
#' This function is used by the designer, to provide suggestions
#' whenever the designer user needs to supply an R function name;
#' E.g. when creating an R plot, the function that does the plotting,
#' or when a dropdown is populated by an R function.
#'
#' @return A character vector of function names

rcloud.rcap.global.functions <- function() {

  ## Get all objects
  globalObjects <- ls(envir = rcloudEnv())

  ## Keep the functions
  Filter(
    function(x) is.function(get(x, envir = rcloudEnv())),
    globalObjects
  )
}
