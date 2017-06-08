
is.empty.or.null <- function(x) {
  is.null(x) || x == "" || length(x) == 0
}

#' @export
rcap.getUserProfileValue <- function(var=NULL, val=NULL) {
  if(is.empty.or.null(var)) {
    return (invisible(NULL))
  }
  profileVal <- user.profile.store.getValue(var)
  if(is.empty.or.null(profileVal)) {
    return (val)
  }
  if(is.empty.or.null(val)) {
    return(profileVal)
  }
  return(intersect(profileVal, val))
}

user.profile.store.getValue <- function(var) {
  json <- rcap.user.profile.store.getValue(var)
  if(!is.null(json)) {
    return (fromJSON(json, simplifyVector = FALSE))
  }
  return(NULL);
}

user.profile.store.setValue <- function(var, value) {
  rcap.user.profile.store.setValue(var, value)
  return(NULL);
}

#' @export
rcap.setUserProfileValue <- function(var=NULL, val=NULL) {
  if(is.empty.or.null(var)) {
    return (invisible(NULL))
  }
  if(is.empty.or.null(val)) {
    user.profile.store.setValue(var, NULL)
    return (invisible(NULL))
  }
  user.profile.store.setValue(var, val)
  return (invisible(NULL))
}

#' @export
rcap.deleteUserProfileValue <- function(var=NULL) {
  if(is.empty.or.null(var)) {
    return (invisible(NULL))
  }
  user.profile.store.setValue(var, NULL)
  return (invisible(NULL))
}

#' export
rcap.listUserProfileVariables <- function() {
  json <- rcap.user.profile.store.list.variables()
  if(!is.null(json)) {
    return (fromJSON(json, simplifyVector = FALSE))
  }
  return(c())
}
