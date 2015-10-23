# R6 class for controls

Control <- R6::R6Class("Control",
           public = list(
             id = NA,     # eg rcapac34a
             type = NA,   # rplot etc
             json = NA,   # The list as returned from JSON
             
             # Control Properties
             controlFunction=NA,
             variableName=NA,
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
                   
                   # Pulling various properties
                   for (cp in cl$controlProperties) {
                     
                     if(cp$uid == "code") {
                       self$controlFunction <- cp$value
                     }
                     if(cp$uid == "variablename") {
                       self$variableName <- cp$value
                     }
                     
                   }
                   
                 }
               }
               
               # Copy the input list for future reference
               self$json <- cl
               if(!is.na(self$type)) {
                 attr(self$json, "class") <- self$type
               }
               
               self$ocapFunction <- processControl(self$json)
               
             },
             
             # Call the ocap
             # Fix the environment
             update = function() {
               if(is.function(get(self$ocapFunction))) {
                 do.call(self$ocapFunction, list()) 
               }
             },
             
             # Compare the variables that are client side to those used in the function
             # Return the matches
             dependentVariables = function(clientVars) {
               
               varsUsed <- ""
               
               if(!is.null(self$controlFunction) & !is.na(self$controlFunction)) {
                 if(exists(self$controlFunction)) {
                   if(is.function(get(self$controlFunction))) {
                     varsUsed <- codetools::findGlobals(get(self$controlFunction))
                   }
                 }
               }
               
               # Only choose from client variables
               clientVars[clientVars %in% varsUsed]
             },
             
             # Add a control that should update when this one does
             addDownStream = function(downControl) {
               self$downStream <- append(self$downStream, downControl)
             },
             
             # Add a control that causes this one to update.
             # Also add the reverse dependency
             addUpStream = function(upControl) {
               self$upStream <- append(self$upStream, upControl)
               upControl$addDownStream(self)
             }
             
             
             
          )
)