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

	    // #field-human-pers-rels-values.field-multiple-table tbody tr.draggable td div.control-group div.controls input#edit-field-human-pers-rels-und-0-target-id.form-text
	    // #field-human-pers-rels-values .form-text

	    $('button[name="field_human_pers_rels_add_more"]').click((function(e) {

				//$('#field-human-pers-rels-values .form-text').each(function(i,e) {
			$('[id^="field-human-pers-rels-values"] .controls > .form-text').each(function(i,e) {

				if($(e).siblings('.field-human-pers-rels-fields').length == 0) {
				    
				    $(e).parent().append('<div class="field-human-pers-rels-fields"><div><div><label>Type</label><input class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_human_pers_rels[und][' + i + '][type]" autocomplete="OFF" aria-autocomplete="list"></div><div><label>Person</label><input class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_human_pers_rels[und][' + i + '][person]" autocomplete="OFF" aria-autocomplete="list"></div></div><button class="btn btn-primary form-submit" type="submit" value="new_person" name="field_human_pers_rels[und][' + i + '][op]">+New Person</button></div>');
				}
			    });
		    }).call());
	}
    };
}(jQuery, Drupal));
