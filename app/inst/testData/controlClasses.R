library(R6)
library(jsonlite)

rcapConfig <- 

Control <- R6Class("Control",
                  public = list(
                    id = NA,     # eg rcapac34a must match the update function name
                    type = NA,   # rplot etc
                    
                    # Many controls are associated with a data object
                    object=NULL, # The name of a variable in the global environment
                    
                    # Many controls are associated with a function
                    controlFunction,
                    
                    # Out an in-coming edges from the dependency graph
                    downStream = list(),
                    upStream = list(),
                    
                    #### METHODS ####
                    
                    initialize = function(id, type) {
                      if (!missing(id)) self$id <- id
                      if (!missing(type)) self$type <- type
                    },
                    
                    update = function() {
                      if(is.function(get(self$id))) {
                        do.call(self$id, list())
                      }
                    }
                  )
)

# Could create the objects from a list of names
controlIDs <- c("rcap1", "rcap2", "rcap3")
controls <- lapply(controlIDs, Control$new, "rplot")
controls

# Or we could parse straight from the JSON


# Remember this
library(codetools)
findGlobals(abPlot)
