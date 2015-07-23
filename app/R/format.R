iip_slide <- function(iipSettingsCell=FALSE, ...) {
    fmt <- html_fragment(...)
    hfpp <- fmt$post_processor

    fmt$post_processor <- function (metadata, input_file, output_file, clean, verbose) {
        of <- hfpp(metadata, input_file, output_file, clean, verbose)
        output_str <- readLines(output_file, warn = FALSE, encoding = "UTF-8")

        if (iipSettingsCell) {
          output_str <- iip.settingsprocess(input_file, metadata)
        } else {
          output_str <- iip.postprocess(output_str, metadata)
        }

        writeLines(output_str, output_file, useBytes = TRUE)
        output_file
    }
		
	# Remove --section-divs from the pandoc call
    fmt$pandoc$args <- fmt$pandoc$args[fmt$pandoc$args!="--section-divs"]
    
	# Return the output_format
	fmt
}

iip.postprocess <- function(output_str, metadata) {
  htmlLines <- output_str

  if (!is.null(metadata$width)) {
    width <- gsub('%', '', strsplit(metadata$width, " "))
  } else {
    width <- vector()
  }
  bootstrapColumns <- round(12.0*as.numeric(width)/100)

  
  
  # First we will establish if there is a title.
  # The rule is, if the first html element is h1, h2, h3... then it is a title
  # If it is anything else then we put a blank inside the title div
  hasTitle=FALSE
  firstTag <- grep("^<", htmlLines, value=TRUE)[1]
  firstTagLine <- grep("^<", htmlLines)[1]
  if (length(grep("^<h[1-9]", firstTag))>0) {
    hasTitle=TRUE
  }

  # Add the title div
  closeDiv <- "</div>\n</div>\nCONTENT_DIV_HERE_XCVB\nCONTENT_COLUMNS_HERE_XCVB\n"
  if (hasTitle) {
    # Put the div around the title
    openDiv <- "<div class=\"row-fluid iiptitle\">\n<div class=\"span12\">"
    htmlLines[firstTagLine] <- paste(openDiv, htmlLines[firstTagLine],
                                     closeDiv, sep="\n")
  } else {
    # Put the empty div at the top
    # htmlLines[1] <- paste(openDiv, "<h1 style=\"visibility: hidden;\">No Title</h1>", 
    #                      closeDiv, htmlLines[1], sep="\n")
    openDiv <- "<div class=\"row-fluid iiptitle notitle\">\n<div class=\"span12\">"
    htmlLines[1] <- paste(openDiv, " &nbsp ", 
                          closeDiv, htmlLines[1], sep="\n")
  }
  
  # Remove p tags from images
  for (i in grep("<p><img", htmlLines)) {
    htmlLines[i] <- sub("<p>","",htmlLines[i])
    htmlLines[i] <- sub("</p>","",htmlLines[i])
  }

  # Collapse the lines back to one text chunk
  val <- paste(htmlLines, collapse='\n')

  # Pick up table options
  if (!is.null(metadata$tableclass)) {
    tableClass <- metadata$tableclass
  } else {
    tableClass <- "table table-condensed"
  }
  val <- gsub("<table>", paste0("<table class=\"", tableClass, "\">"),val)


  hrIndexes <- grep("<hr",htmlLines)


  if (length(hrIndexes)>0) {
    # Decide on the widths, default is 50-50 (6-6)
    colL=6
    colR=12-colL
    if (length(bootstrapColumns)>0) {
      colL=bootstrapColumns[1]
      colR=12-colL
    }
    twoColTop <- paste("<div class=\"col-xs-", colL, "\">\n", sep="")
    twoColMid <- paste("</div>\n<div class=\"col-xs-", colR, "\">\n", sep="")
    twoColBot <- "</div>"

  } else {
    twoColTop <- "<div class=\"col-xs-12\">\n"
    twoColMid <- ""
    twoColBot <- "</div>"
  }

  # Open the left column div
  val <- sub("CONTENT_COLUMNS_HERE_XCVB",twoColTop,val)
  # Close the right column div
  val <- paste(val, twoColBot, sep="\n")
  # In the middle, put in the separator
  # Try to catch all possible hr separators with a regex
  val <- sub("<hr( |/)+>",twoColMid, val)


  # Put a row around the slide contents (not the title)
  if(hasTitle) {
    val <- sub("CONTENT_DIV_HERE_XCVB","<div class=\"row-fluid iipcontents\">",val)
  } else {
    val <- sub("CONTENT_DIV_HERE_XCVB","<div class=\"row-fluid iipcontents notitle\">",val)
  }
  val <- paste(val, "</div>", sep="\n")

  # Put a container around the whole slide
  val <- paste("<div class=\"container-fluid iipslidecon\">", val, sep="\n")
  val <- paste(val, "</div>", sep="\n")

  # Finally put down the complete slide div
  classes <- metadata$classes
  if(!is.null(classes)) {
    topDiv <- paste0('<div class="',paste(classes, "iipcell", sep=" "), '">')
    val <- paste(topDiv, val, '</div>', sep="\n")
  }


  if (!inherits(val, "try-error") && rcloud.debug.level()) print(val)
  if (inherits(val, "try-error")) {
    # FIXME better error handling
    paste("<pre>", val[1], "</pre>", sep="")
  } else {
    val
  }
}

iip.settingsprocess <- function(input_file, metadata) {
  input_str <- readLines(input_file, warn = FALSE, encoding = "UTF-8")

  # Strip off the yaml header, find the second line starting with ---
  dashLines <- grep("^---", input_str)

  if (length(dashLines)>1) {
    startLine <- dashLines[2]+1
  } else {
    startLine <- 1
  }
  output_str <- c("<div class=\"iipcell iipsettings\">","<pre>",input_str[startLine:length(input_str)],
                  "</pre>","</div>", sep="\n")

  output_str
}

