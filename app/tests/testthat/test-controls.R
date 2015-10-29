
context("Controls")

test_that("controls public API is OK", {

  resp <- paste(readLines("testConfig.json"), collapse = "\n")
  cnt <- Controller$new(resp)
  ctrls <- cnt$.__enclos_env__$private$controls

  expect_equivalent(
    vapply(ctrls, function(x) x$getVariableName(), ""),
    c("datePicker1", "datePicker2", NA, "option1", NA, NA, NA, NA, NA,
      "datePicker3", NA)
  )
})
