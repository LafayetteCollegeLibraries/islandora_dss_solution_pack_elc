
/**
 * @file Autocompletion widget
 * @author griffinj@lafayette.edu
 *
 */

(function($, Drupal) {

    function DssElcAutocomplete(input) {

	this.input = input;
	//this.bindInputHandlers();

	//$('.node-loan').data('dssElcAutocomplete', this);

	/**
	 * Handling for the submission of node forms
	 *
	 * Not efficient
	 * @todo Refactor
	 *
	 */
	/*
	var data = $('.node-form').data('islandoraDssElc.autocomplete') || [];
	data = data.concat(this);

	// Recursive relationship should be refactored
	this.form = $('.node-form')[0];
	$('.node-form').data('islandoraDssElc.autocomplete', data);
	*/
	/*

	$(document).ready(function() {

		$('.node-loan').submit(function(e) {

			DssElcAutocomplete.submit.call(this, e);
		    });
	    });
	*/

	if(this.input && this.input.val()) {
		
		 //resolves EDDC-318
		 if(this.input.attr('id') == 'edit-field-artifact-was-authored-by-und'){
			var authors = $('#edit-field-artifact-was-authored-by-und').val();
			if(authors != ''){
				
				var author_array = authors.split(',');
				for(var i = 0;i<author_array.length;i++){
					
					$('#edit-field-artifact-was-authored-by-und').val(author_array[i]);
					this.tokenizeField(this.input);
				};
				
			}
			return;
		}
	    this.tokenizeField(this.input);
	}
    };

    /**
     * Static Methods
     *
     */ 
    DssElcAutocomplete.onSubmitHandler = function(e) {

	$.each($(this).data('islandoraDssElc.autocomplete'), (function(i, autocomplete) {

		    if($('#' + autocomplete.input.attr('id') + '-tokens li a').length > 0) {
			
			// Specific to loan forms
			/**
			 * @todo Refactor
			 *
			 */
			if($('[name="field_bib_rel_object[und]"]').length > 1) {
				
			    $('[name="field_bib_rel_object[und]"]:first').remove();
			}
			    
			$('#' + autocomplete.input.attr('id') + '-tokens li a span.token-object').each(function(j, item) {
					    
				    /**
				     * @todo Refactor
				     *
				     */
				    if($(item).text() == '×'){
				    	return;
				    }
				    var inputValue = $(item).text().replace(/^"(.+)"$/, '$1');
				    var inputName = $(item).parents('.token-list').siblings('.form-text').attr('name').replace(/\[\d\]/, '[' + j + ']');
				    
				    $('.node-form').append('<input class="form-text required form-autocomplete" type="text" maxlength="1024" size="60" value="' + inputValue + '" name="' + inputName + '" autocomplete="OFF" aria-autocomplete="list" style="display:none"></input>');
				    
				    var finalInput = jQuery.unique(jQuery('input[name="' + inputName + '"]').slice(1).map(function(i,e){
				    	
					    return e.defaultValue;
				    	
				    	})).toArray().join(',   ');
				    	
				var $lastElem = $('input[name="' + inputName + '"]');
				    
				$lastElem.val(finalInput);

				/**
				 * Retrieve the volumes from the tokens and append them to the hidden element #edit-field-loan-volumes-text-und-0-value
				 *
				 */
				$(item).siblings('span.token-volumes').each(function(j, item) {
					    
					inputValue = $(item).text().replace(/^\((.+)\)$/, '$1');
					    
					var nameIndex = $('[name="field_bib_rel_object[und][0][target_id]"]').filter(function(i,e) {
						    
						return $(e).val();
					    }).length;
					    
					$('.node-form').append('<input id="edit-field-loan-volumes-text-und-0-value" class="text-full form-text" type="text" maxlength="255" size="60" value="' + inputValue + '" name="field_loan_volumes_text[und][' + nameIndex + '][value]" style="display:none">');
				    });

				/**
				 * Retrieve the issues from the tokens and append them to the hidden element #edit-field-loan-volumes-text-und-0-value
				 *
				 */
				$(item).siblings('span.token-issues').each(function(j, item) {
					    
					inputValue = $(item).text().replace(/^\((.+)\)$/, '$1');
					    
					var nameIndex = $('[name="field_bib_rel_object[und][0][target_id]"]').filter(function(i,e) {
						    
						return $(e).val();
					    }).length;
					    
					$('.node-form').append('<input id="edit-field-loan-issues-text-und-0-value" class="text-full form-text" type="text" maxlength="255" size="60" value="' + inputValue + '" name="field_loan_issues_text[und][' + nameIndex + '][value]" style="display:none">');
				    });
				    
			    });
		    }
		})
	    );
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

    /**
     * Binding of keydown and keyup events
     *
     */
    DssElcAutocomplete.prototype.bindInputHandlers = function() {

	var that = this;
	$(this.input).keydown(function(e) {

		//that.keydown(e);
		$(this).data('islandoraDssElc.autocomplete').keydown(e);
	    });

	$(this.input).keyup(function(e) {

		//that.keyup(e);
		$(this).data('islandoraDssElc.autocomplete').keyup(e);
	    });
    };

    /**
     * Method for tokenizing the actual field values
     * @todo Refactor with tokenize() and DssElcAutocompleteLoan.tokenizeField()
     *
     */
    DssElcAutocomplete.prototype.tokenizeField = function($fieldElem) {

	// Only tokenize for non-existing values
	if($fieldElem.val() && $fieldElem.siblings('.token-list').find('.token').filter(function(i,token) {

		    return $(token).children('span:first').text() == $fieldElem.val();
		}).length == 0) {

	    var islandoraDssElc = $(document).data('islandoraDssElc') || {};
	    var items = this.get('autoCompleteItem') ? [ this.get('autoCompleteItem') ] : $fieldElem.val().split(',');

	    //$.each(items, function(i, val) {
	    for(var i in items) {

		    var val = items[i];

		    /**
		     * For now, only implementing for default language encoding
		     * @todo Restructure for extended languages and character sets
		     *
		     */
		    if(this.get('autoCompleteItem')) {
			
			$("<li><a href='#' class='token'><span class='token-object'>" + this.get('autoCompleteItem') + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		    } else {
		    
			$("<li><a href='#' class='token'><span class='token-object'>" + val + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		    }
		    //});
	    }
	    $fieldElem.val('');
	}
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
	this.tokenizeField($fieldElem);

    };

    DssElcAutocomplete.prototype.keydown = function(event) {

	event.stopPropagation();

	if((event.which == 188 || event.which == 13) && $(this.input).val().length > 1) {

	    event.preventDefault();
	}
    };

    /**
     * @todo Is this being called twice?
     *
     */
    DssElcAutocomplete.prototype.keyup = function(event) {

	return this.keydown(event);
    };

    DssElcAutocompleteEntityRef.submit = function(e, callback) {

	console.log(this);
	return callback(e);
    };

    /**
     * DssElcAutocompleteEntityRef Class
     * @constructor
     *
     */
    function DssElcAutocompleteEntityRef(input, $) {

	DssElcAutocomplete.call(this, input, $);
	this.bindAjaxHandlers();
    };

    /**
     * Declare DssElcAutocompleteEntityRef to be a child class of DssElcAutocomplete
     *
     */
    DssElcAutocompleteEntityRef.prototype = new DssElcAutocomplete();
    DssElcAutocompleteEntityRef.prototype.constructor = DssElcAutocompleteEntityRef;

    /**
     * Method for tokenizing actual values
     * @todo Refactor with tokenize()
     */
    DssElcAutocompleteEntityRef.prototype.tokenizeField = function($fieldElem) {

	// Only tokenize for non-existing values (?)
	if($fieldElem.val() && $fieldElem.siblings('.token-list').find('.token').filter(function(i,token) {
		    
		    return $(token).children('span:first').text() == $fieldElem.val();
		}).length == 0) {

	    var islandoraDssElc = $(document).data('islandoraDssElc') || {};

	    //edit-field-bib-rel-object-und-0-target-id
	    //jQuery('[id^="edit-field-bib-rel-object-und-"].form-text')

	    //edit-field-human-pers-rels-und-0-target-id
	    //jQuery('[id^="edit-field-human-pers-rels-und-"].form-text')

	    //var items = this.get('autoCompleteItem') ? [ this.get('autoCompleteItem') ] : $fieldElem.val().split(',');

	    var items;
	    var elems = $('[id^="' + /(.+?und)/.exec($fieldElem.attr('id'))[1] + '"].form-text');
	    if(elems.length > 1) {

		items = elems.map(function(i,e) { return $(e).val(); }).filter(function(i,e) { return e; });
		elems.slice(1).remove();
	    } else if($fieldElem.val().indexOf(',') > 0) {
		
		//items = this.get('autoCompleteItem') ? [ this.get('autoCompleteItem') ] : $fieldElem.val().split(',');
		items = $fieldElem.val().split(',   ').map(function(e) {
			
			return (e.slice(-1) == '"') ? e : e ;
		    });
	    } else {

		items = this.get('autoCompleteItem') ? [ this.get('autoCompleteItem') ] : $fieldElem.val().split();
	    }

	    $.each(items, function(i, val) {
	    //for(var i in items) {

		    //var val = items[i];
		    item = '<span class="token-object">' + val + '</span>';

		    /**
		     * Resolve issues related to functionality for parsing the fields specific to the Loan form
		     * @todo Abstract
		     */
		    if($('#edit-field-loan-volumes-text-und-0-value').val()) {

			item += '<span class="token-volumes">(' + $('#edit-field-loan-volumes-text-und-0-value').val() + ')</span>';
			$('#edit-field-loan-volumes-text-und-0-value').val('');
		    }
		    if($('#edit-field-loan-issues-text-und-0-value').val()) {

			item += '<span class="token-issues">(' + $('#edit-field-loan-issues-text-und-0-value').val() + ')</span>';
			$('#edit-field-loan-issues-text-und-0-value').val('');
		    }
		    
		    $("<li><a href='#' class='token'>" + item + "<span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		});
	    //}
	    $fieldElem.val('');
	}
    };

    DssElcAutocompleteEntityRef.prototype.bindAjaxHandlers = function() {

	/**
	 * Event handler for the addition of more personal relationships
	 *
	 */

	//$(document).on('click', '[name="field_human_pers_rels_add_more"]', function(e) {
	//$(document).on('click', '[id^="edit-field-human-pers-rels-und-add-more"]', function(e) {
	$(document).ajaxSend(function(event, jqxhr, settings) {

		if(settings.url == '/system/ajax') {

		    if(/_add_more$/.test(settings.extraData._triggering_element_name)) {

			//console.log(settings);
			//field_bib_rel_object[und][0][target_id] = Testing
		    } else {

			/**
			 * Serialize the form values within the DOM
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
		}
	    });

	//$('[name="field_human_pers_rels_add_more"]').click((function(e) {
	//$(document).ajaxSuccess((function(event, xhr, settings ) {
	$(document).ajaxComplete(function(event, xhr, settings) {

		if(settings && /system\/ajax/.exec(settings.url)) {
		    
		    // Work-around for autocomplete
		    /**
		     * Work-around for enabling autocompletion from multiple elements
		     * @todo Refactor for the invocation of $.once()
		     * @see autocomplete.js (Lines 8 - 23)
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
				    new Drupal.jsAC($input, acdb[uri]); // This finalizes the Drupal autocomplete.js integration

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

	    // @todo Refactor
	    //event.stopImmediatePropagation();
	    event.preventDefault();
	    var inputElement = this.input;

	    var $listElem = $(this.input).parents('.controls').find('.form-autocomplete');
	    //var ajaxComplete = $(document).data('islandoraDssElc.autocomplete.ajaxComplete');



	    while(false && !$(document).data('islandoraDssElc.autocomplete.ajaxComplete')) {

		//$(this.input).parents('.controls').find('.reference-autocomplete');

		/**
		 * @todo Integrate support for MutationObservers, DOMAttrModified, and propertychange
		 *
		 */

		/*
		if(MutationObserver) {

		    var observer = new MutationObserver(function(mutations) {

			    mutations.forEach(function(mutation){

				    callback.call(that, mutation);
				});
			});

		    observer.observe(this, { subtree: false, attributes: true });
		} else if(isEventSupported('DOMAttrModified', div)) {

		    $el.on('DOMAttrModified', callback);
		} else if(isEventSupported('propertychange', div)) {

		    $el.on('propertychange', callback);

		} else {

		    setInterval(function(){ check.call(that, $el); }, options.throttle);
		}
		*/
		

	    }
	    
	    //var islandoraDssElc = $(document).data('islandoraDssElc') || {};
	    if($listElem.length > 0) {
		//if(false) {

		//islandoraDssElc['autoCompleteKey'] = true;
		//islandoraDssElc['autoCompleteItem'] = $listElem.parents('li').data('autocompleteValue');
		this.set('autoCompleteKey', true);
		var listItem = $listElem.parents('li.selected').length > 0 ? $listElem.parents('li.selected').data('autocompleteValue') : $listElem.parents('li:first').data('autocompleteValue');
		this.set('autoCompleteItem', listItem);

		/**
		 * Additional handling for volumes and issues
		 */
		this.set('autoCompleteVolumes', listItem);
		this.set('autoCompleteIssues', listItem);
		
		event.target = inputElement;
		//this.tokenizeTerm(event);
		this.tokenize(event);

		//islandoraDssElc['autoCompleteKey'] = false;
		//delete islandoraDssElc['autoCompleteItem'];
		this.set('autoCompleteKey', false);
		this.set('autoCompleteItem', null);
		this.set('autoCompleteVolumes', null);
		this.set('autoCompleteIssues', null);

	    } else if(true) {

		$(document).data('islandoraDssElc.autocomplete.poll', this);
		$(document).data('islandoraDssElc.autocomplete.pollEvent', event);
		$(document).data('islandoraDssElc.autocomplete.timeInit', +new Date());
		//$(document).data('islandoraDssElc.autocomplete.timeElapsed', 0);

		// No time-effective and safe manner by which to hook in to the autocomplete functionality for Drupal 7.x
		// Polling the DOM for changes until the AJAX submission is complete...
		/**
		 * Synchronously poll the DOM state
		 *
		 */
		var intervalId = setInterval(function() {

			var context = $(document).data('islandoraDssElc.autocomplete.poll');
			var event = $(document).data('islandoraDssElc.autocomplete.pollEvent');
			var timeElapsed = +new Date() - $(document).data('islandoraDssElc.autocomplete.timeInit');

			/**
			 * @todo Investigate as to why islandoraDssElc.autocomplete.pollInterval is still accessible but not islandoraDssElc.autocomplete.poll
			 *
			 */
			if(!context || (timeElapsed > 1000)) {

			    clearInterval($(document).data('islandoraDssElc.autocomplete.pollInterval'));
			    $(document).data('islandoraDssElc.autocomplete.poll', null);
			    $(document).data('islandoraDssElc.autocomplete.pollEvent', null);
			} else {

			    var $listElem = $(context.input).parents('.controls').find('.reference-autocomplete');

			    if($listElem.length > 0) {

				//$(document).data('islandoraDssElc.autocomplete.ajaxComplete', $(this.input).parents('.controls').find('.reference-autocomplete').length);

				//islandoraDssElc['autoCompleteKey'] = true;
				//islandoraDssElc['autoCompleteItem'] = $listElem.parents('li').data('autocompleteValue');
				context.set('autoCompleteKey', true);
				context.set('autoCompleteItem', $listElem.parents('li.selected').data('autocompleteValue'));
		
				event.target = inputElement;
				context.tokenize(event);

				//islandoraDssElc['autoCompleteKey'] = false;
				//delete islandoraDssElc['autoCompleteItem'];
				context.set('autoCompleteKey', false);
				context.set('autoCompleteItem', null);

				clearInterval($(document).data('islandoraDssElc.autocomplete.pollInterval'));
				$(document).data('islandoraDssElc.autocomplete.poll', null);
				$(document).data('islandoraDssElc.autocomplete.pollEvent', null);
			    }
			}
		    }, 250);
		$(document).data('islandoraDssElc.autocomplete.pollInterval', intervalId);

	    } else if(false) {

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
     * DssElcAutocompleteLoan Class
     * @constructor
     *
     */
    function DssElcAutocompleteLoan(input, $) {

	DssElcAutocompleteEntityRef.call(this, input, $);
    };
    
    /**
     * Declare DssElcAutocompleteLoan to be a child class of DssElcAutocompleteEntityRef
     *
     */
    DssElcAutocompleteLoan.prototype = new DssElcAutocompleteEntityRef();
    DssElcAutocompleteLoan.prototype.constructor = DssElcAutocompleteLoan;

    /**
     * DssElcAutocompleteHuman Class
     * @constructor
     *
     */
    function DssElcAutocompleteHuman(input, $) {

	DssElcAutocompleteEntityRef.call(this, input, $);
    };

    /**
     * Declare DssElcAutocompleteHuman to be a child class of DssElcAutocompleteEntityRef
     *
     */
    DssElcAutocompleteHuman.prototype = new DssElcAutocompleteEntityRef();
    DssElcAutocompleteHuman.prototype.constructor = DssElcAutocompleteHuman;

    /**
     * Specific to the field field_human_pers_rels_add_more
     *
     */
    DssElcAutocompleteHuman.prototype.bindAddModel = function() {

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
				$(e).parent().append('<div class="field-human-pers-rels-fields"><div><div><label>Type</label><input id="edit-field-pers-rel-role-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_pers_rel_role[und]" autocomplete="OFF" aria-autocomplete="list"></div><div><label>Person</label><input id="edit-field-pers-rel-object-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_pers_rel_object[und]" autocomplete="OFF" aria-autocomplete="list"></div></div><button id="add-human-modal" class="btn btn-primary form-submit add-node-modal" type="button" value="new_person" name="field_human_pers_rels[und][' + i + '][op]">Add Person Record</button></div>');
			    }
			});
		}).call());
    };

    DssElcAutocompleteHuman.prototype.bindAjaxHandlers = function() {

	/**
	 * For storing the value of the autocompletion widgets within the DOM
	 *
	 */
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

	$(document).ajaxComplete(function(event, xhr, settings) {

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
				     * Instantiate and bind the Drupal 7.x core autocomplete widget for the input fields
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
     * jQuery plug-in
     * @params [bool] isEntityRef
     *
     */
    $.fn.dssElcAutocomplete = function(options) {

	//settings = $.extend(options, {type: DssElcAutocomplete});
	settings = $.extend({
		type: DssElcAutocomplete,
		context: document
	    }, options);
	DssElcAutocompleteClass = settings.type;
	var context = settings.context;

	// Append the form submission handler for the current form
	$(context).find('.node-form').submit(DssElcAutocomplete.onSubmitHandler);

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
		    $(this).data('islandoraDssElc.autocomplete', new DssElcAutocompleteClass($(this), $));
		    $(this).data('islandoraDssElc.autocomplete').bindInputHandlers();

		    /**
		     * Handling for the submission of node forms
		     *
		     * Not efficient
		     * @todo Refactor
		     *
		     */
		    // Bind the Objects to the forms within the DOM themselves
		    var data = $('.node-form').data('islandoraDssElc.autocomplete') || [];
		    data = data.concat($(this).data('islandoraDssElc.autocomplete'));

		    $('.node-form').data('islandoraDssElc.autocomplete', data);

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
		    
			    
			    //$(this).parents('.controls').find('.form-text').data('islandoraDssElc.autocomplete').tokenize(event);
			    var autocomplete = $(this).parents('.controls').find('.form-text').data('islandoraDssElc.autocomplete');
			    if(autocomplete) {

				autocomplete.tokenize(event);
			    }
			});
			$(this).on('keyup', '#autocomplete .selected div, .reference-autocomplete', function(event) {
		    
			    if(event.which == 13){
				    //$(this).parents('.controls').find('.form-text').data('islandoraDssElc.autocomplete').tokenize(event);
				    var autocomplete = $(this).parents('.controls').find('.form-text').data('islandoraDssElc.autocomplete');
				    if(autocomplete) {
	
						autocomplete.tokenize(event);
					
			    	}
		    	}
			});
		    return this;
		}
	    });
    };

    /**
     * jQuery plug-in
     * @params [bool] isEntityRef
     *
     */
    $.fn.dssElcAutocompleteForm = function(context, settings) {

	var FIELD_CLASS_MAP = {loans: DssElcAutocompleteLoan,
			       entityRefs: DssElcAutocompleteEntityRef };
	for(var field in FIELD_CLASS_MAP) {

	    if(settings.dssElcAutocomplete.fields.hasOwnProperty(field)) {

		if(field == 'loans') {

		    $(context).find(settings.dssElcAutocomplete.fields[field].join(',')).first().dssElcAutocomplete({type: FIELD_CLASS_MAP[field], context: context });
		} else {

		    $(context).find(settings.dssElcAutocomplete.fields[field].join(',')).dssElcAutocomplete({type: FIELD_CLASS_MAP[field], context: context });
		}
	    }
	}
	/**
	 * Resolves EDDC-117
	 *
	 */
	if(settings.dssElcAutocomplete.fields.hasOwnProperty('terms')) {

	    $(settings.dssElcAutocomplete.fields.terms.join(',')).dssElcAutocomplete({context: context});
	}
    };

    /** 
     * jQuery plug-in integration for Drupal
     *
     */
    Drupal.behaviors.dssElcAutocomplete = {
		attach: function (context, settings) {
			
		    // The plug-in is bound to an entire <form> element
		    // Hence, this method creates multiple instances of DssElcAutocomplete Objects (or, children)
		    $(document).dssElcAutocompleteForm(context, settings);
		    
		}
    };
    
    //Drupal integration for disabling enter input

	Drupal.behaviors.DisableInputEnter = {
	    attach: function(context, settings) {
	        $('input', context).once('disable-input-enter', function() {
	            $(this).keypress(function(e) {
	                if (e.keyCode == 13) {
	                	e.preventDefault();
					    var autocomplete = $(this).data('islandoraDssElc.autocomplete');
					    var temp = autocomplete.input.val();
					    if(typeof(autocomplete) !== 'undefined') {
					    	
					    	
				    		window.setTimeout(function(){autocomplete.tokenize(e);},300);
							
							if(autocomplete.input.attr('id') != 'edit-field-loan-filename-und'){
							
								window.setTimeout(function(){
								
									if(temp == ''){
										
										autocomplete.input.parent().find('ul li a:last').click();
								
									}
								
								},100);
							
							}
							
					    	jQuery(document).find('.token-object').each(function(i,e){
					    		
					    	//	autocomplete.input.parent().find('ul li a:last').find('span:first').text(autocomplete.input.val());
								autocomplete.input.val('');
					    		
					    	});
					    }
					    
	                }
	            });
	        });
	    }
	};
	    
}(jQuery, Drupal));
