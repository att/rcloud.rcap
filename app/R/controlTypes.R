
#' @include controlR6.R
#' @importFrom R6 R6Class
#' @importFrom rcloud.support rcloud.output.context RCloudDevice
#'   rcloud.html.out rcloud.flush.plot
#' @importFrom Rserve Rserve.context

RPlotControl <- R6Class("RPlotControl",
  inherit = Control,
  public = list(

    update = function(new_value = NULL) {

      ## If there were no updates from the client, then
      ## the size might be unknown
      width <- round(private$width %||% 800)
      height <- round(private$height %||% 800)

      # contextId <- rcloud.output.context(paste0("#", private$id))
      # Rserve.context(contextId)

      wp1 <- WebPlot(width = width,height = height)

##      RCloudDevice(width, height)

      ## TODO: this should be stored in the constructor
      func <- private$json$controlProperties[[1]]$value
      #if (!is.null(func)) do.call(func, list(), envir = rcloudEnv())

      plot(1:10)

  ##    rcloud.flush.plot()
      rcloud.web::rcw.set(paste0("#", private$id), wp1)
      super$update(new_value)
    }

  ),

  private = list(
    ## TODO: update these when client updates, or we need
    ## some better defaults based on the designer (?)
    width = NULL,
    height = NULL
  )
)


InteractivePlotControl <- R6Class("InteractivePlotControl",
  inherit = Control
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

IFrameControl <- R6Class("IFrameControl",
  inherit = Control
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

control_classes <- list(
  "rplot"            = RPlotControl,
  "interactiveplot"  = InteractivePlotControl,
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
  "text"             = TextControl
)

controlFactory <- function(cl, type = cl$type) {
  control_classes[[type]]$new(cl)
}
