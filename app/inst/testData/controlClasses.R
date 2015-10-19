
rcapConfig <- jsonlite::fromJSON(system.file("testData/testConfig.json", package="rcloud.rcap"), simplifyVector = FALSE)

allControls <- getControls(rcapConfig)



# Could create the objects from a list of names
controls <- lapply(allControls, Control$new)
# Use the ids to name the list items
names(controls) <- sapply(controls, function(x) x$id)

# Get all the variableNames
clientVariables <- sapply(controls, function(x) x$variableName)
# Remove the missings leaving all client variables
clientVariables <- clientVariables[!is.na(clientVariables)]


# This wires up the controls to their dependencies.
for (con in controls) {
  
  upStream <- names(con$dependentVariables(clientVariables))
  if(length(upStream)>0) {
    for(up in upStream) {
      con$addUpStream(controls[[up]])
    }
  }
  
}


