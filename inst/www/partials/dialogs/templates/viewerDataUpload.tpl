            <div class="row">
                <div class="col-md-4">
                    <label for="datasetName">Dataset name</label>
                </div>
                <div class="col-md-8">
                    <input type="text" class="form-control" id="datasetName" placeholder="" spellcheck="false" required="" data-parsley-trigger="change">
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <label for="description">Description</label>
                </div>
                <div class="col-md-8">
                    <input type="text" class="form-control" id="description" placeholder="" spellcheck="false" required="" data-parsley-trigger="change">
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <label for="file">File</label>
                </div>
                <div class="col-md-8">
                  <div id="file-upload-div">
                    <div id="file-upload-wrapper">
                      <div id="file-upload-controls" class="btn-group-sm">
                        <input type="file" id="file-upload-file" style="display: inline;">
                        <div class="progress" id="progress" style="">
                          <div id="progress-bar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>