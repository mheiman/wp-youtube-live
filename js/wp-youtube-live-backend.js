/**
 * Set up object
 */
var wpYTdata = {
    isAjax: true
};

(function($){
    $(document).ready(function(){
        // match indexed names like youtube_live_settings[fallback_behavior], [0], [1], ...
        var fallbackSelector = $('select[name^="youtube_live_settings[fallback_behavior]"]');

        // initialize each select individually
        fallbackSelector.each(function(){
            updateFallbackOptions($(this));
        });

        // update only the row/context for the changed select
        fallbackSelector.on('change', function() {
            updateFallbackOptions($(this));
        });

        $('body').on('click', 'button#updatewpYTUpcomingCache', function(event) {
            event.preventDefault();
            wpYTdata.action = $(this).data('action');
            wpYTdata.nonce = $(this).data('nonce');
            wpYTsendRequest(wpYTdata);
        });

		/** Handle dismissable notices */
		$(document).on('click', '.wp-youtube-live-notice .notice-dismiss', function(e) {
			var version = $(this).parents('.wp-youtube-live-notice').data('version');

			$.ajax({
				url: ajaxurl,
				data: {
					action: 'wp_youtube_live_dismiss_notice_' + version
				}
			});

		});
    });

    /**
     * Show/hide additional info
     * @param {object} fallbackSelector jQuery selector object
     */
    function updateFallbackOptions(fallbackSelector) {
        var selectedFallback = fallbackSelector.val();

        // find the nearest logical container that groups the select and its related fallback elements
        var $context = fallbackSelector.closest('tr');
        if (0 === $context.length) {
            // fallback to document if no container found (very defensive)
            $context = $(document);
        }

        // scope all finders to the context so only elements in the same row/group are affected
        var fallbackAll = $context.find('.fallback'),
            fallbackMessage = $context.find('.fallback.message'),
            fallbackUpcoming = $context.find('.fallback.upcoming'),
            fallbackPlaylist = $context.find('.fallback.playlist'),
            fallbackVideo = $context.find('.fallback.video');

        if (selectedFallback == 'message') {
            fallbackAll.slideUp();
            fallbackMessage.slideDown();
        } else if (selectedFallback == 'upcoming') {
            fallbackAll.slideUp();
            fallbackUpcoming.slideDown();
        } else if (selectedFallback == 'playlist') {
            fallbackAll.slideUp();
            fallbackPlaylist.slideDown();
        } else if (selectedFallback == 'video') {
            fallbackAll.slideUp();
            fallbackVideo.slideDown();
        } else {
            fallbackAll.slideUp();
        }
    }

    /**
     * Send ajax request
     * @param {object} wpYTdata data sent to server
     */
    function wpYTsendRequest(wpYTdata) {
        $('.wp-youtube-live-upcoming-cache').html('<p>Flushing cache&hellip;</p>');
        $('.spinner').css({'visibility': 'visible'});
        $.ajax({
            method: "POST",
            url: ajaxurl,
            data: wpYTdata
        })
        .done(function(response) {
            var requestData = JSON.parse(response);
            $('.wp-youtube-live-upcoming-cache').html(requestData);
        })
        .always(function() {
            $('.spinner').css({'visibility': 'hidden'});
        })
    }

})(jQuery);
