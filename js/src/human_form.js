/**
 * Javascript functionality for Human Forms within the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */
(function($, Drupal) {

    Drupal.behaviors.dssElcHumanForm = {

	attach: function(context, settings) {

	    /**
	     * Resolves EDDC-96
	     *
	     */
	    //$('[name="field_human_pers_rels_add_more"]').parents('.form-item').prepend($('[name="field_human_pers_rels_add_more"]').parent().detach().show());
	    
	    /*
	     * @author goodnowt function to detect whether form has been loaded after "save & add another" was clicked, and add classes to mark-up accordingly
	     */
	    
	    if (document.getElementsByClassName('alert alert-block alert-success').length == 1){
			
			$('#edit-field-human-surname-und-0-value').addClass('prepopped');
			
		}
		
	}
    };
}(jQuery, Drupal));