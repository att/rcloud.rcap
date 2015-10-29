
context("Controller")

test_that("controller builds dependency graph and update order", {

  resp <- paste(readLines("testConfig.json"), collapse = "\n")

  ## TODO: this is a hack that will break at some point
  on.exit(rm(list = "makePlot1", envir = .GlobalEnv), add = TRUE)
  assign(
    "makePlot1",
    function() { datePicker1 + datePicker2 },
    envir = .GlobalEnv
  )

  cnt <- Controller$new(resp)
  succList <- cnt$.__enclos_env__$private$succList
  d6 <- names(succList)[6]

  expect_equal(succList$datePicker1, d6)
  expect_equal(succList$datePicker2, d6)

  topoSort <- cnt$.__enclos_env__$private$topoSort

  expect_equal(sort(names(succList)), sort(topoSort))
  expect_true(match("datePicker1", topoSort) < match(d6, topoSort))
  expect_true(match("datePicker2", topoSort) < match(d6, topoSort))
})
