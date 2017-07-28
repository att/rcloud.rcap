#' @export
rcap.getDataUploadPath <- function(variableName) {
  if(haveController()) {
    cnt <- get("rcapController", envir = rcapEnv)
    control <- Filter(function(x) {x$getVariableName()==variableName}, cnt$getControls())
    if(length(control)!=1) {
      stop(paste0("Control for variable '", variableName, "' not found!"));
    }
    control <- control[[1]]
    return(control$getPath())
  } else {
    return(get(variableName, envir = rcloudEnv()))
  }
}