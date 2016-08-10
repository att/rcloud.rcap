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
          stopifnot("data" %in% names(result))
        }
        
        result$columns <- names(result$data) # add in column names as meta data
        rownames(result$data) <- NULL
        
        digits <- result$options$decimalPlaces

        
        result$options <- private$convertOptions(result)$options
        result$data  <- private$convertOptions(result)$data

        # Convert the data.frame to JSON before returning
        # This gives us better control over what the client receives
        result <- jsonlite::toJSON(result, 
          auto_unbox = TRUE, # lists of size 1 should be "unboxed" automatically
          digits = digits %||% 2) # number of decimal digits, defult to 2

        rcap.updateControl(private$id, result)
      }
    }
  ),
  private = list(
    convertOptions = function(result){
      colNames <- result$columns
      options <- result$options
      # this private method converts from an option list 
      # supplied by user from notebook to the form expected
      # by the front end. These are eventually passed to the
      # DataTables api, further manipulated for sparklines,
      # or used to generate extra lines of css
      resOptions <- list(sparklines = list(), 
        datatables = list(), 
        css = list())

      # work out which columns contain multiple data points
      # these columns will be sparklines
      # note: need to convert from R to javascipt counting
      # (start a 0 instead)
      possSparkColumns <- which(vapply(result$data, is.list, FUN.VALUE = TRUE))-1

      # set column types (histogram, line graph etc.)
      resOptions$sparklines$box <- match(options$sparkOptions$box, colNames)-1
      resOptions$sparklines$line <- match(options$sparkOptions$line, colNames)-1
      # the rest defaults to histograms
      usedColumns <- union(resOptions$columnDefs$box, resOptions$columnDefs$line)
      resOptions$sparklines$histogram <- setdiff(possSparkColumns, usedColumns)

      result$data[resOptions$sparklines$histogram + 1] <-
        lapply(X = result$data[resOptions$sparklines$histogram + 1],
          FUN = function(listvec) {
            lapply(X = listvec, 
              FUN = function(vec) hist(vec, plot = FALSE)$counts)
          })

      getClassNames <- createTableIdDf(options = options, colNames = colNames)

      # columnDefs
      resOptions$datatables$columnDefs <- 
        list( 
          data.frame(width   = options$columnWidths, 
                     targets = seq_along(options$columnWidths)-1), # set column widths
          data.frame(className = getClassNames$className,
                     targets   = match(getClassNames$targets, colNames) - 1,
                     stringsAsFactors = FALSE)
        )

      # Column css
      resOptions$datatables$css <- list(
        data.frame(
          "_selector" = pasteEmpty(".", gsub(" ", ".", getClassNames$className)),
          "background-color" = getClassNames$`background-color`,
          stringsAsFactors = FALSE, 
          check.names = FALSE
        )
      )

      resOptions$datatables$language <-
        list(thousands = options$thousands %||% ',')

      # set font sizes
      resOptions$css$thSize <- options$thSize
      resOptions$css$tdSize <- options$tdSize

      list(data = result$data, options = resOptions)
    }
  )
)
