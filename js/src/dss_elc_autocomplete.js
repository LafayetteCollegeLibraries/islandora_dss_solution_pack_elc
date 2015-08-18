
/**
 * @file Autocompletion widget
 * @author griffinj@lafayette.edu
 *
 */

var Islandora = window.Islandora || {};
Islandora.ELC = Islandora.ELC || {};
Islandora.ELC.Autocomplete = Islandora.ELC.Autocomplete || {};

Islandora.ELC.Autocomplete.TIMEOUT = 4000;

(function($, Drupal) {

    /**
     * Token Class (for modeling autocomplete value tokens)
     * @author griffinj@lafayette.edu
     * @param [string] value
     *
     */
    function Token(value) {

	this.value = value;
    };

    /**
     * Static handler for the "onclick" Event
     * @param [Event] event
     *
     */
    Token.click = function(event) {

	event.preventDefault();

	var token = $(this).data('Islandora.ELC.Autocomplete.Token');
	var tokens = $(this).data('Islandora.ELC.Autocomplete.Tokens');
	tokens.delete(token.value);

	//$(this).data('Islandora.ELC.Autocomplete.Token', null);
	delete token;

	//$(this).data('Islandora.ELC.Autocomplete.Tokens', null);
	$(this).remove();
    };

    /**
     * Tokens Class
     * For modeling collections of Token Objects
     * @param [Term] autocomplete
     *
     */
    function Tokens(autocomplete) {

	this._tokens = [];
	this.autocomplete = autocomplete;
    };

    /**
     * Method for determining whether or not a value has been tokenized
     * @param [string] value
     * @return [boolean]
     *
     */
    Tokens.prototype.include = function(value) {

	var result = this._tokens.filter(function(token) {

		return token.value == value;
	    });
	
	return result.length > 0;
    }

    /**
     * Method for tokenizing a value
     * This involves creating the DOM Element, binding data to the Element, and pushing the tokenized Value
     * @param [string] value the value to be tokenized
     *
     */
    Tokens.prototype.push = function(value) {

	if(!this.include(value)) {

	    var token = new Token(value);
	    var $element = this.autocomplete.input;

	    var $tokenElement = $("<li><a href='#' class='token'><span class='token-object'>" + value + "</span><span class='token-x'>×</span></a></li>");
	    $tokenElement.data('Islandora.ELC.Autocomplete.Token', token);
	    $tokenElement.data('Islandora.ELC.Autocomplete.Tokens', this);

	    $tokenElement.click(Token.click).appendTo( $element.siblings('.token-list') );
	    
	    this._tokens.push(token);
	}
    };

    /**
     * Method for removing a value from the collection of Tokens
     * @param [string] value the value within the Token to be removed
     *
     */
    Tokens.prototype.delete = function(value) {
	
	this._tokens = this._tokens.filter(function(token) {

		return token.value != value;
	    });
    }    

    /**
     * DssElcAutocomplete Class
     * Models the autocompletion <input> Element within a Drupal form for Taxonomy Terms
     * Also serves as a base class for other autocompletion <input> Elements
     * @param [Element] input
     * @param [jQuery] $
     * @param [boolean] filterAutocomplete
     *
     */
    function DssElcAutocomplete(input, $, filterAutocomplete) {

	this.input = input;
	this.filterAutocomplete = filterAutocomplete || false;

	/**
	 * Handling for the submission of node forms
	 *
	 * Not efficient
	 * @todo Refactor
	 *
	 */
	if(this.input && this.input.val()) {

	    this.tokenizeField(this.input);
	}

	this.tokens = new Tokens(this);
    };

    /**
     * Static Methods
     *
     */ 

    /**
     * The submission handler for forms with the autocompletion widget fully integrated
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
				
			    //$('[name="field_bib_rel_object[und]"]:first').remove();
			    $('[name="field_bib_rel_object[und]"]:last').remove();
			}
			
			// Work-around
			// (This ensures that EntityReference values are encapsulated with double quotations)
			// @todo Refactor
			var isEntityReference = $.inArray(autocomplete.input.attr('id'), ['edit-field-pers-rel-subject-und', 'edit-field-pers-rel-object-und']) != -1;

			$('#' + autocomplete.input.attr('id') + '-tokens li a span.token-object').each(function(j, item) {
				
				/**
				 * This filters for exclusively tokenized values
				 * @todo Refactor
				 *
				 */
				if($(item).text() == '×') {

				    return;
				}
				var inputValue = $(item).text().replace(/^"(.+)"$/, '$1');

				// Work-around implemented in order to resolve EDDC-349
				if($(item).parents('.token-list').siblings('.form-text').length > 0) {

				    var inputName = $(item).parents('.token-list').siblings('.form-text').attr('name').replace(/\[\d\]/, '[' + j + ']');
				    
				    $('.node-form').append('<input class="form-text required form-autocomplete" type="text" maxlength="1024" size="60" value="' + inputValue + '" name="' + inputName + '" autocomplete="OFF" aria-autocomplete="list" style="display:none"></input>');

				    var inputValues = jQuery.unique(jQuery('input[name="' + inputName + '"]').slice(1).map(function(i,e) {
				    	
						return e.defaultValue;
					    })).toArray();
				    
				    /**
				     * This extends handling for references to Drupal Entities
				     *
				     */
				    if( isEntityReference ) {
				    
					inputValues = inputValues.map(function(e,i) { return '"' + e + '"'; });
				    }
				    var finalInput = inputValues.join(',');
				
				    var $lastElem = $('input[name="' + inputName + '"]');
				    $lastElem.val(finalInput);
				}
			    });
		    }
		})
	    );

	console.log( $(this).serializeArray() );
    };

    /**
     * Mutator
     * @params [Object] prop [Object] val
     * @returns [Object] val
     *
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
     *
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

		$(this).data('islandoraDssElc.autocomplete').keydown(e);
	    });

	$(this.input).keyup(function(e) {

		$(this).data('islandoraDssElc.autocomplete').keyup(e);
	    });
    };

    /**
     * Method for determining whether or not a value has been tokenized
     * @params [string] token
     * @returns [boolean] whether or not a value has been tokenized
     *
     */
    DssElcAutocomplete.prototype.isTokenized = function($element, token) {

	return this.tokens.include(token);
    };

    /**
     * Method for tokenizing the actual field values
     * @todo Refactor with tokenize() and DssElcAutocompleteLoan.tokenizeField()
     *
     * @params [Element] fieldElem
     *
     */
    DssElcAutocomplete.prototype.tokenizeField = function(fieldElem) {

	var $fieldElem = $(fieldElem);

	if(! this.isTokenized($fieldElem, $fieldElem.val()) ) {

	    var islandoraDssElc = $(document).data('islandoraDssElc') || {};

	    /**
	     * If this is an instance in which only autocompletion values can be tokenized, then only iterate over the retrieved items
	     *
	     */
	    if(this.filterAutocomplete) {

		var items = this.get('autoCompleteItem') ? [ this.get('autoCompleteItem') ] : [];
		
		// Handling for race conditions (i. e. the data hasn't been bound to the element, but the AJAX response has been received and parsed
		//var inputElement = this.input;
		var $selectedItem = $fieldElem.parents('.controls').find('#autocomplete li.selected');
		if($selectedItem.length > 0) {

		    this.set('autoCompleteItem', $selectedItem.data('autocompleteValue') );
		    items = [$selectedItem.data('autocompleteValue')];
		    var updatedValue = '';
		} else {

		    var updatedValue = $fieldElem.val();
		}
	    } else {

		// ...otherwise, iterate over the new values
		var items = this.get('autoCompleteItem') ? [ this.get('autoCompleteItem') ] : $fieldElem.val().split(',');
		var updatedValue = '';
	    }

	    items = items.filter(function(item, i) {

		    return item != '';
		});

	    for(var i in items) {

		var token = '';

		/**
		 * For now, only implementing for default language encoding
		 * @todo Restructure for extended languages and character sets
		 *
		 */
		if(this.get('autoCompleteItem')) {
			
		    var token = this.get('autoCompleteItem');
		} else {
		    
		    var token = items[i];
		}

		this.tokens.push(token);
	    }

	    $fieldElem.val(updatedValue);
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

	var $fieldElem = $(this.input);
	this.tokenizeField($fieldElem);
    };

    /**
     * For all events in which the user attempts to tokenize a value
     *
     */
    DssElcAutocomplete.prototype.keydown = function(event) {

	if((event.which == 188 || event.which == 13) && $(this.input).val().length > 1) {

	    event.preventDefault();

	    var inputElement = this.input;
	    event.target = inputElement;

	    /**
	     * Integrating this functionality for the filtration of values against the autocompletion widget
	     * @todo Refactor with EntityRef.prototype.keydown
	     *
	     */
	    if(false) {

		// no-op
	    } else {

		/*
		 * @author goodnowt This line is disabled temporarily for release to disable the enter key creating tokens from the autocomplete (until that functionality is fixed)
		 *
		 * @author griffinj Uncertain as to why or how this disabled the "enter" key; the event.which value should be restricted for this case
		 *
		 */
		var $listElem = $(this.input).parents('.controls').find('#autocomplete li.selected');

		/**
		 * Long polling is utilized here in order to "wait" for the proper values for the AJAX request
		 * @todo Integrate support for MutationObservers, DOMAttrModified, and propertychange
		 *
		 */
		if($listElem.length > 0) {
		    
		    this.set('autoCompleteKey', true);
		    var autocompleteItem = $listElem.data('autocompleteValue');
		    this.set('autoCompleteItem', autocompleteItem);

		    //event.target = inputElement;

		    this.tokenize(event);

		    this.set('autoCompleteKey', false);
		    this.set('autoCompleteItem', null);
		} else if(!this.filterAutocomplete) {

		    this.tokenize(event);
		} else {

		    $(document).data('islandoraDssElc.autocomplete.poll', this);
		    $(document).data('islandoraDssElc.autocomplete.pollEvent', event);
		    $(document).data('islandoraDssElc.autocomplete.timeInit', +new Date());

		    // No time-effective and safe manner by which to hook in to the autocomplete functionality for Drupal 7.x
		    // Polling the DOM for changes until the AJAX submission is complete...
		    /**
		     * Synchronously poll the DOM state
		     *
		     */
		    var intervalId = window.setInterval(function() {
			    
			    var context = $(document).data('islandoraDssElc.autocomplete.poll');
			    var event = $(document).data('islandoraDssElc.autocomplete.pollEvent');
			    var timeElapsed = +new Date() - $(document).data('islandoraDssElc.autocomplete.timeInit');

			    /**
			     * @todo Investigate as to why islandoraDssElc.autocomplete.pollInterval is still accessible but not islandoraDssElc.autocomplete.poll
			     *
			     */
			    if(!context || (timeElapsed > Islandora.ELC.Autocomplete.TIMEOUT)) {
				
				window.clearInterval($(document).data('islandoraDssElc.autocomplete.pollInterval'));
				$(document).data('islandoraDssElc.autocomplete.poll', null);
				$(document).data('islandoraDssElc.autocomplete.pollEvent', null);
			    } else {

				var $listElem = $(context.input).parents('.controls').find('.reference-autocomplete');
				
				if($listElem.length > 0) {

				    context.set('autoCompleteKey', true);
				    context.set('autoCompleteItem', $listElem.parents('li.selected').data('autocompleteValue'));
				    
				    event.target = inputElement;

				    context.tokenize(event);
				    
				    context.set('autoCompleteKey', false);
				    context.set('autoCompleteItem', null);

				    window.clearInterval($(document).data('islandoraDssElc.autocomplete.pollInterval'));
				    $(document).data('islandoraDssElc.autocomplete.poll', null);
				    $(document).data('islandoraDssElc.autocomplete.pollEvent', null);
				}
			    }
			}, 250);
		    
		    $(document).data('islandoraDssElc.autocomplete.pollInterval', intervalId);
		}
	    }
	}	
    };

    /**
     * @todo Is this being called twice?
     *
     */
    DssElcAutocomplete.prototype.keyup = function(event) {

	return this.keydown(event);
    };

    Islandora.ELC.Autocomplete.Term = DssElcAutocomplete;

    DssElcAutocompleteEntityRef.submit = function(e, callback) {

	console.log(this);
	return callback(e);
    };

    /**
     * DssElcAutocompleteEntityRef Class
     * @constructor
     *
     */
    function DssElcAutocompleteEntityRef(input, $, filterAutocomplete) {

	DssElcAutocomplete.call(this, input, $, filterAutocomplete);
	this.bindAjaxHandlers();
    };

    Islandora.ELC.Autocomplete.Entity = DssElcAutocompleteEntityRef;

    /**
     * Declare DssElcAutocompleteEntityRef to be a child class of DssElcAutocomplete
     *
     */
    DssElcAutocompleteEntityRef.prototype = new DssElcAutocomplete();
    DssElcAutocompleteEntityRef.prototype.constructor = DssElcAutocompleteEntityRef;

    DssElcAutocompleteEntityRef.prototype.setAutocomplete = function($element) {

	var $selectedItem = $element.parents('.controls').find('#autocomplete li.selected');
	if($selectedItem.length > 0) {

	    this.set('autoCompleteItem', $selectedItem.data('autocompleteValue') );
	    items = [$selectedItem.data('autocompleteValue')];
	}
    };

    /**
     * Method for tokenizing actual values
     * @todo Refactor with tokenize()
     */
    DssElcAutocompleteEntityRef.prototype.tokenizeField = function($fieldElem) {
	
	// Only tokenize for non-existing values (?)
	if(!this.isTokenized($fieldElem, $fieldElem.val())) {

	    var islandoraDssElc = $(document).data('islandoraDssElc') || {};
	    var items;

	    // Handling for race conditions (i. e. the data hasn't been bound to the element, but the AJAX response has been received and parsed
	    /**
	     * @todo Refactor with Term.prototype.tokenizeField
	     *
	     */
	    this.setAutocomplete($fieldElem);

	    items = this.get('autoCompleteItem') ? [ this.get('autoCompleteItem') ] : $fieldElem.val().split();

	    for(var i in items) {

		this.tokens.push(items[i]);
	    }

	    $fieldElem.val('');

	    // A race condition exists here (perhaps due to AJAX response handling integration with the Drupal autocomplete widget?)
	    $(document).data('Islandora.ELC.Autocomplete.timeout.$fieldElem', $fieldElem);

	    // Set a timer to clear the field value
	    var timeoutID = window.setTimeout(function() {

		    var $fieldElem = $(document).data('Islandora.ELC.Autocomplete.timeout.$fieldElem');
		    $fieldElem.val('');

		    var timeoutID = $(document).data('Islandora.ELC.Autocomplete.timeout.id');

		    window.clearTimeout(timeoutID);
		}, 125);

	    $(document).data('Islandora.ELC.Autocomplete.timeout.id', timeoutID);
	}
    };

    /**
     * Method for binding all AJAX handlers
     *
     */
    DssElcAutocompleteEntityRef.prototype.bindAjaxHandlers = function() {

	/**
	 * AJAX handler for all AJAX requests
	 *
	 */
	$(document).ajaxSend(function(event, jqxhr, settings) {

		if(settings.url == '/system/ajax') {

		    /**
		     * Is this necessary to remain in place?
		     *
		     */
		    if(/_add_more$/.test(settings.extraData._triggering_element_name)) {
			
			// no-op ?
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
			    
					islandoraDssElcHumanForm[e.id][i] = e.value || "";
				    });
			
			$(document).data('islandoraDssElcHumanForm', islandoraDssElcHumanForm);
		    }
		}
	    });

	/**
	 * AJAX handlers for responses from the server
	 *
	 */
	$(document).ajaxComplete(function(event, xhr, settings) {

		console.log('ajax');
		console.log(+new Date);

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
				     *
				     */
				    $(['edit-field-pers-rel-role-und', 'edit-field-pers-rel-object-und'].map(function(e,i) {
				
						return '[id="' + e + '"]:visible';
					    }).join(', ')).each(function(i, e) {
						    
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

	/*
	 * @author goodnowt This line is disabled temporarily for release to disable the enter key creating tokens from the autocomplete (until that functionality is fixed)
	 *
	 * @author griffinj Uncertain as to why or how this disabled the "enter" key; the event.which value should be restricted for this case
	 *
	 */
	var inputElement = this.input;

	if((event.which == 188 || event.which == 13) && $(this.input).val().length > 1) {

	    // @todo Refactor
	    event.stopImmediatePropagation();
	    //event.preventDefault();

	    // #autocomplete ul li
	    //var $listElem = $(this.input).parents('.controls').find('.form-autocomplete');
	    var $listElem = $(this.input).parents('.controls').find('#autocomplete');

	    /**
	     * Long polling is utilized here in order to "wait" for the proper values for the AJAX request
	     * @todo Integrate support for MutationObservers, DOMAttrModified, and propertychange
	     *
	     */	    
	    if($listElem.length > 0) {

		this.set('autoCompleteKey', true);
		//var listItem = $listElem.parents('li.selected').length > 0 ? $listElem.parents('li.selected').data('autocompleteValue') : $listElem.parents('li:first').data('autocompleteValue');
		var listItem = $listElem.find('li.selected').length > 0 ? $listElem.find('li.selected').data('autocompleteValue') : $listElem.find('li:first').data('autocompleteValue');

		if(typeof(listItem) != 'undefined') {

		    this.set('autoCompleteItem', listItem);

		    event.target = inputElement;

		    this.tokenize(event);

		    this.set('autoCompleteKey', false);
		    this.set('autoCompleteItem', null);
		}
	    } else {

		$(document).data('islandoraDssElc.autocomplete.poll', this);
		$(document).data('islandoraDssElc.autocomplete.pollEvent', event);
		$(document).data('islandoraDssElc.autocomplete.timeInit', +new Date());

		// No time-effective and safe manner by which to hook in to the autocomplete functionality for Drupal 7.x
		// Polling the DOM for changes until the AJAX submission is complete...
		/**
		 * Synchronously poll the DOM state
		 *
		 */
		var intervalId = window.setInterval(function() {

			var context = $(document).data('islandoraDssElc.autocomplete.poll');
			var event = $(document).data('islandoraDssElc.autocomplete.pollEvent');
			var timeElapsed = +new Date() - $(document).data('islandoraDssElc.autocomplete.timeInit');

			/**
			 * @todo Investigate as to why islandoraDssElc.autocomplete.pollInterval is still accessible but not islandoraDssElc.autocomplete.poll
			 *
			 */
			if(!context || (timeElapsed > Islandora.ELC.Autocomplete.TIMEOUT )) {

			    window.clearInterval($(document).data('islandoraDssElc.autocomplete.pollInterval'));
			    $(document).data('islandoraDssElc.autocomplete.poll', null);
			    $(document).data('islandoraDssElc.autocomplete.pollEvent', null);
			} else {

			    var $listElem = $(context.input).parents('.controls').find('.reference-autocomplete');

			    if($listElem.length > 0) {

				context.set('autoCompleteKey', true);
				context.set('autoCompleteItem', $listElem.parents('li.selected').data('autocompleteValue'));
		
				event.target = inputElement;

				context.tokenize(event);
				context.set('autoCompleteKey', false);
				context.set('autoCompleteItem', null);

				window.clearInterval($(document).data('islandoraDssElc.autocomplete.pollInterval'));
				$(document).data('islandoraDssElc.autocomplete.poll', null);
				$(document).data('islandoraDssElc.autocomplete.pollEvent', null);
			    }
			}
		    }, 250);
		
		$(document).data('islandoraDssElc.autocomplete.pollInterval', intervalId);
	    }
	} else {

	    // Set the handlers for the <ul>
	    var $listElem = $(this.input).parents('.controls').find('#autocomplete');

	    // Start polling for responses
	    
	    /*
	    if($listElem.length > 0) {

		console.log('trace4');

		//var listItems = $listElem.parents('li.selected').length > 0 ? $listElem.parents('li.selected').data('autocompleteValue') : $listElem.parents('li:first').data('autocompleteValue');
		var listItems = $listElem.children('li');

		console.log(listItems);
	    } else {

		console.log('trace5');
	    }
	    */

	    $(document).data('islandoraDssElc.autocomplete.poll', this);
	    $(document).data('islandoraDssElc.autocomplete.pollEvent', event);
	    $(document).data('islandoraDssElc.autocomplete.timeInit', +new Date());

	    // No time-effective and safe manner by which to hook in to the autocomplete functionality for Drupal 7.x
	    // Polling the DOM for changes until the AJAX submission is complete...
	    /**
	     * Synchronously poll the DOM state
	     *
	     */
	    var intervalId = window.setInterval(function() {

		    var context = $(document).data('islandoraDssElc.autocomplete.poll');
		    var event = $(document).data('islandoraDssElc.autocomplete.pollEvent');
		    var timeElapsed = +new Date() - $(document).data('islandoraDssElc.autocomplete.timeInit');

		    /**
		     * @todo Investigate as to why islandoraDssElc.autocomplete.pollInterval is still accessible but not islandoraDssElc.autocomplete.poll
		     *
		     */
		    if(!context || (timeElapsed > Islandora.ELC.Autocomplete.TIMEOUT )) {

			window.clearInterval($(document).data('islandoraDssElc.autocomplete.pollInterval'));
			$(document).data('islandoraDssElc.autocomplete.poll', null);
			$(document).data('islandoraDssElc.autocomplete.pollEvent', null);
		    } else {

			var $listElem = $(context.input).parents('.controls').find('.reference-autocomplete');

			if($listElem.length > 0) {

			    // Set the handlers for the newly appended DOM Elements
			    $listElem.find('li').on('click keydown', function(event) {

				    // Retrieve the related input widget within the scope of the Document instance
				    //var autocomplete = $(document).data();
				    var autocomplete = context;

				    // Tokenize
				    autocomplete.set('autoCompleteItem', listItem);
				    event.target = autocomplete.input;
				    autocomplete.tokenize(event);

				    autocomplete.set('autoCompleteKey', false);
				    autocomplete.set('autoCompleteItem', null);
				});

			    /*
			    context.set('autoCompleteKey', true);
			    context.set('autoCompleteItem', $listElem.parents('li.selected').data('autocompleteValue'));
			    */
		
			    /*
			    event.target = inputElement;

			    context.tokenize(event);
			    */

			    /*
			    context.set('autoCompleteKey', false);
			    context.set('autoCompleteItem', null);
			    */
			    
			    window.clearInterval($(document).data('islandoraDssElc.autocomplete.pollInterval'));
			    $(document).data('islandoraDssElc.autocomplete.poll', null);
			    $(document).data('islandoraDssElc.autocomplete.pollEvent', null);
			}
		    }
		}, 250);
		
	    $(document).data('islandoraDssElc.autocomplete.pollInterval', intervalId);
	}
    };

    /**
     * DssElcAutocompleteLoan Class
     * @constructor
     *
     */
    function DssElcAutocompleteLoan(input, $, filterAutocomplete) {

	DssElcAutocompleteEntityRef.call(this, input, $, filterAutocomplete);
    };
    
    /**
     * Declare DssElcAutocompleteLoan to be a child class of DssElcAutocompleteEntityRef
     *
     */
    DssElcAutocompleteLoan.prototype = new DssElcAutocompleteEntityRef();
    DssElcAutocompleteLoan.prototype.constructor = DssElcAutocompleteLoan;

    Islandora.ELC.Autocomplete.Loan = DssElcAutocompleteLoan;

    /**
     * DssElcAutocompleteHuman Class
     * @constructor
     *
     */
    function DssElcAutocompleteHuman(input, $, filterAutocomplete) {

	DssElcAutocompleteEntityRef.call(this, input, $, filterAutocomplete);
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

    Islandora.ELC.Autocomplete.Human = DssElcAutocompleteHuman;

    /**
     * jQuery plug-in
     * @params [bool] isEntityRef
     *
     */
    $.fn.dssElcAutocomplete = function(options) {

	//settings = $.extend(options, {type: DssElcAutocomplete});
	settings = $.extend({
		type: DssElcAutocomplete,
		context: document,
		filterAutocomplete: false
	    }, options);
	DssElcAutocompleteClass = settings.type;
	var context = settings.context;
	var filterAutocomplete = settings.filterAutocomplete;

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
		    $(this).data('islandoraDssElc.autocomplete', new DssElcAutocompleteClass($(this), $, filterAutocomplete));
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

		    /*
		    /**
		     * Event handlers for tokenized terms
		     *
		     * /
		    $(document).on('click', '.token', function(event) {

			    event.preventDefault();
			    $(this).parents('li').remove();
			});
		    */

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
     * @params [Object] context
     * @params [Object] settings
     *
     */
    $.fn.dssElcAutocompleteForm = function(context, settings) {

	/*
	var FIELD_CLASS_MAP = {

	    loans: DssElcAutocompleteLoan,
	    entityRefs: DssElcAutocompleteEntityRef,
	    terms: DssElcAutocomplete
	};
	*/

	for(var fieldType in settings.dssElcAutocomplete.fields) {

	    //var klassName = settings.dssElcAutocomplete.fieldTypes[fieldType];
	    var klassName = fieldType.toUpperCase()[0] + fieldType.slice(1);
	    var klass = Islandora.ELC.Autocomplete[klassName];
	    var klassOptions = { type: klass, context: context };

	    /**
	     * If the Drupal configuration settings have specified the field for binding...
	     *
	     */
	    if(settings.dssElcAutocomplete.fields.hasOwnProperty(fieldType)) {

		for(var i in settings.dssElcAutocomplete.fields[fieldType]) {

		    var field = settings.dssElcAutocomplete.fields[fieldType][i];

		    //var options = $.extend(klassOptions, field.options);
		    var options = $.extend({ type: klass, context: context }, field.options);

		    var selector = field.selector.join(',');
		    var $elements = $(context).find(selector);
		    $elements.dssElcAutocomplete(options);
		}
	    }

	    /*
	    if(settings.dssElcAutocomplete.fields.hasOwnProperty(field)) {

		/*
		if(field == 'loans') {

		    var selector = settings.dssElcAutocomplete.fields[field].join(',').first();
		} else {

		    var selector = settings.dssElcAutocomplete.fields[field].join(',');
		}
		* /

		var field = settings.dssElcAutocomplete.fields[field];
		options = $.extend(options, field.options);

		var selector = field.selector.join(',');
		var $elements = $(context).find(selector);
		$elements.dssElcAutocomplete(options);
	    }
	    */
	}

	/**
	 * Resolves EDDC-117
	 *
	 */
	/*
	if(settings.dssElcAutocomplete.fields.hasOwnProperty('terms')) {

	    $(settings.dssElcAutocomplete.fields.terms.join(',')).dssElcAutocomplete({context: context});
	}
	*/
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
    
    /**
     * @author stathisw@lafayette.edu
     * Drupal integration for disabling enter input
     *
     */
    Drupal.behaviors.DisableInputEnter = {
	attach: function(context, settings) {
	    $('input', context).once('disable-input-enter', function() {
		    $(this).keypress(function(e) {
			    if (e.keyCode == 13) {

				e.preventDefault();

				/**
				 * @author griffinj@lafayette.edu
				 * Event Object lies outside of the scope of this closure
				 */
				$(document).data('islandoraDssElc.keypress.event', e);

				// Work-around
				// @todo Refactor
				$(document).data('islandoraDssElc.keypressTarget.value', e.currentTarget.value);

				/*
				var autocomplete = $(this).data('islandoraDssElc.autocomplete');
				    
				if(typeof(autocomplete) !== 'undefined') {
					    
				    var temp = autocomplete.input.val();
				    window.setTimeout(function() {
					    
					    var e = $(document).data('islandoraDssElc.keypress.event');
					    var targetValue = $(document).data('islandoraDssElc.keypressTarget.value');
					    e.currentTarget.value = targetValue;

					    console.log('trace9');

					    /**
					     *
					     * Handling for race conditions
					     * @todo refactor
					     *
					     * /
					    //autocomplete.tokenize(e);
					}, 300);
							
				    if(autocomplete.input.attr('id') != 'edit-field-loan-filename-und') {
					
					window.setTimeout(function() {
						
						if(temp == '') {
						    
						    autocomplete.input.parent().find('ul li a:last').click();
						}
					    }, 100);
				    }
							
				    jQuery(document).find('.token-object').each(function(i,e){
					    		
					    //	autocomplete.input.parent().find('ul li a:last').find('span:first').text(autocomplete.input.val());
					    autocomplete.input.val('');
					});
				}
				*/
			    }
			});
		});
	}
    };
}(jQuery, Drupal));
