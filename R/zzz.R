
#' @import rcloud.htmlwidgets
NULL

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
      updateAllControls = make_oc(updateAllControls),
      getUserProfileVariableValues = make_oc(getUserProfileVariableValues),
      getRCAPVersion = make_oc(getRCAPVersion),
      getRCAPStyles = make_oc(getRCAPStyles)
   )

    rcloud.rcap.caps$init(ocaps, rcapSessionInfo())
  }
}

make_oc <- function(...) {
  do.call(base::`:::`, list("rcloud.support", "make.oc"))(...)
}

rcap.initViewer <- function(content, themeExists, sessionInfo) rcloud.rcap.caps$initViewer(content, themeExists, sessionInfo)
rcap.consoleMsg <- function(content) rcloud.rcap.caps$consoleMsg(content)
rcap.updateVariable <- function(...) rcloud.rcap.caps$updateVariable(...)
rcap.updateControl <- function(...) rcloud.rcap.caps$updateControl(...)
rcap.updateControlAttribute <- function(controlId, attributeName, attributeValue) {
  rcloud.rcap.caps$updateControlAttribute(controlId, attributeName, attributeValue)
}
rcap.resizeHtmlwidget <- function(...) rcloud.rcap.caps$resizeHtmlwidget(...)
rcap.getRCAPVersion <- function() rcloud.rcap.caps$getRCAPVersion()
rcap.user.profile.store.getValue <- function(...) rcloud.rcap.caps$getUserProfileValue(...)
rcap.user.profile.store.setValue <- function(...) rcloud.rcap.caps$setUserProfileValue(...)
rcap.user.profile.store.list.variables <- function(...) rcloud.rcap.caps$listUserProfileVariables(...)