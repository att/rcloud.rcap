library(R6)
library(jsonlite)

rcapConfig <- jsonlite::fromJSON(system.file("testData/testConfig.json", package="rcloud.rcap"), simplifyVector = FALSE)

allControls <- getControls(rcapConfig)

Control <- R6::R6Class("Control",
                  public = list(
                    id = NA,     # eg rcapac34a
                    type = NA,   # rplot etc
                    json = NA,   # The list as returned from JSON
                    
                    # Many controls are associated with a data object
                    object=NULL, # The name of a variable in the global environment
                    
                    # Many controls are associated with a function
                    controlFunction=NULL,
                    ocapFunction=NULL,
                    
                    # Out an in-coming edges from the dependency graph
                    downStream = list(),
                    upStream = list(),
                    
                    #### METHODS ####
                    
                    # Build the object from the input json
                    # cl is the json for the control converted to a list
                    initialize = function(cl) {
                      if (!is.null(cl$id)) self$id <- cl$id
                      if (!is.null(cl$type)) self$type <- cl$type
                      
                      # Grab the code if it's there
                      if(!is.null(cl$controlProperties)) {
                        if(length(cl$controlProperties)>0) {
                          if(!is.null(cl$controlProperties[[1]]$value)) {
                            self$controlFunction <- cl$controlProperties[[1]]$value
                          }
                        }
                      }
                      
                      # Copy the input list for future reference
                      self$json <- cl
                      attr(self$json, "class") <- self$type
                      
                      self$ocapFunction <- processControl(self$json)
                      
                    },
                    
                    # Call the ocap
                    update = function() {
                      if(is.function(get(self$ocapFunction))) {
                        do.call(self$ocapFunction, list()) 
                      }
                    }
                    
                  )
)

# Could create the objects from a list of names
controls <- lapply(allControls, Control$new)
# Use the ids to name the list items
names(controls) <- sapply(controls, function(x) x$id)



# Remember this
library(codetools)
