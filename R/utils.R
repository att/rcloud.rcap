
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

randomId <- function(prefix = "x") {
  rand <- sample(c(letters, 0:9), 8, replace = TRUE)
  paste(c(prefix, rand), collapse = "")
}

#' Return the RCAP version number
#'
#' Check the version number of the loaded package, otherwise check the
#' version installed on the disk.
getRCAPVersion <- function() {
  tryCatch(
    paste0("v", asNamespace("rcloud.rcap")$`.__NAMESPACE__.`$spec[["version"]]),
    error = function(c) {
      paste0("v", packageDescription("rcloud.rcap", fields = "Version"))
    } 
  )
}

pasteEmpty <- function(...) {
  args <- list(...)
  argsLens <- vapply(args, length, 1L)
  if (any(argsLens == 0)) {
    c()
  } else {
    paste0(...)
  }
}

with_options <- function(new, code) {
  old <- set_options(new)
  on.exit(set_options(old))
  force(code)
}

set_options <- function(opts) {
  do.call(options, as.list(opts))
}

rcap.settings.list <- function() {
  ls(envir = rcloud.rcap.settings)
}

rcap.settings.set <- function(name, value) {
  assign(name, value, envir = rcloud.rcap.settings)
}

rcap.settings.is_set <- function(name) {
  exists(name, where = rcloud.rcap.settings)
}

rcap.settings.get <- function(name) {
  get(name, envir = rcloud.rcap.settings)
}