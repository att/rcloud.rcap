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
    
    #ocaps <- list(getRFunctions = rcloud.support:::make.oc(rcloud.rcap.global.functions))

    ocaps <- list(
      getRFunctions = make_oc(rcloud.rcap.global.functions),
      getDummyFunctions = make_oc(function() { list("funky1", "funky2", "funky2000" ) }),
      getRTime = make_oc(function() { Sys.time() })
    )

    rcloud.rcap.caps$init(ocaps)
  }
}

make_oc <- function(...) {
  do.call(base::`:::`, list("rcloud.support", "make.oc"))(...)
}

rcap.initViewer <- function(content) rcloud.rcap.caps$initViewer(content)
rcap.consoleMsg <- function(content) rcloud.rcap.caps$consoleMsg(content)
