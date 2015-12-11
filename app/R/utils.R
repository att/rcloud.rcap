
#' Evaluate rhs if lhs is NULL
#'
#' @param l Left hand side, evaluate this first.
#' @param r Right had side, only evaluate it if \code{l} is \code{NULL}.
#' @return \code{l} if it is not \code{NULL}, otherwise \code{r}.
#' @name or

`%||%` <- function(l, r) {
  if (is.null(l)) r else l
}

#' The environment the notebook and mini.html are run in
#'
#' This environment is used to search for functions that are used
#' to update the dashboard, and for variables that are associated
#' with dashboard controls.
#'
#' This is currently the global environment.
#'
#' @return An environment.

rcloudEnv <- function() .GlobalEnv

#' Return relevant session info in a named list
#'
#' This information is returned to the front end
#' @return A list with username and nodename (host)
#'
#' @export

rcapSessionInfo <- function() {

  list(user=Sys.info()[c("user")],
       nodename=toupper(Sys.info()["nodename"]))

}


havePackage <- function(package) {
  requireNamespace(package, quietly = TRUE)
}


dataFrame <- function(..., stringsAsFactors = FALSE) {
  data.frame(
    stringsAsFactors = stringsAsFactors,
    ...
  )
}
