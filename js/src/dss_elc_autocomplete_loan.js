
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

		$("<li><a href='#' class='token'><span class='token-object'>" + this.get('autoCompleteItem') + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
	    } else {

		$("<li><a href='#' class='token'><span class='token-object'>" + $fieldElem.val() + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
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

	    // @todo Refactor
	    //event.stopImmediatePropagation();
	    event.preventDefault();
	    var inputElement = this.input;

	    var $listElem = $(this.input).parents('.controls').find('.reference-autocomplete');
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

	this.bindAjaxHandlers();

	//$('button[name$="_add_more"]').parents('.form-item').prepend('<div><input id="edit-field-bib-rel-object-und" class="form-text required form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_bib_rel_object[und]" autocomplete="OFF" aria-autocomplete="list" /></div>');

	    /**
	     * For the population of each field-human-pers-rels field based upon the values within the field specifying the Role and Object of each personal relationship
	     *
	     */
	    //$('<div><input id="edit-field-bib-rel-object-und" class="form-text required form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_bib_rel_object[und]" autocomplete="OFF" aria-autocomplete="list"></input></div>').keydown(function(e) {

		    /*
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
		    */
	    //}).prependTo($('button[name$="_add_more"]').parents('.form-item'));
    };
    
    /**
     * Declare DssElcAutocompleteLoan to be a child class of DssElcAutocompleteEntityRef
     *
     */
    DssElcAutocompleteLoan.prototype = new DssElcAutocompleteEntityRef();
    DssElcAutocompleteLoan.prototype.constructor = DssElcAutocompleteLoan;

    /**
     * Method for tokenizing terms or entity reference ID's from the autocompletion list
     * @params [Event] event
     */
    DssElcAutocompleteLoan.prototype.tokenize = function(event) {

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

	    var item = this.get('autoCompleteItem') ? this.get('autoCompleteItem') : $fieldElem.val();
	    item = '<span class="token-object">' + item + '</span>';

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
	    $fieldElem.val('');
	}
    };

    /**
     * jQuery plug-in
     * @params [bool] isEntityRef
     *
     */
    $.fn.dssElcAutocomplete = function(options) {

	//settings = $.extend(options, {type: DssElcAutocomplete});
	settings = $.extend({type: DssElcAutocomplete}, options);
	DssElcAutocompleteClass = settings.type;

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

	    $(settings.dssElcAutocomplete.fields.loans.join(',')).dssElcAutocomplete({type: DssElcAutocompleteLoan});
	    $(settings.dssElcAutocomplete.fields.entityRefs.join(',')).dssElcAutocomplete({type: DssElcAutocompleteEntityRef});
	    $(settings.dssElcAutocomplete.fields.terms.join(',')).dssElcAutocomplete();

	    $('.node-form').submit(function(e) {

		    $.each($(this).data('islandoraDssElc.autocomplete'), (function(i, autocomplete) {

				//$(autocomplete.input.attr('id') + '-tokens li a').slice(1).each(function(j, item) {
				if($('#' + autocomplete.input.attr('id') + '-tokens li a').length > 0) {

				    // Specific to loan forms
				    /**
				     * @todo Refactor
				     *
				     */
				    //if(i == 0 && /field_bib_rel_object/.test(autocomplete.input.attr('name'))) {
				    if($('[name="field_bib_rel_object[und][0][target_id]"]').length > 1) {

					$('[name="field_bib_rel_object[und][0][target_id]"]:first').remove();
				    }

				    $('#' + autocomplete.input.attr('id') + '-tokens li a span.token-object').each(function(j, item) {
					    
					    //$(this).append('<input class="form-text required form-autocomplete" type="text" maxlength="1024" size="60" value="' + $(item).text().split('×').slice(0,-1).join(', ') + '" name="field_bib_rel_object[und][' + j + '][target_id]" autocomplete="OFF" aria-autocomplete="list"></input>');
					    //$('.node-form').append('<input class="form-text required form-autocomplete" type="text" maxlength="1024" size="60" value="' + $(item).text().split('×').slice(0,-1).join(', ') + '" name="field_bib_rel_object[und][' + j + '][target_id]" autocomplete="OFF" aria-autocomplete="list"></input>');

					    /**
					     * @todo Refactor
					     *
					     */
					    var inputValue = $(item).text().replace(/^"(.+)"$/, '$1');
					    var inputName = $(item).parents('.token-list').siblings('.form-text').attr('name').replace(/\[\d\]/, '[' + j + ']');

					    $('.node-form').append('<input class="form-text required form-autocomplete" type="text" maxlength="1024" size="60" value="' + inputValue + '" name="' + inputName + '" autocomplete="OFF" aria-autocomplete="list" style="display:none"></input>');

					    //$('#' + autocomplete.input.attr('id') + '-tokens li a span.token-issues').each(function(j, item) {
					    $(item).siblings('span.token-volumes').each(function(j, item) {

						    inputValue = $(item).text().replace(/^\((.+)\)$/, '$1');

						    //var m = /\[(\d+)\]/.exec($(item).parents('.token-list').siblings('.form-text').attr('name'));
						    //var nameIndex = m[1];
						    var nameIndex = $('[name="field_bib_rel_object[und][0][target_id]"]').filter(function(i,e) {

							    return $(e).val();
							}).length;

						    $('.node-form').append('<input id="edit-field-loan-volumes-text-und-0-value" class="text-full form-text" type="text" maxlength="255" size="60" value="' + inputValue + '" name="field_loan_volumes_text[und][' + nameIndex + '][value]" style="display:none">');
						});

					    //$('#' + autocomplete.input.attr('id') + '-tokens li a span.token-issues').each(function(j, item) {
					    $(item).siblings('span.token-issues').each(function(j, item) {
						    
						    inputValue = $(item).text().replace(/^\((.+)\)$/, '$1');
						    
						    //var m = /\[(\d+)\]/.exec($(item).parents('.token-list').siblings('.form-text').attr('name'));
						    //var nameIndex = m[1];
						    var nameIndex = $('[name="field_bib_rel_object[und][0][target_id]"]').filter(function(i,e) {

							    return $(e).val();
							}).length;

						    $('.node-form').append('<input id="edit-field-loan-issues-text-und-0-value" class="text-full form-text" type="text" maxlength="255" size="60" value="' + inputValue + '" name="field_loan_issues_text[und][' + nameIndex + '][value]" style="display:none">');
						});
					});
				}
			    })
			);
		});
	}
    };
    
}(jQuery, Drupal));
