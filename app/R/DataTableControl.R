DataTableControl <- R6Class("DataTableControl",
  inherit = Control,
  public = list(

    update = function(new_value = NULL) {
      func <- private$controlFunction
      if (!is.null(func)) {
        funcRes <- do.call(func, list(), envir = rcloudEnv())

        if (is.data.frame(funcRes)){
          # for compatibility with old notebooks
          result <- list(data = funcRes)
        } else {
          # otherwise it must be a list
          result <- as.list(funcRes)
          stopifnot(all(c("data", "options") %in% names(result)))
          
        }
        
        result$columns <- names(result$data) # add in column names as meta data
        rownames(result$data) <- NULL

        # Convert the data.frame to JSON before returning
        # This gives us better control over what the client receives
        result <- jsonlite::toJSON(result, auto_unbox = TRUE) # lists of size 1 should be "unboxed" automatically
        rcap.updateControl(private$id, result)
      }
    }
  )
)