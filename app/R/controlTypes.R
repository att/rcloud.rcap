
#' @include controlR6.R
#' @importFrom R6 R6Class
NULL

#' Control class for an R plot
#'
#' It runs an R function to update the plot, and then pushes
#' the new plot to the front-end.
#'
#' @importFrom rcloud.support rcloud.output.context RCloudDevice
#'   rcloud.html.out rcloud.flush.plot
#' @importFrom Rserve Rserve.context
#' @importFrom rcloud.web rcw.set

RPlotControl <- R6Class("RPlotControl",
  inherit = Control,
  public = list(

    update = function(new_value = NULL) {

      ## If there were no updates from the client, then
      ## the size might be unknown
      width <- round(private$width %||% 500)
      height <- round(private$height %||% 500)



      # Retrieve the function name and execute
      func <- private$controlFunction
      if (!is.null(func)) {
  #      wp1 <- WebPlot(width = width,height = height)

        # Clear the div
        rcw.set(paste0("#", private$id), "")
        # Set the context
        contextId <- rcloud.output.context(paste0("#",private$id))
        Rserve.context(contextId)
        # Set width and height for the device
        RCloudDevice(width, height)

        do.call(func, list(), envir = rcloudEnv())

        rcloud.flush.plot()
    #    rcloud.web::rcw.set(paste0("#", private$id), wp1)
      }
    },
  
    updateSize = function(new_size) {
      # TODO: Some basic checking
      private$width <- new_size["width"]
      private$height <- new_size["height"]
    }

  ),

  private = list(
    ## TODO: update these when client updates, or we need
    ## some better defaults based on the designer (?)
    width = NULL,
    height = NULL
  )
)

#' @importFrom rcloud.web rcw.set
#' @importFrom rcloud.web rcw.resolve

InteractivePlotControl <- R6Class("InteractivePlotControl",
  inherit = Control,
  public = list(

    update = function(new_value = NULL) {

      # Clear the div
      divId <- paste0("#", private$id)
      # TODO, do you need this next line?
      rcw.set(divId, "")
      
      # Retrieve the function name and execute
      func <- private$controlFunction

      res <- "doug error"
      if (!is.null(func)) res <- do.call(func, list(), envir = rcloudEnv())
      rcw.set(divId, rcw.resolve(res))

    },

    updateSize = function(new_size) {
      # TODO: Some basic checking
      private$width <- new_size["width"]
      private$height <- new_size["height"]
    }
  ),

  private = list(
    ## TODO: update these when client updates, or we need
    ## some better defaults based on the designer (?)
    width = NULL,
    height = NULL
  )
)

DataSourceControl <- R6Class("DataSourceControl",
  inherit = Control,
  public = list(
    update = function(new_value = NULL) {

      # Retrieve the function name and assign
      func <- private$controlFunction
      if (!is.null(func)) {
    
        assign(private$variableName,
               do.call(func, list(), envir = rcloudEnv()),
               pos = rcloudEnv())
        }
      }
    )
)

FormControl <- R6Class("FormControl",
  inherit = Control
)

TextFieldControl <- R6Class("TextFieldControl",
  inherit = Control
)

DatePickerControl <- R6Class("DatePickerControl",
  inherit = Control
)

DropdownControl <- R6Class("DropdownControl",
  inherit = Control
)

MultiSelectControl <- R6Class("MultiSelectControl",
  inherit = Control
)

CheckboxListControl <- R6Class("CheckboxListControl",
  inherit = Control
)

RadioButtonGroupControl <- R6Class("RadioButtonGroupControl",
  inherit = Control
)

SliderControl <- R6Class("Slidercontrol",
  inherit = Control
)

SeparatorControl <- R6Class("SeparatorControl",
  inherit = Control
)

HeadingControl <- R6Class("HeadingControl",
  inherit = Control
)

SubmitButtonControl <- R6Class("SubmitButtonControl",
  inherit = Control
)

#' @importFrom rcloud.web rcw.set
#' @importFrom rcloud.web rcw.prepend

IFrameControl <- R6Class("IFrameControl",
  inherit = Control,
  public = list(

    update = function(new_value = NULL) {
      # Retrieve the function name
      func <- private$controlFunction

      res <- try(do.call(func, list(), envir = rcloudEnv()), TRUE)
    
      if (inherits(res, "try-error")) {
        rcw.prepend(divId, res)
      } else {
        if(is.character(res) && length(res)==1 && grepl("^http://", res)) {
          rcap.updateControlAttribute(private$id, "src", "")
          rcap.updateControlAttribute(private$id, "src", res)
          #rcap.consoleMsg(paste("DEBUG:", private$id, "src", res))
        } else {
          rcw.prepend(divId, "<pre>Invalid URL returned</pre>")
        }
      }
    }
  )
)

ImageControl <- R6Class("ImageControl",
  inherit = Control
)

PageMenuControl <- R6Class("PageMenuControl",
  inherit = Control
)

BreadCrumbControl <- R6Class("BreadCrumbControl",
  inherit = Control
)

TextControl <- R6Class("TextControl",
  inherit = Control
)

DataTableControl <- R6Class("DataTableControl",
  inherit = Control,
  public = list(

    update = function(new_value = NULL) {
      func <- private$controlFunction
      if (!is.null(func)) {
        result <- do.call(func, list(), envir = rcloudEnv())
        result <- as.data.frame(result)
        # Convert the data.frame to JSON before returning
        # This gives us better control over what the client receives
        result <- jsonlite::toJSON(result, dataframe="column")
        rcap.updateControl(private$id, result)
      }
    }
  )
)

RTextControl <- R6Class("RTextControl",
  inherit = Control
)

#' Front-end control types and matching back-end classes

control_classes <- list(
  "rplot"            = RPlotControl,
  "interactiveplot"  = InteractivePlotControl,
  "dataSource"       = DataSourceControl,
  "form"             = FormControl,
  "textfield"        = TextFieldControl,
  "datepicker"       = DatePickerControl,
  "dropdown"         = DropdownControl,
  "multiselect"      = MultiSelectControl,
  "checkboxlist"     = CheckboxListControl,
  "radiobuttongroup" = RadioButtonGroupControl,
  "slider"           = SliderControl,
  "separator"        = SeparatorControl,
  "heading"          = HeadingControl,
  "submitbutton"     = SubmitButtonControl,
  "iframe"           = IFrameControl,
  "image"            = ImageControl,
  "pagemenu"         = PageMenuControl,
  "breadcrumb"       = BreadCrumbControl,
  "text"             = TextControl,
  "datatable"        = DataTableControl,
  "rtext"            = RTextControl
)

controlFactory <- function(cl, type = cl$type) {
  control_classes[[type]]$new(cl)
}
