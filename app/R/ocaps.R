# All the functions in here are to be exposed to the client side

#' Find all functions in global environment
#'
#' @return A character vector of function names
#' @export
#' @examples
#' f <- function(x) {x}
#' g <- "not a function"
#' rcloud.rcap.global.functions()

rcloud.rcap.global.functions <- function() {
  
  ## Get all objects
  globalObjects <- ls(envir = rcloudEnv())

  ## Keep the functions
  Filter(
    function(x) is.function(get(x, envir = rcloudEnv())),
    globalObjects
  )
}
