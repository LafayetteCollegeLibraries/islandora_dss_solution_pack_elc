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
	}
    };
}(jQuery, Drupal));
