
#' @include controlR6.R
#' @importFrom R6 R6Class

RPlotControl <- R6Class("RPlotControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {

    }

  )
)


InteractivePlotControl <- R6Class("InteractivePlotControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

FormControl <- R6Class("FormControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

TextFieldControl <- R6Class("TextFieldControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

DatePickerControl <- R6Class("DatePickerControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

DropdownControl <- R6Class("DropdownControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

MultiSelectControl <- R6Class("MultiSelectControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

CheckboxListControl <- R6Class("CheckboxListControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

RadioButtonGroupControl <- R6Class("RadioButtonGroupControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

SliderControl <- R6Class("Slidercontrol",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

SeparatorControl <- R6Class("SeparatorControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

HeadingControl <- R6Class("HeadingControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

SubmitButtonControl <- R6Class("SubmitButtonControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

IFrameControl <- R6Class("IFrameControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

ImageControl <- R6Class("ImageControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

PageMenuControl <- R6Class("PageMenuControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

BreadCrumbControl <- R6Class("BreadCrumbControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
)

TextControl <- R6Class("TextControl",
  inherit = Control,
  public = list(

    updateFrontend = function() {
      ## TODO
    }

  )
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

controlFactory <- function(type = names(control_classes), cl) {
  type <- match.arg(type)
  control_classes[[type]]$new(cl)
}
