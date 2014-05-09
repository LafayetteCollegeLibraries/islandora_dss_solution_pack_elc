/**
 * @file Autocompletion widget
 * @author griffinj@lafayette.edu
 *
 */

(function($, Drupal) {

    /**
     * DssElcAutocomplete Class
     * @constructor
     *
     */
    function DssElcAutocomplete(input, $) {

	this.$ = $;
	this.input = input;
	//this.bindInputHandlers();
    };

    /**
     * Mutator
     * @params [Object] prop [Object] val
     * @returns [Object] val
     */
    DssElcAutocomplete.prototype.set = function(prop, val) {

	this.islandoraDssElc = $(document).data('islandoraDssElc') || {};
	this.islandoraDssElc[prop] = val;
	$(document).data('islandoraDssElc', this.islandoraDssElc);
    };

    /**
     * Accessor
     * @params [Object] prop
     * @returns [Object] val
     */
    DssElcAutocomplete.prototype.get = function(prop) {

	this.islandoraDssElc = $(document).data('islandoraDssElc') || {};
	return this.islandoraDssElc.hasOwnProperty(prop) ? this.islandoraDssElc[prop] : null;
    };

    DssElcAutocomplete.prototype.bindInputHandlers = function() {

	var that = this;
	$(this.input).keydown(function(e) {

		that.keydown(e);
	    });

	$(this.input).keyup(function(e) {

		that.keyup(e);
	    });
    };

    /**
     * Method for tokenizing terms or entity reference ID's from the autocompletion list
     * @params [Event] event
     */
    DssElcAutocomplete.prototype.tokenize = function(event) {

	/**
	 * Work-around
	 * @todo Properly address with one() or once()
	 *
	 */
	event.stopImmediatePropagation();

	//var $fieldElem = $(event.target).parents('.controls').children('input.form-text');
	var $fieldElem = $(this.input);

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
	    //if(islandoraDssElc.hasOwnProperty('autoCompleteItem')) {
	    if(this.get('autoCompleteItem')) {

		$("<li><a href='#' class='token'><span>" + this.get('autoCompleteItem') + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
	    } else {

		$("<li><a href='#' class='token'><span>" + $fieldElem.val() + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
	    }
	    $fieldElem.val('');
	}
    };

    DssElcAutocomplete.prototype.keydown = function(event) {

	event.stopPropagation();

	if((event.which == 188 || event.which == 13) && $(this.input).val().length > 1) {

	    //that.tokenizeTerm(e);
	    this.tokenize(event);
			
	    event.preventDefault();
	}
    };

    DssElcAutocomplete.prototype.keyup = function(event) {

	return this.keydown(event);
    };

    /**
     * DssElcAutocompleteEntityRef Class
     * @constructor
     *
     */
    function DssElcAutocompleteEntityRef(input, $) {

	DssElcAutocomplete.call(this, input, $);
	//this.appendAjaxHandlers();
    };

    /**
     * Declare DssElcAutocompleteEntityRef to be a child class of DssElcAutocomplete
     *
     */
    DssElcAutocompleteEntityRef.prototype = new DssElcAutocomplete();
    DssElcAutocompleteEntityRef.prototype.constructor = DssElcAutocompleteEntityRef;

    DssElcAutocompleteEntityRef.prototype.appendAjaxHandlers = function() {

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

				    /**
				     * @todo Integrate with Drupal 7.x core autocomplete functionality
				     *
				     */
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
    };

    /**
     * For the selection of widget values for entity references
     *
     */
    DssElcAutocompleteEntityRef.prototype.keydown = function(event) {

	if((event.which == 188 || event.which == 13) && $(this.input).val().length > 1) {

	    event.preventDefault();
	    var inputElement = this.input;
	    var $listElem = $(this.input).parents('.controls').find('.reference-autocomplete');
	    
	    //var islandoraDssElc = $(document).data('islandoraDssElc') || {};
	    if($listElem.length == 1) {

		//islandoraDssElc['autoCompleteKey'] = true;
		//islandoraDssElc['autoCompleteItem'] = $listElem.parents('li').data('autocompleteValue');
		this.set('autoCompleteKey', true);
		this.set('autoCompleteItem', $listElem.parents('li').data('autocompleteValue'));
		
		event.target = inputElement;
		that.tokenizeTerm(e);

		//islandoraDssElc['autoCompleteKey'] = false;
		//delete islandoraDssElc['autoCompleteItem'];
		this.set('autoCompleteKey', false);
		this.set('autoCompleteItem', null);

	    } else if($listElem.length == 0) {

		/**
		 * Try to directly query the AJAX endpoint
		 *
		 */
		$(this.input).addClass('throbbing');

		/**
		 * Work-around
		 * One must query Drupal again for the entity ID
		 * (Unfortunately, this cannot be resolved more properly without implementing handling for the Drupal cache)
		 *
		 */
		$.get($(this.input).siblings('.autocomplete').val() + '/' + encodeURI(this.input.value), function(data) {

			$(inputElement).removeClass('throbbing');
			
			var items = Object.keys(data);
			if(items.length > 0) {

			    islandoraDssElc['autoCompleteItem'] = items[0];

			    $(document).data('islandoraDssElc', islandoraDssElc);
				    
			    //$listElem.click();
			    // Work-around
			    event.target = inputElement;
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
					$(this.input).focus();
				    }
				});

			    $(this.input).val('');
			    event.preventDefault();
			}

			/*
			islandoraDssElc['autoCompleteKey'] = false;
			delete islandoraDssElc['autoCompleteItem'];
			$(document).data('islandoraDssElc', islandoraDssElc);
			*/
			this.set('autoCompleteKey', false);
			this.set('autoCompleteItem', null);
		    });
	    }
	}
	//});
    };

    /**
     * jQuery plug-in
     * @params [bool] isEntityRef
     *
     */
    $.fn.dssElcAutocomplete = function(isEntityRef) {

	return this.each(function() {

		/**
		 * If no token list has yet been appended, instantiate the Autocomplete Object
		 * @todo Refactor with one() or once()
		 *
		 */
		if($(this).siblings('.token-list').length == 0) {

		    $(this).before('<ul id="' + $(this).attr('id') + '-tokens" class="token-list"></ul>');

		    /**
		     * Based upon the type of field, instantiate the appropriate Object and bind it to the Element
		     *
		     */
		    if(isEntityRef) {

			$(this).data('islandoraDssElc.autocomplete', new DssElcAutocompleteEntityRef($(this), $));
		    } else {

			$(this).data('islandoraDssElc.autocomplete', new DssElcAutocomplete($(this), $));
			$(this).data('islandoraDssElc.autocomplete').bindInputHandlers();
		    }

		    /**
		     * Event handlers for tokenized terms
		     *
		     */
		    $(document).on('click', '.token', function(event) {

			    event.preventDefault();
			    $(this).parents('li').remove();
			});

		    /**
		     * Event handling for the autocomplete elements (Drupal 7 core)
		     * Limited to Taxonomy terms
		     * @todo Refactor for a plug-in
		     *
		     */
		    $(document).on('click', '#autocomplete .selected div, .reference-autocomplete', function(event) {
		    
			    $(this).parents('.controls').find('.form-text').data('islandoraDssElc.autocomplete').tokenize(event);
			});

		    return this;
		}
	    });
    };

    /**
     * jQuery plug-in integration for Drupal
     *
     */
    Drupal.behaviors.dssElcAutocomplete = {
	attach: function (context, settings) {

	    $(settings.dssElcAutocomplete.fields.entityRefs.join(',')).dssElcAutocomplete(true);
	    
	    $(settings.dssElcAutocomplete.fields.terms.join(',')).dssElcAutocomplete(false);
	}
    };

}(jQuery, Drupal));
