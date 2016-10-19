
getRCAPStyles <- function() {
  pkgs <- rownames(installed.packages())
  style <- grep("^rcloud\\.rcap\\.style\\.", pkgs, value = TRUE)
  title <- vapply(style, function(x) packageDescription(x)$Title, "")
  desc <- vapply(style, function(x) packageDescription(x)$Description, "")
  unname(mapply(c, style, title, desc, SIMPLIFY = FALSE))
}
