library(R6)
library(jsonlite)

rcapConfig <- 

Control <- R6Class("Control",
                  public = list(
                    id = NA,     # eg rcapac34a must match the update function name
                    type = NA,   # rplot etc
                    object=NULL, # The name of a variable in the global environment
                    
                    downStream = list(),
                    upStream = list(),
                    
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

controlIDs <- c("rcap1", "rcap2", "rcap3")



controls <- lapply(controlIDs, Control$new, "rplot")
controls
