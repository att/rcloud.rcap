
context("Generate Table CSS")

test_that("createTableCss returns the expected results", {

  colNames <- colnames(mtcars)

  options <- list(columnWidths = c("50%", rep("5%", length(colnames(mtcars)) - 1)),
                  rightAlign = "hp",
                  columnColor = c("mpg" = "red", "cyl" = "blue", "drat" = "green"),
                  textColor = c("mpg" = "green", "drat" = "yellow", "hp" = "red"))

  getClassNames <- createTableIdDf(options = options, colNames = colNames, id = "table")

  getCss <- createTableCss(getClassNames, id = "table")

  expectedRes <- "<style type=\"text/css\" id=\"dt-style-table\">cyl{className: dt-table-1; background-color: blue}\ndrat{className: dt-table-4; background-color: green; color: yellow}\nhp{className: dt-body-right dt-table-3}\nhp{className: dt-table-3; color: red}\nmpg{className: dt-table-0; background-color: red; color: green}</style>"

  expect_equal(getCss, expectedRes)
})