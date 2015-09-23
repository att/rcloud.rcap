define([], function() {
	
	var HistoryManager = function() {

		this.initialise = function() {
			window.addEventListener('popstate', function(e) {
				console.log('history manager: popstate');
			});
		};

	};

	return HistoryManager;

});