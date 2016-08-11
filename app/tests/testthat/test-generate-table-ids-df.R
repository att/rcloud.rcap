
context("Generate Table IDs DataFrame")

test_that("createTableIdDf returns the expected results", {

  colNames <- colnames(mtcars)

  options <- list(columnWidths = c("50%", rep("5%", length(colnames(mtcars)) - 1)),
                  rightAlign = "hp",
                  columnColor = c("mpg" = "red", "cyl" = "blue", "drat" = "green"),
                  textColor = c("mpg" = "green", "drat" = "yellow", "hp" = "red"))

  getClassNames <- createTableIdDf(options = options, colNames = colNames, id = "table")
  expectedRes <- structure(
    list(
      targets = c("cyl", "drat", "hp", "hp", "mpg"), 
      className = c("dt-table-1", "dt-table-4", "dt-body-right dt-table-3", "dt-table-3", "dt-table-0"), 
      `background-color` = c("blue", "green", NA, NA, "red"), 
      color = c(NA, "yellow", NA, "red", "green")), 
      .Names = c("targets", "className", "background-color", "color"), 
      row.names = c(NA, 5L), 
      class = "data.frame")

  expect_equal(getClassNames, expectedRes)
})