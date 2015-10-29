
context("Controller")

test_that("can create a controller", {

  resp <- paste(readLines("testConfig.json"), collapse = "\n")
  cnt <- Controller$new(resp)
  
  
})
