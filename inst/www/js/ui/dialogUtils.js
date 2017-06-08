define(['rcap/js/vendor/jqModal.min'], function () {

  'use strict';

  var DialogUtils = function() {
    this.initialise = function () {

      var sizeModalBodyHeight = function (modal) {

        var availableHeight = $(/*document*/window).height() - 165;
        var maxHeight = modal.find('.body').data('maxheight');

        var $modalBody = modal.find('.body');

        if (!maxHeight) {
          var initialHeight = modal.find('.body').height();

          if (initialHeight > availableHeight) {
            $modalBody.height(availableHeight + 'px');
          } else {
            $modalBody.height(initialHeight + 'px');
          }

          modal.find('.body').data('maxheight', initialHeight);

        } else {

          if (maxHeight === 'useavailable') {
            $modalBody.height(availableHeight + 'px');
          } else {
            if (availableHeight > maxHeight) {
              $modalBody.height(maxHeight + 'px');
            } else {
              $modalBody.height(availableHeight + 'px');
            }
          }
        }
      };

      // initialise each of the dialogs:
      $('.jqmWindow').each(function () {
        $(this).jqm({
          modal: true,
          onShow: function (hash) {

            // display the overlay (prepend to body) if not disabled
            if (hash.c.overlay > 0) {
              hash.o.prependTo('body');
            }

            // make modal visible
            hash.w.show();

            // call focusFunc (attempts to focus on first input in modal)
            $.jqm.focusFunc(hash.w, null);

            sizeModalBodyHeight(hash.w);

            return true;
          },
          onHide: function (hash) {

            // hide modal and if overlay, remove overlay.
            hash.w.hide();
            hash.o.remove();

            hash.w.find('body').removeData('maxheight');

            return true;
          }
        });
      });

      $(window).resize(function () {
        sizeModalBodyHeight($('.jqmWindow:visible'));
      });
    };
  };

  return DialogUtils;
});
