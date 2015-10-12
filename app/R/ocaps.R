# All the functions in here are to be exposed to the client side

#' Find all functions in global environment
#'
#' @return A character vector of function names
#' @export
#'
#' @examples
#' f <- function(x) {x}
#' g <- "not a function"
#' rcloud.rcap.global.functions()
rcloud.rcap.global.functions <- function() {
  
  # Get all objects
  globalObjects <- ls(name=".GlobalEnv")
  
  # Is the object with a charater name a function?
  getFunctions <- function(x) {is.function(get(x))}

  # Logical of which objects are functions
  whichFunctions <- sapply(globalObjects, getFunctions)
  
  # Assume nothing
  functionList <- vector(mode="character", length=0)
  
  if (length(whichFunctions) > 0) {
    if (sum(whichFunctions)>0) {
      functionList <- globalObjects[whichFunctions]
    }
  }
  
  return(functionList)
  
}


