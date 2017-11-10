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
                                   control <- controls[[event$controlId]]
                                   result <- try({control$listFiles()}, silent = TRUE)
                                   if(class(result) == 'try-error') {
                                     return(list('status' = 'Failure', msg = as.character(conditionMessage(result))))
                                   } else {
                                     return(list('status' = 'Success', data = result))
                                   }
                               }
                             ),
                             private = list(
                             )
)

DataDownloadGetFileContentsEventHandler <- R6Class("DataDownloadGetFileContentsEventHandler",
                                             inherit = EventHandler,
                                             public = list(
                                               supports = function(event = list()) {
                                                 if(is.null(event) || !'eventType' %in% names(event)) {
                                                   return(FALSE)
                                                 }
                                                 return(event$eventType == 'DataDownloadGetFileContents')
                                               },
                                               handle = function(event = list()) {
                                                 cnt <- get("rcapController", envir = rcapEnv)
                                                 controls <- cnt$getControls()
                                                 if(! 'controlId' %in% names(event)) {
                                                   stop(paste0('Control id not set on the event, please specify it using "controlId" attribute.'))
                                                 }
                                                 if(! event$controlId %in% names(controls)) {
                                                   stop(paste0('Control with id ', event$controlId, ' not found.'))
                                                 }
                                                 if(! 'data' %in% names(event) || ! 'filename' %in% names(event$data)) {
                                                   stop(paste0('File name missing, please specify it in "data" attribute using "filename" key, e.g. {data:{filename:"my-file.txt"}}.'))
                                                 }
                                                 control <- controls[[event$controlId]]
                                                 result <- control$readFile(event$data$filename)
                                                 return(result)
                                               }
                                             ),
                                             private = list(
                                             )
)