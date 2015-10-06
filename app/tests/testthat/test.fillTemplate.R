context("Filling in templates")

test_that("Templates are correctly filled in" ,{
  
  # This could get annoying every time you change the template.
  
  funText <- fillTemplate("rplotTemplate.R",
                          list(control.id="rcapid123",
                          control.controlProperties.1="hist(rnorm(1000))"))
  
  expect_equal(funText, c("rcapid123 <- function(jsArgs=list(width=500,height=500)) {", 
                          "  ", "  # Get the width and height from the client", "  if (!is.null(jsArgs$width)) width=jsArgs$width", 
                          "  if (!is.null(jsArgs$height)) height=jsArgs$height", "  ", 
                          "  # Start a webplot device", "  wp1 <- WebPlot(width=width,height=height)", 
                          "  ", "  # Function call from the control goes here", "  hist(rnorm(1000))", 
                          "  ", "  # Output the plot to the right div", "  rcloud.web::rcw.set(\"#rcapid123\", wp1)", 
                          "  ", "}"))
                          
})

test_that("Warning is produced for missing variables", {
  
  expect_warning(fillTemplate("rplotTemplate.R",
                   list(control.id="rcapid123")))
  
})


test_that("Warnings are produced for missing templates", {
  
  expect_warning(fillTemplate("noTemplate.R",
                              list(control.id="rcapid123")))
  
})