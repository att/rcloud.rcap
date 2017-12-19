#' @title Retrieve path associated with data upload control
#' 
#' @param variableName the name of the variable linked with data upload control
#' @return path where datasets are uploaded to
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

#' @title List datasets uploaded to given data upload control
#' 
#' @param variableName the name of the variable linked with data upload control
#' @return list of datasets uploaded with the data upload control
#' @export
rcap.ls.datasets <- function(variableName) {
  return(dir(rcap.getDataUploadPath(variableName)))
}

#' @title List files uploaded to given dataset
#' 
#' @param variableName the name of the variable linked with data upload control
#' @param datasetname the name of the dataset of which files should be listed
#' @return list of files uploaded to the dataset, empty if dataset with given name does not exist
#' @export
rcap.ls.dataset.files <- function(variableName, datasetname) {
  if(is.null(datasetname) || str_length(datasetname) == 0) {
    return(list())
  } 
  datasets <- rcap.ls.datasets(variableName)
  if(datasetname %in% datasets) {
    return(dir(file.path(rcap.getDataUploadPath(variableName), datasetname)))
  }
  return(list())
}
#' @title Create upload directory
#' 
#' @param variableName the name of the variable linked with data upload control
#' @param datasetname the name of the dataset of which files should be listed
#' @return path to created dataset directory
#' @export
rcap.createUploadDir <- function(variableName, datasetName) {
  if(haveController()) {
    parentPath <- rcap.getDataUploadPath(variableName)
    if(length(grep("/", datasetName)) > 0) {
      stop("Dataset name invalid, it can't contain '/'")
    }
    path <- file.path(parentPath, datasetName)
    
    if(!dir.exists(parentPath)) {
      if(!dir.create(parentPath, recursive = TRUE )) {
        stop("Could not create directory.")
      } else {
        if(rcap.settings.is_set("newDirectoryMode") && !is.null(rcap.settings.get("newDirectoryMode"))) {
          Sys.chmod(parentPath, mode = rcap.settings.get("newDirectoryMode"), use_umask = rcap.settings.get("useUmask"))
        }
      }
    } else {
      if(!file.info(parentPath)$isdir) {
        stop("Location already exists and it is a file.")
      }
    }
    
    if(!dir.exists(path)) {
      if(!dir.create(path, recursive = TRUE )) {
        stop("Could not create directory.")
      } else {
        if(rcap.settings.is_set("newDirectoryMode") && !is.null(rcap.settings.get("newDirectoryMode"))) {
          Sys.chmod(path, mode = rcap.settings.get("newDirectoryMode"), use_umask = rcap.settings.get("useUmask"))
        }
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

.rcap.upload.state <- new.env()

rcap.upload.create.file <- function(filename, force=FALSE) {
  .rcap.upload.state$file <- filename
  rcloud.upload.create.file(filename, force)
}

rcap.upload.close.file <- function()
{
  rcloud.upload.close.file()
  if(rcap.settings.is_set("newFileMode") && !is.null(rcap.settings.get("newFileMode")) && !is.null(.rcap.upload.state$file)) {
    Sys.chmod(.rcap.upload.state$file, mode = rcap.settings.get("newFileMode"), use_umask = rcap.settings.get("useUmask"))
  }
  .rcap.upload.state$file <- NULL
}