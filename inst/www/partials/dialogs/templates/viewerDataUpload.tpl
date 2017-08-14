            <div class="row">
                <div class="col-md-12">
                    <label for="datasetName">Dataset Name</label>
                    <span>(Please only use the following characters: letters, digits, spaces, hyphens and underscores)</span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input type="text" class="form-control" id="datasetName" placeholder="Enter Dataset Name" data-parsley-pattern="[\da-zA-Z0-9 _\-]+" data-parsley-spellcheck="false" data-parsley-required="" data-parsley-trigger="change">
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <label for="description">Description</label>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input type="text" class="form-control" id="description" placeholder="Enter a description for this dataset (optional)" data-parsley-spellcheck="false" data-parsley-trigger="change">
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <label for="file">File</label>
                    <span>(Please only use the following characters: letters, digits, spaces, hyphens and underscores)</span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                  <div id="file-upload-div">
                    <div id="file-upload-wrapper">
                      <div id="file-upload-controls" class="btn-group-sm">
                        <input type="file" id="file-upload-file" data-parsley-allowedfileext="" data-parsley-required="" style="display: inline;">
                        <div class="progress" id="progress" style="display:none">
                          <div id="progress-bar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div> 