# R6 class for controls

# This controller will maintain an update "stack" which is a list of references
# to controls that need updating. The update should be in a BREADTH-FIRST manner.
# This is because all variables that a control might be dependent on need to be
# updated before that control is itself updated.


Controller <- R6::R6Class("Controller",
           public = list(
             # The list of controls
             controls=NULL,

             #### METHODS ####
             initialize = function(rcapConfig) {

               # List of the controls (from JSON)               
               allControls <- getControls(rcapConfig)

               # Create the objects from the JSON
               controls <- lapply(allControls, Control$new)
               
               # Use the ids to name the list items
               names(controls) <- sapply(controls, function(x) x$id)
               
             }
          ),
          
          private = list(
            # Controls due to be updated
            controlStack = list(),
            
            iStack = 0,
            
            #### METHODS ####
            clearStack = function() {
              self$controlStack <- list()
              iStack=0
            },
            
            # Add a control to the stack
            pushStack = function(control) {
              self$controlStack <- append(self$controlStack, control)
            },
            
            # Take from the bottom of the stack and increment the position
            popStack = function(control) {
              iStack <- iStack + 1
              if(iStack > length(self$controlStack)) {
                return(NULL)
              } else {
                return(self$controlStack[[iStack]])
              }
              
            }
          )
)