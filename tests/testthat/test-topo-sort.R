
context("Topological sorting")

test_that("toplogical sorting works", {

  G <- list(
    "7"  = c("11", "8"),
    "5"  = "11",
    "3"  = c("8", "10"),
    "11" = c("2", "9", "10"),
    "8"  = "9",
    "2"  = character(),
    "9"  = character(),
    "10" = character()
  )

  topo <- topologicalSort(G)

  expect_true(match("7", topo) < match("11", topo))
  expect_true(match("7", topo) < match("8", topo))
  expect_true(match("5", topo) < match("11", topo))
  expect_true(match("3", topo) < match("8", topo))
  expect_true(match("3", topo) < match("10", topo))
  expect_true(match("11", topo) < match("2", topo))
  expect_true(match("11", topo) < match("9", topo))
  expect_true(match("11", topo) < match("10", topo))
  expect_true(match("8", topo) < match("9", topo))
  
})

test_that("topological sorting works on sparse graphs", {

  G <- list(
    "a" = "b",
    "b" = character(),
    "c" = "d",
    "d" = character(),
    "e" = "f",
    "f" = character()
  )

  topo <-topologicalSort(G)

  expect_true(match("a", topo) < match("b", topo))
  expect_true(match("c", topo) < match("d", topo))
  expect_true(match("e", topo) < match("f", topo))

  topo2 <- topologicalSort(
    list("a" = "b", "b" = "c", "c" = "d", "d" = "e", "e" = character())
  )

  expect_equal(topo2, c("a", "b", "c", "d", "e"))

  topo3 <- topologicalSort(list("a" = character(), "b" = character()))

  expect_equal(sort(topo3), c("a", "b"))
  
})

test_that("twistAdjlist works", {

  G1 <- list(
    "7"  = c("11", "8"),
    "5"  = "11",
    "3"  = c("8", "10"),
    "11" = c("2", "9", "10"),
    "8"  = "9",
    "2"  = character(),
    "9"  = character(),
    "10" = character()
  )

  G11 <- twistAdjlist(G1)

  expect_equal(names(G11), names(G1))
  expect_equal(
    G11,
    list(
      "7"  = character(),
      "5"  = character(),
      "3"  = character(),
      "11" = c("7", "5"),
      "8"  = c("7", "3"),
      "2"  = "11",
      "9"  = c("11", "8"),
      "10" = c("3", "11")
    )
  )

  G111 <- twistAdjlist(G11)
  expect_equal(G1, G111)
})
