/**
 * Javascript functionality for Human Forms within the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */
(function($, Drupal) {

    Drupal.behaviors.dssElcHumanForm = {

	attach: function(context, settings) {

	    //edit-field-person-name-und-0-value
	    //edit-field-human-middle-initials-und-0-value
	    //edit-field-human-surname-und-0-value
	    $('#edit-field-person-name-und-0-value').attr('tabindex', '1');
	    $('#edit-field-human-middle-initials-und-0-value').attr('tabindex', '2');
	    $('#edit-field-human-surname-und-0-value').attr('tabindex', '3');

	    $('#edit-publish').attr('tabindex', '4');
	}
    }
}(jQuery, Drupal));
