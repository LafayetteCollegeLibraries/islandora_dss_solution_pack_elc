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
				    
				    $(e).parent().append('<div class="field-human-pers-rels-fields"><div><div><label>Type</label><input id="edit-field-pers-rel-role-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_human_pers_rels[und][' + i + '][field_pers_rel_role][und]" autocomplete="OFF" aria-autocomplete="list"></div><div><label>Person</label><input id="edit-field-pers-rel-object-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_human_pers_rels[und][' + i + '][field_pers_rel_object][und]" autocomplete="OFF" aria-autocomplete="list"></div></div><button class="btn btn-primary form-submit" type="submit" value="new_person" name="field_human_pers_rels[und][' + i + '][op]">+New Person</button></div>');
				}
			    });
		    }).call());

	    /**
	     * Event handler for the addition of more personal relationships
	     *
	     */
	    $('[name="field_human_pers_rels_add_more"]').click((function(e) {

			/**
			 * Population of the form fields from the individual 
			 *
			 */
			$('[id^="edit-field-human-pers-rels-und-"].form-text').each(function(i,e) {

				var fieldText = $(e).val();

				/**
				 * Hard-coded regex for the personal-relationship Node title
				 * @todo Refactor
				 *
				 */
				var m = /is a (.+?) in relation to (.+)/.exec(fieldText);

				if(m) {

				    var $roleFieldElem = $(e).parents('.controls').find('#edit-field-pers-rel-role-und');
				    var $objectFieldElem = $(e).parents('.controls').find('#edit-field-pers-rel-object-und');

				    $roleFieldElem.val(m[1]);
				    $objectFieldElem.val(m[2]);
				}
			    });

			/**
			 * For the population of each field-human-pers-rels field based upon the values within the field specifying the Role and Object of each personal relationship
			 *
			 */
			$('#edit-field-pers-rel-role-und, #edit-field-pers-rel-object-und').change(function(e) {
				
				var $relationFieldElem = $(this).parents('.controls').children('.form-text');
				
				if($(this).val().length > 0) {
				    
				    var humanName = $('#edit-field-person-name-und-0-value').val();
				    
				    if($('#edit-field-human-middle-initials-und-0-value').val().length > 0) {
					
					humanName += ' ' + $('#edit-field-human-middle-initials-und-0-value').val();
				    }
				    
				    if($('#edit-field-human-surname-und-0-value').val().length > 0) {
					
					humanName += ' ' + $('#edit-field-human-surname-und-0-value').val();
				    }
				    
				    var $roleFieldElem = $(this).parents('.controls').find('#edit-field-pers-rel-role-und');
				    var $objectFieldElem = $(this).parents('.controls').find('#edit-field-pers-rel-object-und');
			
				    $relationFieldElem.val((humanName + ' is a ' + $roleFieldElem.val() + ' in relation to ' + $objectFieldElem.val().replace(/\(\d+\)/, '')).trim());

				    // Trigger the autocompletion
				    //$relationFieldElem.keyup();
				    $.get('/entityreference/autocomplete/single/field_human_pers_rels/node/human/NULL/' + encodeURI($relationFieldElem.val()), function(data) {

					    var lastEntity = Object.keys(data).pop();
					    $relationFieldElem.val(lastEntity);
				    });
				} else {
				
				    $relationFieldElem.val('');
				}
			    });
		    }).call());
	}
    };
}(jQuery, Drupal));
