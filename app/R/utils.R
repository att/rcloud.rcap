
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


#' Create unique IDs for tables which have differenct colours
#'
#' We need to generate unique IDs for the columns of tables which are requested
#' to have a background colour 
createTableIdDf <- function (options, colNames) {
  # Generate a dataframe of rightAlign table class names
  if (!is.null(options$rightAlign)) {
    colRightIds <- data.frame("targets" = options$rightAlign, 
                              "classNameRight" = "dt-body-right",
                              stringsAsFactors = FALSE)
  } else {
    colRightIds <- data.frame("targets" = NA,
                              "classNameRight" = NA)
  }
  
  # Generate a dataframe of colour table class names
  if (!is.null(options$columnColor)) {
    numRandIds <- length(match(names(options$columnColor), colNames) - 1)
    colColorIds <- data.frame(
      "targets"   = names(options$columnColor),
      "classNameColor" = replicate(numRandIds, randomId(prefix = "dt-col-")),
      "background-color" = options$columnColor,
      stringsAsFactors = FALSE,
      check.names = FALSE)
  } else {
    colColorIds <- data.frame("targets" = NA,
                              "classNameColor" = NA)
  }
  
  # Merge together the class names to create unique class names
  targetsDf <- merge(colRightIds, colColorIds, by = "targets", all = TRUE)
  targetsDf$classNameRight <- with(targetsDf, 
                                   replace(classNameRight, 
                                           is.na(classNameRight), ""))
  targetsDf$classNameColor <- with(targetsDf, 
                                   replace(classNameColor, 
                                           is.na(classNameColor), ""))
  targetsDf$className <- with(targetsDf, paste(classNameRight, classNameColor))
  targetsDf$className <- gsub("^ |[ \t]+$", "", targetsDf$className)
  targetsDf[complete.cases(targetsDf), -c(2, 3)]
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
