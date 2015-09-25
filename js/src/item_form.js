/**
 * Javascript functionality for Item Forms within the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */
(function($, Drupal) {

    Drupal.behaviors.dssElcItemForm = {

	attach: function(context, settings) {

		/*
		* @author goodnowt function to detect whether form has been loaded after "save & add another" was clicked, and add classes to mark-up accordingly 
		* 
		*/
		if (document.getElementsByClassName('alert alert-block alert-success').length == 1) {

		    $('#edit-field-artifact-was-authored-by-und').addClass('prepopped');
		}
		
		/*
		 * @author goodnowt add proper example text for initial publication date 
		 * 
		 */
		$('#edit-field-initial-publication-date-und-0-value-date').attr({
			
			value: 'YYYY'
		    });
		
		$('#edit-field-initial-publication-date-und-0-value-date').focus(function() {

			if ($('#edit-field-initial-publication-date-und-0-value-date').attr('value') == 'YYYY') {

			    $('#edit-field-initial-publication-date-und-0-value-date').attr({ value: '' });
			};
		    });
			
		$('#edit-field-initial-publication-date-und-0-value-date').blur(function() {
			
			if ($('#edit-field-initial-publication-date-und-0-value-date').attr('value') == ''){
					
			    $('#edit-field-initial-publication-date-und-0-value-date').attr({ value: 'YYYY' });
			};
		    });

		/* 
		 *   @author goodnowt everything here onward commented out so this file could be reincluded on item form  
		 */
		
	}
    };
}(jQuery, Drupal));
