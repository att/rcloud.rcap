
context("Controller")

test_that("controller builds dependency graph and update order", {

  resp <- paste(readLines("testConfig.json"), collapse = "\n")
  resp <- fromJSON(resp, simplifyVector = FALSE)

  ## TODO: this is a hack that will break at some point
  on.exit(rm(list = "makePlot1", envir = .GlobalEnv), add = TRUE)
  assign(
    "makePlot1",
    function() { datePicker1 + datePicker2 },
    envir = .GlobalEnv
  )

  cnt <- Controller$new(resp)
  succList <- cnt$.__enclos_env__$private$succList

  expect_equal(succList$rcap16014ed1, rcap630974bf)
  expect_equal(succList$rcapc43838c4, rcap630974bf)

  topoSort <- cnt$.__enclos_env__$private$topoSort

  expect_equal(sort(names(succList)), sort(topoSort))
  expect_true(
    match("rcapc43838c4", topoSort) < match(rcap630974bf, topoSort)
  )
  expect_true(
    match("rcap16014ed1", topoSort) < match(rcap630974bf, topoSort)
  )
})
