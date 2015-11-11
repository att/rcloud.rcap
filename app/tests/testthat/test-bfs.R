
context("BFS")

test_that("BFS on a dependency graph", {

  G <- list(
    "a" = "b",
    "b" = character(),
    "c" = "d",
    "d" = character(),
    "e" = "f",
    "f" = character()
  )

  expect_equal(bfs(G, "a"), "b")
  expect_equal(bfs(G, "c"), "d")
  expect_equal(sort(bfs(G, c("a", "c"))), c("b", "d"))

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

  expect_equal(sort(bfs(G, character())), character())
  expect_equal(sort(bfs(G, "10")), character())
  expect_equal(sort(bfs(G, "7")), c("10", "11", "2", "8", "9"))
  expect_equal(
    sort(bfs(G, c("7", "5"))),
    c("10", "11", "2", "8", "9")
  )
})
