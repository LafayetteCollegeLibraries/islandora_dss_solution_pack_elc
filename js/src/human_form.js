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
				
				    /**
				     * Appending additional elements to the DOM
				     * Ideally, this markup would be generated and passed from a hook implementation within Drupal (hook_form_alter() or template_preprocess_hook_form()
				     * However, this would require far more work in order to properly integrate the handling of more complex AJAX responses for the form itself
				     * @todo Decouple and implement within the appropriate Drupal hook implementations
				     *
				     */
				    $(e).parent().append('<div class="field-human-pers-rels-fields"><div><div><label>Type</label><input id="edit-field-pers-rel-role-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_pers_rel_role[und]" autocomplete="OFF" aria-autocomplete="list"></div><div><label>Person</label><input id="edit-field-pers-rel-object-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_pers_rel_object[und]" autocomplete="OFF" aria-autocomplete="list"></div></div><button id="add-human-modal" class="btn btn-primary form-submit add-node-modal" type="submit" value="new_person" name="field_human_pers_rels[und][' + i + '][op]">+New Person</button></div>');
				}
			    });
		    }).call());

	    /**
	     * Event handler for the addition of more personal relationships
	     *
	     */
	    //$(document).on('click', '[name="field_human_pers_rels_add_more"]', function(e) {
	    //$(document).on('click', '[id^="edit-field-human-pers-rels-und-add-more"]', function(e) {
	    $(document).ajaxSend(function(event, jqxhr, settings) {

		    if(settings.url == '/system/ajax') {

			/**
			 * Serialized the form values within the DOM
			 * Again, this should, ideally, be integrated with Drupal hook implementations relating to AJAX response generation
			 * @todo Decouple and implement in Drupal
			 *
			 */
			var islandoraDssElcHumanForm = $(document).data('islandoraDssElcHumanForm') || {};

			/**
			 * Hard-coding the jQuery selector
			 * @todo Refactor
			 */
			$(['edit-field-pers-rel-role-und', 'edit-field-pers-rel-object-und'].map(function(e,i) {
				
				    islandoraDssElcHumanForm[e] = [];
				    return '[id="' + e + '"]:visible';
				}).join(', ')).each(function(i, e) {
			    
					//islandoraDssElcHumanForm[e.id] = islandoraDssElcHumanForm[e.id].concat(e.value || "");
					islandoraDssElcHumanForm[e.id][i] = e.value || "";
				    });
			
			$(document).data('islandoraDssElcHumanForm', islandoraDssElcHumanForm);
		    }
		});

	    //$('[name="field_human_pers_rels_add_more"]').click((function(e) {
	    //$(document).ajaxSuccess((function(event, xhr, settings ) {
	    $(document).ajaxComplete(function(event, xhr, settings) {

		    //console.log(settings);
		    if(settings && /system\/ajax/.exec(settings.url)) {

			// Work-around for autocomplete
			/**
			 * Work-around for enabling autocompletion from multiple elements
			 * @todo Refactor for the invocation of $.once()
			 *
			 */
			//Drupal.behaviors.autocomplete.attach(document, Drupal.settings);

			var acdb = [];
			$('#edit-field-pers-rel-role-und-autocomplete, #edit-field-pers-rel-object-und-autocomplete').each(function(i,e) {

				var uri = this.value;
				if (!acdb[uri]) {

				    acdb[uri] = new Drupal.ACDB(uri);
				}

				/**
				 * Linking the individual input fields with the actual autocompletion widgets
				 *
				 */
				$('[id="' + e.id.substr(0, e.id.length - 13) + '"]:visible').each(function(i, input) {

					var $input = $(input)
					    .attr('autocomplete', 'OFF')
					    .attr('aria-autocomplete', 'list');
				
					$($input[0].form).submit(Drupal.autocompleteSubmit);
					$input.parent()
					    .attr('role', 'application')
					    .append($('<span class="element-invisible" aria-live="assertive"></span>')
						    .attr('id', $input.attr('id') + '-autocomplete-aria-live')
						    );
					new Drupal.jsAC($input, acdb[uri]);

					/**
					 * Populating the fields with serialized values
					 * Should be integrated with Drupal hook implementations relating to AJAX response generation
					 * @todo Decouple and implement in Drupal
					 *
					 */
					var islandoraDssElcHumanForm = $(document).data('islandoraDssElcHumanForm') || {};

					/**
					 * Hard-coding the jQuery selector
					 * @todo Refactor
					 */
					$(['edit-field-pers-rel-role-und', 'edit-field-pers-rel-object-und'].map(function(e,i) {
				
						    return '[id="' + e + '"]:visible';
						}).join(', ')).each(function(i, e) {
			    
							//islandoraDssElcHumanForm[e.id] = islandoraDssElcHumanForm[e.id].concat(e.value);
							$(e).val(islandoraDssElcHumanForm[e.id][i]);
						    });
			
					$(document).data('islandoraDssElcHumanForm', islandoraDssElcHumanForm);
				    });
			    });

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
			//$('#edit-field-pers-rel-role-und, #edit-field-pers-rel-object-und').change(function(e) {
			$('#edit-field-pers-rel-role-und, #edit-field-pers-rel-object-und').keydown(function(e) {
				
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
		    }
		});

	    /**
	     * Modify the DOM for the addition of tokenized form values
	     * @todo Refactor for a plug-in
	     *
	     */
	    //$.each(['#edit-field-human-occupation-und', '#edit-field-person-membership-und', '#edit-field-person-location-und', '#edit-field-person-type-und'], function(i, elementId) {
	    $('#edit-field-human-occupation-und, #edit-field-person-membership-und, #edit-field-person-location-und, #edit-field-person-type-und').each(function(i, elementId) {

		    var $elementId = $(elementId);
		    /**
		     * Work-around
		     * @todo Refactor
		     **/
		    if($elementId.siblings('.token-list').length == 0) {

			$(elementId).before('<ul id="' + $(elementId).attr('id') + '-tokens" class="token-list"></ul>');
		    }
		});

	    /**
	     * Refactoring the tokenization functionality
	     *
	     */
	    this.tokenizeTerm = function(e) {

		e.stopImmediatePropagation();

		var $fieldElem = $(e.target).parents('.controls').children('input.form-text');

		// Only tokenize for non-existing values
		if($fieldElem.val() && $fieldElem.siblings('.token-list').find('.token').filter(function(i,token) {

			    return $(token).children('span:first').text() == $fieldElem.val();
			}).length == 0) {

		    var islandoraDssElc = $(document).data('islandoraDssElc') || {};

		    /**
		     * For now, only implementing for default language encoding
		     * @todo Restructure for extended languages and character sets
		     *
		     */

		    if(islandoraDssElc.hasOwnProperty('autoCompleteItem')) {

			$("<li><a href='#' class='token'><span>" + islandoraDssElc['autoCompleteItem'] + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		    } else {

			$("<li><a href='#' class='token'><span>" + $fieldElem.val() + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		    }
		    $fieldElem.val('');
		}
	    };

	    var that = this;

	    /**
	     * Event handlers for tokenized terms
	     *
	     */
	    $(document).on('click', '.token', function(e) {

		    e.preventDefault();
		    $(this).parents('li').remove();
		});

	    /**
	     * Event handling for the autocomplete elements (Drupal 7 core)
	     * Limited to Taxonomy terms
	     * @todo Refactor for a plug-in
	     *
	     */
	    $(document).on('click', '#autocomplete .selected div, .reference-autocomplete', function(e) {

		    that.tokenizeTerm(e);
		});

	    /**
	     * Handling for fields which reference other Drupal entities
	     *
	     */
	    $(document).on('keydown', '#edit-field-person-membership-und, #edit-field-person-location-und', function(e) {
		    
		    if((e.which == 188 || e.which == 13) && $(this).val().length > 1) {

			e.preventDefault();
			var inputElement = this;
			var $listElem = $(this).parents('.controls').find('.reference-autocomplete');

			var islandoraDssElc = $(document).data('islandoraDssElc') || {};
			if($listElem.length == 1) {

			    islandoraDssElc['autoCompleteKey'] = true;
			    // ('li').data('autocompleteValue')
			    islandoraDssElc['autoCompleteItem'] = $listElem.parents('li').data('autocompleteValue');

			    //$listElem.click();
			    // Work-around
			    e.target = inputElement;
			    that.tokenizeTerm(e);

			    islandoraDssElc['autoCompleteKey'] = false;
			    delete islandoraDssElc['autoCompleteItem'];
			    //islandoraDssElc['autoCompleteItem'] = null;
			    $(document).data('islandoraDssElc', islandoraDssElc);

			    /*
			    /**
			     * Work-around
			     * One must query Drupal again for the entity ID
			     * (Unfortunately, this cannot be resolved more properly without implementing handling for the Drupal cache)
			     *
			     * /
			    $.get($(this).siblings('.autocomplete').val() + '/' + encodeURI($listElem.text()), function(data) {
			
				    var items = Object.keys(data);
				    if(items.length > 0) {

					/*
					var m = /(".+?")/.exec(items[0]);
					if(m) {

					   islandoraDssElc['autoCompleteItem'] = m[1];
					}
					* /

					islandoraDssElc['autoCompleteItem'] = items[0];
				    }

				    $(document).data('islandoraDssElc', islandoraDssElc);

				    //$listElem.click();
				    // Work-around
				    e.target = inputElement;
				    that.tokenizeTerm(e);

				    islandoraDssElc['autoCompleteKey'] = false;
				    delete islandoraDssElc['autoCompleteItem'];
				    //islandoraDssElc['autoCompleteItem'] = null;
				    $(document).data('islandoraDssElc', islandoraDssElc);
				});
			    */

			    /*
			    $(document).data('islandoraDssElc', islandoraDssElc);

			    $listElem.click();
			    e.preventDefault();

			    islandoraDssElc['autoCompleteKey'] = false;
			    //delete islandoraDssElc['autoCompleteItem'];
			    islandoraDssElc['autoCompleteItem'] = null;
			    $(document).data('islandoraDssElc', islandoraDssElc);
			    */
			} else if($listElem.length == 0) {

			    // Try again
			    $(this).addClass('throbbing');
			    //$(this.ariaLive).html(Drupal.t('Searching for matches...'));

			    /**
			     * Work-around
			     * One must query Drupal again for the entity ID
			     * (Unfortunately, this cannot be resolved more properly without implementing handling for the Drupal cache)
			     *
			     */
			    $.get($(this).siblings('.autocomplete').val() + '/' + encodeURI(this.value), function(data) {

				    $(inputElement).removeClass('throbbing');
			
				    var items = Object.keys(data);
				    if(items.length > 0) {

					islandoraDssElc['autoCompleteItem'] = items[0];

					$(document).data('islandoraDssElc', islandoraDssElc);
				    
					//$listElem.click();
					// Work-around
					e.target = inputElement;
					that.tokenizeTerm(e);
					
					// Cancel the autocomplete search
					$(inputElement).blur();
				    } else {

					/**
					 * No entities, render the dialog
					 *
					 */
					$('<div class="form-alert-dialog" title="Error"><p>This entity does not exist!</p></div>').appendTo('.main-container').dialog({
						modal: true,

						    close: function(event, ui) {
				    
						    $('#form-alert-dialog').remove();
						    $(this).focus();
						}
					    });

					$(this).val('');
					e.preventDefault();
				    }

				    islandoraDssElc['autoCompleteKey'] = false;
				    delete islandoraDssElc['autoCompleteItem'];
				    //islandoraDssElc['autoCompleteItem'] = null;
				    $(document).data('islandoraDssElc', islandoraDssElc);
				});
			}
		    }
		});

	    /**
	     * Handling for the tokenization of specific fields
	     * @todo Abstract as a plug-in
	     *
	     */
	    $(document).on('keydown', '#edit-field-human-occupation-und, #edit-field-person-type-und', function(e) {

		    e.stopPropagation();

		    if((e.which == 188 || e.which == 13) && $(this).val().length > 1) {

			that.tokenizeTerm(e);
			
			e.preventDefault();
		    }
		});
	}
    };
}(jQuery, Drupal));
