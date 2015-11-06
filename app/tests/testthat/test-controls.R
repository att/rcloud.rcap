
context("Controls")

test_that("controls public API is OK", {

  resp <- paste(readLines("testConfig.json"), collapse = "\n")
  resp <- fromJSON(resp, simplifyVector = FALSE)
  cnt <- Controller$new(resp)
  ctrls <- cnt$.__enclos_env__$private$controls

  expect_equivalent(
    vapply(ctrls, function(x) x$getVariableName(), ""),
    c("datePicker1", "datePicker2", NA, "option1", NA, NA, NA, NA, NA,
      "datePicker3", NA)
  )
})

test_that("dependentVariables works", {

  resp <- paste(readLines("testConfig.json"), collapse = "\n")
  resp <- fromJSON(resp, simplifyVector = FALSE)
  cnt <- Controller$new(resp)
  ctrls <- cnt$.__enclos_env__$private$controls

  makePlot1 <- function() {
    var1 + var2
  }

  expect_equal(
    ctrls[[6]]$dependentVariables(
      c("var1", "var2", "var3"),
      envir = environment()
    ),
    c("var1", "var2")
  )

  expect_equal(
    ctrls[[6]]$dependentVariables(c("var1"), envir = environment()),
    "var1"
  )

  expect_equal(
    ctrls[[6]]$dependentVariables(character(), envir = environment()),
    character()
  )

})
