
context("Parsing controls")

test_that("we can parse controls from JSON", {
  resp <- paste(readLines("testConfig.json"), collapse = "\n")
  ctrls <- getControls(resp)

  expect_equal(length(ctrls), 11)
  expect_equal(
    vapply(ctrls, "[[", "", "type"),
    c("datepicker", "datepicker", "separator", "checkboxlist", "form", 
      "rplot", "image", "rplot", "rplot", "datepicker", "form")
  )
  expect_equal(names(ctrls[[1]]), c("type", "id", "controlProperties"))
  expect_equal(
    names(ctrls[[5]]),
    c("type", "x", "y", "width", "height", "id", "controlProperties",
      "childControls")
  )
  expect_equal(
    names(ctrls[[6]]),
    c("type", "x", "y", "width", "height", "id", "controlProperties",
      "isOnGrid")
  )
  expect_equal(length(ctrls[[1]]$controlProperties), 2)
})
