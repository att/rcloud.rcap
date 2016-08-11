
#' Topological sorting of a directed graph, represented by
#' adjacency lists. Graph vertices are represented by strings.
#'
#' It uses Taarjan's depth-first search algorithm, see
#' https://en.wikipedia.org/wiki/Topological_sorting#Tarjan.27s_algorithm
#'
#' \preformatted{
#' L <- Empty list that will contain the sorted nodes
#' while there are unmarked nodes do
#'     select an unmarked node n
#'     visit(n)
#'
#' function visit(node n)
#'     if n has a temporary mark then stop (not a DAG)
#'     if n is not marked (i.e. has not been visited yet) then
#'         mark n temporarily
#'         for each node m with an edge from n to m do
#'             visit(m)
#'         mark n permanently
#'         unmark n temporarily
#'         add n to head of L
#' }
#'
#' @param adjlist List of successors of all vertices.
#'   Itmust be named, and the vertex names must be the vertices.
#' @return The vertex ids, in topologically sorted order. I.e.
#'   if v2 comes after v1 in the list, then there must not be an
#'   edge from v2 to v1.

topologicalSort <- function(adjlist) {

  V <- names(adjlist)
  N <- length(V)

  ## some easy cases
  if (length(adjlist) <= 1 ||
      sum(sapply(adjlist, length)) == 0) return(V)

  marked <- 1L; temp_marked <- 2L; unmarked <- 3L
  marks <- structure(rep(unmarked, N), names = V)
  result <- character(N)
  result_ptr <- N

  visit <- function(n) {
    if (marks[n] == temp_marked) stop("Dependency graph not a DAG")
    if (marks[n] == unmarked) {
      marks[n] <<- temp_marked
      for (m in adjlist[[n]]) visit(m)
      marks[n] <<- marked
      result[result_ptr] <<- n
      result_ptr <<- result_ptr - 1
    }
  }

  while (any(marks == unmarked)) {
    visit(names(which(marks == unmarked))[1])
  }

  result
}

#' Convert an in-adjacency list to an out-adjacency list, or the other way
#'
#' In other words, it reverses the direction of each edge in a graph.
#'
#' @param adjlist The adjacencly list of the graph. See
#'   \code{topologicalSort} for the expected format.
#' @return Another adjacency list, corresponding to the graph
#'   with all edge directions reversed.

twistAdjlist <- function(adjlist) {

  res <- structure(
    replicate(length(adjlist), character()),
    names = names(adjlist)
  )

  for (v in names(adjlist)) {
    for (w in adjlist[[v]]) {
      res[[w]] <- c(res[[w]], v)
    }
  }

  res
}

#' BFS of a graph.
#'
#' From the given vertices we collect all vertices that the reachable
#' from them. There are all the controls that we need to update.
#'
#' @param adjlist The adjacency list of the graph. See
#'   \code{topologicalSort} for the expected format.
#' @param seeds Character vector, vertex ids to start the BFS from.
#' @return Character vector with all vertex ids that are reachable
#'   from the \code{seeds}.

bfs <- function(adjlist, seeds) {

  V <- names(adjlist)
  N <- length(V)
  reachable <- character()
  marks <- structure(rep(FALSE, N), names = V)

  while (length(seeds)) {

    s <- seeds[1]
    seeds <- seeds[-1]

    for (n in adjlist[[s]]) {
      if (!marks[[n]]) {
        seeds <- c(seeds, n)
        reachable <- c(reachable, n)
        marks[[n]] <- TRUE
      }
    }
  }

  reachable
}
