
user.profile.variable.key <- function(variable)
{
  user <- rcloud.session.info()$user
  notebook <- rcloud.session.notebook.id()
  rcs.key(".notebook", notebook, "user.profile", user, variable)
}

is.empty.or.null <- function(x) {
  is.null(x) || x == "" || length(x) == 0
}

#' @export
rcap.getUserProfileValue <- function(var=NULL, val=NULL) {
  if(is.empty.or.null(var)) {
    return (invisible(NULL))
  }
  profileVal <- rcs.get(user.profile.variable.key(var))
  if(is.empty.or.null(profileVal)) {
    return (val)
  }
  if(is.empty.or.null(val)) {
    return(profileVal)
  }
  return(intersect(profileVal, val))
}

#' @export
rcap.setUserProfileValue <- function(var=NULL, val=NULL) {
  if(is.empty.or.null(var)) {
    return (invisible(NULL))
  }
  if(is.empty.or.null(val)) {
    rcs.rm(user.profile.variable.key(var))
    return (invisible(NULL))
  }
  rcs.set(user.profile.variable.key(var), val)
  return (invisible(NULL))
}

#' @export
rcap.deleteUserProfileValue <- function(var=NULL) {
  if(is.empty.or.null(var)) {
    return (invisible(NULL))
  }
  rcs.rm(user.profile.variable.key(var))
  return (invisible(NULL))
}

#' @export
rcap.listUserProfileVariables <- function() {
  user <- rcloud.session.info()$user
  notebook <- rcloud.session.notebook.id()
  gsub(rcs.key(".notebook", notebook, "user.profile", user, ""), '', 
       rcs.list(rcs.key(".notebook", notebook, "user.profile", user, "*")))
}