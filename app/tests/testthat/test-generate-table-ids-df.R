
context("Generate Table IDs DataFrame")

test_that("createTableIdDf returns the expected results", {

  colNames <- colnames(mtcars)

  options <- list(columnWidths = c("50%", rep("5%", length(colnames(mtcars)) - 1)),
                  rightAlign = "mpg",
                  columnColor = c("mpg" = "red", "cyl" = "blue", "drat" = "green"))

  set.seed(1)
  getClassNames <- createTableIdDf(options = options, colNames = colNames)
  expectedRes <- structure(
  	list(targets = c("cyl", "drat", "mpg"), 
  		 `background-color` = c("blue", "green", "red"), 
  		 className = c("dt-col-wchgyn1r", "dt-col-z9n17hxe", "dt-body-right dt-col-jnu6h68x")), 
  	     .Names = c("targets", "background-color", "className"), 
  	     row.names = c(1L, 2L, 3L), 
  	     class = "data.frame")

  expect_equal(getClassNames, expectedRes)
})