rcloud.rcap.caps <- NULL

.onLoad <- function(libname, pkgname)
{
  f <- function(module.name, module.path) {
    path <- system.file("javascript", module.path, package="rcloud.rcap")
    caps <- rcloud.install.js.module(module.name,
                                     paste(readLines(path), collapse='\n'))
    caps
  }
  rcloud.rcap.caps <<- f("rcloud.rcap", "rcloud.rcap.js")
  if(!is.null(rcloud.rcap.caps)) {
    ocaps <- list()
    rcloud.rcap.caps$init(ocaps)
  }
}
