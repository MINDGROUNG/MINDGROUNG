CKEDITOR.plugins.add( 'youtubevideo', {
    requires: 'widget',

    icons: 'youtubevideo',

    init: function( editor ) {
		editor.widgets.add( 'youtubevideo', {
			allowedContent: 'div(!youtubevideo);',
			requiredContent: 'div(youtubevideo)',
			template:
				'<div class="youtubevideo">' +
                '<iframe></iframe>' + 
				'</div>',
			upcast: function( element ) {
				return element.name == 'div' && element.hasClass( 'youtubevideo' );
			}
		} );
	}
} );