context("Filling in templates")

test_that("Templates are correctly filled in" ,{
  
  ## This could get annoying every time you change the template.
  
  funText <- fillTemplate(
    "testTemplate.R",
    list(
      control.id="rcapid123",
      control.controlProperties.1="hist(rnorm(1000))"
    )
  )

  output <- 'rcapid123 <- function() hist(rnorm(1000))\n## rcapid123'  
  expect_equal(paste(funText, collapse = "\n"), output)

})

test_that("Warning is produced for missing variables", {
  
  expect_warning(fillTemplate("rplotTemplate.R",
                   list(control.id="rcapid123")))
  
})


test_that("Warnings are produced for missing templates", {
  
  expect_warning(fillTemplate("noTemplate.R",
                              list(control.id="rcapid123")))
  
})
