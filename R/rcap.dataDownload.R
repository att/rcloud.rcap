DataDownloadListFilesEventHandler <- R6Class("DataDownloadListFilesEventHandler",
                             inherit = EventHandler,
                             public = list(
                               supports = function(event = list()) {
                                 if(is.null(event) || !'eventType' %in% names(event)) {
                                   return(FALSE)
                                 }
                                 return(event$eventType == 'DataDownloadListFiles')
                               },
                               handle = function(event = list()) {
                                   cnt <- get("rcapController", envir = rcapEnv)
                                   controls <- cnt$getControls()
                                   if(! 'controlId' %in% names(event)) {
                                     return(list('status' = 'Failure', 'msg' = paste0('Control id not set on the event.')))
                                   }
                                   if(! event$controlId %in% names(controls)) {
                                     return(list('status' = 'Failure', 'msg' = paste0('Control with id ', event$controlId, ' not found.')))
                                   }
                                   control <- controls$controlId
                                   result <- tryCatch(control$listFiles())
                                   if(typeof(result) == 'try-error') {
                                     return(list('status' = 'Failure', msg = as.character(result)))
                                   } else {
                                     return(list('status' = 'Success', data = result))
                                   }
                               }
                             ),
                             private = list(
                             )
)