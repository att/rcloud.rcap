
#' List of OCAPS
#'
#' \itemize{
#'   \item \code{getRFunctions} Query all R functions in the
#'     rcloud environment. It calls
#'     \code{\link{rcloud.rcap.global.functions}}.
#'   \item \code{getRTime} Query the current time of the R interpreter.
#'     This is used for debugging.
#'   \item \code{updateControls} Send an update request from the
#'     front-end to the back-end. It calls the \code{update} method
#'     of the Controller.
#' }

rcloud.rcap.caps <- NULL

.onLoad <- function(libname, pkgname)
{
  f <- function(module.name, module.path) {
    path <- system.file("javascript", module.path, package="rcloud.rcap")
    caps <- rcloud.support::rcloud.install.js.module(module.name,
                                     paste(readLines(path), collapse='\n'))
    caps
  }
  rcloud.rcap.caps <<- f("rcloud.rcap", "rcloud.rcap.js")
  if(!is.null(rcloud.rcap.caps)) {
    
    ocaps <- list(
      getRFunctions = make_oc(rcloud.rcap.global.functions),
      getRTime = make_oc(function() { Sys.time() }),
      updateControls = make_oc(updateController),
      updateAllControls = make_oc(updateAllControls)
    )

    rcloud.rcap.caps$init(ocaps)
  }
}

make_oc <- function(...) {
  do.call(base::`:::`, list("rcloud.support", "make.oc"))(...)
}

rcap.initViewer <- function(content, sessionInfo) rcloud.rcap.caps$initViewer(content, sessionInfo)
rcap.consoleMsg <- function(content) rcloud.rcap.caps$consoleMsg(content)
rcap.updateVariable <- function(...) rcloud.rcap.caps$updateVariable(...)
rcap.updateControlAttribute <- function(controlId, attributeName, attributeValue) {
  rcloud.rcap.caps$updateControlAttribute(controlId, attributeName, attributeValue)
}
