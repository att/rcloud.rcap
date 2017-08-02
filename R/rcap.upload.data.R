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

#' @export
rcap.createUploadDir <- function(variableName, datasetName) {
  if(haveController()) {
    parentPath <- rcap.getDataUploadPath(variableName)
    if(length(grep("/", datasetName)) > 0) {
      stop("Dataset name invalid, it can't contain '/'")
    }
    path <- file.path(parentPath, datasetName)
    if(!dir.exists(path)) {
      if(!dir.create(path, recursive = TRUE)) {
        stop("Could not create directory.")
      }
    } else {
      if(!file.info(path)$isdir) {
        stop("Location already exists and it is a file.")
      }
    }
    return(path)
  } else {
    stop("Illegal state, can't perform this operation outside RCAP view.")
  }
}