/**
 * Javascript functionality for Human Forms within the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */

var Islandora = window.Islandora || {};
Islandora.ELC = Islandora.ELC || {};

Islandora.ELC.Human = Islandora.ELC.Human || {};

Islandora.ELC.Relationship = Islandora.ELC.Relationship || {};
Islandora.ELC.Relationship.Form = Islandora.ELC.Relationship.Form || {};
Islandora.ELC.Relationship.Form.KEY = 'IslandoraElcRelForm';

Islandora.ELC.Relationship.Field = Islandora.ELC.Relationship.Field || {};

Islandora.ELC.Relationship.Field.SUBJECT_KEY = 'IslandoraElcRelSubject';
Islandora.ELC.Relationship.Field.OBJECT_KEY = 'IslandoraElcRelObject';
Islandora.ELC.Relationship.Field.ROLE_KEY = 'IslandoraElcRelRole';

Islandora.ELC.Relationship.Field.TITLE_KEY = 'IslandoraElcRelTitle';
Islandora.ELC.Relationship.Field.NID_KEY = 'IslandoraElcRelNid';

Islandora.ELC.Human.Form = function(element, $) {

    // Handle form submissions
    $(element).submit(function(event) {

	    // Retrieve all of the tokens, and append them for the submission
	    $(this).find('.pers-rel-tokens .token').each(function(i, element) {

		    var $token = $(element);
		    var $form = $token.data(Islandora.ELC.Relationship.Form.KEY);
		    var $inputElement = $('<input id="edit-field-human-pers-rels-und-' + i + '-target-id" class="form-text form-autocomplete disable-input-enter-processed" type="text" maxlength="1024" size="60" value="" name="field_human_pers_rels[und][' + i + '][target_id]" autocomplete="OFF" aria-autocomplete="list">').appendTo($form);

		    // Formatting for entityreference depends upon the site configuration (?)
		    var title = $token.data(Islandora.ELC.Relationship.Field.TITLE_KEY);

		    var value = '"' + title + ' (' + $token.data(Islandora.ELC.Relationship.Field.NID_KEY) + ')"';
		    $inputElement.val(value);
		});
	});
};

(function($, Drupal) {

    Drupal.behaviors.dssElcHumanForm = {

	attach: function(context, settings) {

	    /**
	     * Resolves EDDC-96
	     *
	     */
	    //$('[name="field_human_pers_rels_add_more"]').parents('.form-item').prepend($('[name="field_human_pers_rels_add_more"]').parent().detach().show());

	    /**
	     * Instantiate the Form Object
	     *
	     */
	    var form = new Islandora.ELC.Human.Form($('#human-node-form'), $);
	    
	    /*
	     * @author goodnowt function to detect whether form has been loaded after "save & add another" was clicked, and add classes to mark-up accordingly
	     *
	     */
	    if (document.getElementsByClassName('alert alert-block alert-success').length == 1){
			
		$('#edit-field-human-surname-und-0-value').addClass('prepopped');
	    }
	}
    };
}(jQuery, Drupal));