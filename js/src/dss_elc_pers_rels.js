/**
 * @file Autocompletion widget
 * @author griffinj@lafayette.edu
 *
 */

var Islandora = window.Islandora || {};
Islandora.ELC = Islandora.ELC || {};

Islandora.ELC.Relationship = Islandora.ELC.Relationship || {};
Islandora.ELC.Relationship.DATA_KEY = 'dssElcPersRelsField';
Islandora.ELC.Relationship.FIELDS_TOTAL = 'dssElcPersRelsFieldTotal';

Islandora.ELC.Relationship.Form = Islandora.ELC.Relationship.Form || {};
Islandora.ELC.Relationship.Form.KEY = 'IslandoraElcRelForm';

Islandora.ELC.Relationship.Form.TOKEN_KEY = 'IslandoraElcRelFormToken';

Islandora.ELC.Relationship.Field = Islandora.ELC.Relationship.Field || {};

Islandora.ELC.Relationship.Field.SUBJECT_SELECTOR = '';
Islandora.ELC.Relationship.Field.OBJECT_SELECTOR = '';

Islandora.ELC.Relationship.Field.SUBJECT_KEY = 'IslandoraElcRelSubject';
Islandora.ELC.Relationship.Field.OBJECT_KEY = 'IslandoraElcRelObject';
Islandora.ELC.Relationship.Field.ROLE_KEY = 'IslandoraElcRelRole';

Islandora.ELC.Relationship.Field.TITLE_KEY = 'IslandoraElcRelTitle';
Islandora.ELC.Relationship.Field.NID_KEY = 'IslandoraElcRelNid';

/**
 * Static method for tokenization
 * @param @objectFieldElement [jQuery Element] the field for the entity being tokenized
 *
 */
Islandora.ELC.TokenizeField = function(inputElement) {

    var $ = $ || jQuery;
    var $inputElement = $(inputElement);
    var $tokenList = $inputElement.data('Islandora.ELC.$tokenList');

    var $roleFieldElem = $inputElement.parents('.controls').find('#edit-field-pers-rel-role-und');
    var $objectFieldElem = $inputElement.parents('.controls').find('#edit-field-pers-rel-object-und');

    var inputValue = $inputElement.val();

    // If the field contains a reference to some P. Relationship Entity...
    if( inputValue.length > 0 ) {

	/**
	 * Hard-coded regex for the personal-relationship Node title
	 * Ideally, the structure of these P. Relationships should be specified using a Drupal config. form value
	 * @todo Refactor
	 *
	 */
	var m = /is a (.+?) in relation to (.+)/.exec(inputValue);
	if(m) {
				
	    /**
	     * @todo Refactor
	     *
	     */
	    $roleFieldElem.val(m[1]);
	    $objectFieldElem.val(m[2]);

	    /**
	     * Add the tokenized values for the newly-added relationships
	     * @todo Refactor
	     *
	     */
	    var objectNameMatch = /"?(.+?)"/.exec($objectFieldElem.val());
	    if(objectNameMatch) {

		var objectName = objectNameMatch[1];
		$("<li><a href='#' class='token'><span class='token-object'>" + objectName + "</span><span class='token-x'>×</span></a></li>").appendTo( $tokenList );
		$objectFieldElem.hide();
	    }
	}
    }
};

/**
 * Static method for initializing a tokenize field
 *
 */
Islandora.ELC.TokenizeFieldInit = function(inputElementIndex, inputElement) {

    var $ = $ || jQuery;

    var $inputElement = $(inputElement);

    // Prepend the list for tokenization
    if($('#pers-rel-tokens-' + inputElementIndex + 1).length == 0) {

	var $tokenList = $('<ul id="pers-rel-tokens-' + inputElementIndex + 1 + '" class="pers-rel-tokens token-list"></ul>');

	$inputElement.data('Islandora.ELC.$tokenList', $tokenList);
	//$inputElement.siblings('.field-human-pers-rels-fields').find('#edit-field-pers-rel-object-und').before($tokenList);

	var $tokenContainer = $('<div role="application">').append($tokenList);
	$inputElement.siblings('.field-human-pers-rels-fields').children('div').prepend($tokenContainer);
    }
};

Islandora.ELC.Relationship.Field.enableAutocomplete = function(e) {

    var $ = $ || jQuery;

    /**
     * WARNING: Copied directly from Drupal core (autocomplete.js)
     *
     */
    var acdb = [];

    //var uri = e.value; // NO!
    /**
     * Construct the URI for the Drupal endpoint
     * https://elc.stage.lafayette.edu/entityreference/autocomplete/tags/field_pers_rel_object/node/human/NULL/test"
     *
     */
    var uri = "/" + "entityreference/autocomplete/tags/field_pers_rel_object/node/human/NULL";
    if (!acdb[uri]) {
		    
	acdb[uri] = new Drupal.ACDB(uri);
    }

    /*
    var $input = $(e)
    .attr('autocomplete', 'OFF')
    .attr('aria-autocomplete', 'list');
			
    $($input[0].form).submit(Drupal.autocompleteSubmit);
    $input.parent()
    .attr('role', 'application')
    .append($('<span class="element-invisible" aria-live="assertive"></span>')
	    .attr('id', $input.attr('id') + '-autocomplete-aria-live')
	    );
    new Drupal.jsAC($input, acdb[uri]);
    */

    /**
     * Linking the individual input fields with the actual autocompletion widgets
     *
     */
    //var input = e;
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
};

/**
 * AJAX response handling
 *
 */

/**
 * For AJAX requests successfully transmitted from the Drupal site
 *
 */
Islandora.ELC.AjaxSend = function(event, xhr, settings) {

    // For handling AJAX requests submitted using the Drupal autocomplete widget
    var $ = $ || jQuery;

    console.log(event);
    console.log(settings);

    // Overriding the autocompletion event handling
    // If the Drupal API is generating a jQuery GET request using the raw value of the field...
    if(settings.url == '/' + $('#edit-field-pers-rel-object-und').val() ) {

	event.stopImmediatePropagation();
    }

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
};

/**
 * For AJAX responses successfully transmitted from the Drupal site
 *
 */
Islandora.ELC.AjaxComplete = function(event, xhr, settings) {

    var $ = $ || jQuery;
    
    if(settings && /system\/ajax/.exec(settings.url)) {

	// Work-around for autocomplete
	/**
	 * Work-around for enabling autocompletion from multiple elements
	 * @todo Refactor for the invocation of $.once()
	 *
	 */
	//Drupal.behaviors.autocomplete.attach(document, Drupal.settings);
	
	var acdb = [];
	
	/**
	 * @todo Refactor with this.$roleFields and this.$personFields
	 *
	 */
	
	/**
	 * Population of the form fields from the individual 
	 *
	 */
	if(settings.extraData && settings.extraData._triggering_element_name == 'field_human_pers_rels_add_more') {

	    // Retrieve the element
	    var $newButton = $('[name="field_human_pers_rels_add_more"]');

	    // Drupal adds a new Button element, hence the data must be bound from the old element
	    var relationships = $(document).data(Islandora.ELC.Relationship.DATA_KEY);
	    $newButton.data(Islandora.ELC.Relationship.DATA_KEY, relationships);
	    relationships.$button.data(Islandora.ELC.Relationship.DATA_KEY, null);
	    relationships.$button = $newButton;

	    // Drupal also adds new fields, which must also be updated
	    var $newFields = $('[id^="field-human-pers-rels-values"] .controls > .form-text');
	    relationships.$fields = $newFields;

	    // Trigger the tokenization for the new button
	    DssElcPersRelsField.addField($newButton);
	    
	    // Only iterate for the last within a series
	    // This can only be performed by checking the timestamps between the individual requests
	    if(settings.timeStamp - ($(document).data('islandoraDssElcHumanForm.lastRequestTimestamp') || settings.timeStamp) < 1000) {
		
		// Iterate through each hidden form field (each containing the actual Personal Relationship Entity reference)
		$('[id^="edit-field-human-pers-rels-und-"].form-text').each(function(i, inputElement) {
			
			Islandora.ELC.TokenizeField(inputElement);
		    });
	    }
	}
	
	/**
	 * Remove extraneous relationship fields
	 * Conflict within the form state within the PHP and the browser (i. e. server vs. client)
	 * The form within the PHP still retains fields which we've removed within the browser
	 * These must be removed from the responses handled from the server
	 *
	 */
	
	var $fields = $('[id="edit-field-pers-rel-object-und"]');
	$fields = $fields.slice(0, -1);
	
	// Retrieve the dssElcPersRelsField from the global scope
	var dssElcPersRelsFieldTotal = $(document).data(Islandora.ELC.Relationship.FIELDS_TOTAL);
	
	// Compare the number of form fields currently on the form (i. e. after these fields have been appended to the DOM by Drupal)...
	if($fields.length > dssElcPersRelsFieldTotal + 1) {
	    
	    // Retrieve the slice of elements which exceed the number of field elements captured within the Object state...
	    $fields.slice(0, (dssElcPersRelsFieldTotal == 1 ? -2 : dssElcPersRelsFieldTotal - 1)).each(function(index, element) {
		    
		    // ...and remove each of these elements.
		    $(element).parent().parent().parent().parent().parent().remove();
		});
	} else {
	    
	    dssElcPersRelsFieldTotal = $fields.length;
	    $(document).data(Islandora.ELC.Relationship.FIELDS_TOTAL, dssElcPersRelsFieldTotal);
	}
	
	$('[id="edit-field-pers-rel-object-und"]').show();
    }
};

// Islandora.ELC.Relationship.Form
function DssElcPersRelsField(document, options) {

    try {

	var $ = settings.$ || jQuery;
	this.$ = $;
    } catch(e) {

	console.error('jQuery is required for the DssElcPersRelsField widget');
    }
    this.settings = $.extend({jquery: $, button: null}, options);

    this.document = document;

    // Reference the form fields containing the Entity Reference for the Personal Relationship Nodes
    this.$fields = $('[id^="field-human-pers-rels-values"] .controls > .form-text');

    // This is the button used to append more "relationship" fields
    this.$button = settings.button ? $(settings.button) : $('button[name="field_human_pers_rels_add_more"]');

    // Bind a reference to the button
    this.$button.data(Islandora.ELC.Relationship.DATA_KEY, this);

    // Bind the handler for the button used to append new fields
    //this.$button.click(DssElcPersRelsField.addField);
    // This can only be undertaken by overridding the AJAX response functionality implemented by Drupal
    DssElcPersRelsField.addField(this.$button);

    // Initialize all fields for tokenization
    // @todo This should be implemented using an ELC.Relationship.Personal.Input Class
    //
    this.$fields.each(function(i, inputElement) {

	    Islandora.ELC.TokenizeFieldInit(i, inputElement);
	});

    // This binds the event handlers for the <form> elements
    this.bindAjaxHandlers();

    /**
     * The refined approach deprecates all attempts to leverage the existing Drupal AJAX functionality
     *
     */
    this.$button.hide();
};

/**
 * Handler for the "+" Button
 * Islandora.ELC.Relationship.Form
 *
 */
//DssElcPersRelsField.addField = function(event) {
DssElcPersRelsField.addField = function($button) {

    var $ = $ || jQuery;

    // Ensure that no AJAX events are triggered
    //event.preventDefault();

    // Retrieve the bound reference to the field
    //var relationships = $(this).data('Islandora.ELC.Field');
    var relationships = $button.data(Islandora.ELC.Relationship.DATA_KEY);

    // Iterate through the existing relationship fields
    relationships.$fields.each(function(i, element) {

	    var $element = $(element);
	    
	    // If there are no si
	    if($element.siblings('.field-human-pers-rels-fields').length == 0) {
		
		/**
		 * Appending additional elements to the DOM
		 * Ideally, this markup would be generated and passed from a hook implementation within Drupal (hook_form_alter() or template_preprocess_hook_form()
		 * However, this would require far more work in order to properly integrate the handling of more complex AJAX responses for the form itself
		 * @todo Decouple and implement within the appropriate Drupal hook implementations
		 *
		 */
		var $fields = $('<div class="field-human-pers-rels-fields"><div><div><label>Type</label><select class="form-select required" name="field_pers_rel_role[und]" id="edit-field-pers-rel-role-und"><option value="_none">- Select a value -</option><option value="658">Representative</option></select></div><div><label>Person</label><input id="edit-field-pers-rel-object-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_pers_rel_object[und]" autocomplete="OFF" aria-autocomplete="list"></div></div></div>');
		
		// Append the newly-added form fields
		$element.parent().append($fields);

		// Enable the autocompletion for the subject and object fields
		//Islandora.ELC.Relationship.Field.enableAutocomplete($fields.find('#edit-field-pers-rel-object-und')[0]);

		// If this is not the terminal field...
		if(i < relationships.$fields.length - 1) {

		    // ...append a removal button which removes this field
		    var $buttonRemove = $('<div class="clearfix"><button id="edit-field-human-pers-rels-und-remove" class="field-remove-submit btn btn-rmv-rel form-submit" type="submit" value="-" name="field_human_pers_rels_remove">-</button></div>').click(function(event) {
			
			    // Restructure using .parents()
			    $(this).parent().parent().parent().parent().parent().remove();

			    // Also, update the total number of fields on the form by "popping" the last of the field elements
			    var dssElcPersRelsFieldTotal = $(document).data(Islandora.ELC.Relationship.FIELDS_TOTAL);
			    dssElcPersRelsFieldTotal--;
			    $(document).data(Islandora.ELC.Relationship.FIELDS_TOTAL, dssElcPersRelsFieldTotal);
			});

		    $element.parent().append($buttonRemove);
		} else {
		    
		    // ...otherwise, for the terminal field, add the "Create New Person" Button
		    $fields.append('<button id="add-human-modal-' + i + '" class="btn btn-primary form-submit add-node-modal" type="button" value="new_person" name="field_human_pers_rels[und][' + i + '][op]" data-content-type="human" data-node-type="">Create New Person</button>');
		}
	    }

	    // Initialize the new field as a token?
	    Islandora.ELC.TokenizeFieldInit(i, element);
	    Islandora.ELC.TokenizeField(element);
	});
};

/**
 * Bind the handlers for AJAX request transmission and reception
 *
 */
DssElcPersRelsField.prototype.bindAjaxHandlers = function() {

    var $ = this.$;
    var document = this.document;

    // For...
    $(document).ajaxSend(Islandora.ELC.AjaxSend);

    // For handling AJAX requests received in response to a request transmitted using the Drupal autocomplete widget
    $(document).ajaxComplete(Islandora.ELC.AjaxComplete);
    
    /**
     * For the population of each field-human-pers-rels field based upon the values within the field specifying the Role and Object of each personal relationship
     * @todo Refactor with this.$roleFields and this.$personFields
     *
     */

    $('#edit-field-pers-rel-object-und').blur(function(e) {

	    var $relationFieldElem = $(this).parents('.controls').children('.form-text');
	    
	    if($(this).val().length > 0) {

		/**
		 * @todo Initiate a loading animation
		 * For the moment, disable the field
		 */
		$(this).prop('disabled', true);
		
		var humanName = $('#edit-field-person-name-und-0-value').val();
				    
		if($('#edit-field-human-middle-initials-und-0-value').val().length > 0) {
		    
		    humanName += ' ' + $('#edit-field-human-middle-initials-und-0-value').val();
		}
		
		if($('#edit-field-human-surname-und-0-value').val().length > 0) {
		    
		    humanName += ' ' + $('#edit-field-human-surname-und-0-value').val();
		}
			    
		var $roleFieldElem = $(this).parents('.controls').find('#edit-field-pers-rel-role-und');
		var $objectFieldElem = $(this);

		/**
		 * Resolving terms to string literals
		 * @todo Refactor
		 *
		 */
		// Attempt to retrieve the Node ID
		var $form = $(this).parents('form');

		var subjectMatch = /(\d+)\/edit/.exec($form.attr('action'));
		var subject = 'NULL';
		if(subjectMatch) {
		    
		    subject = subjectMatch[1];
		}

		/**
		 * Error handling implemented in order to avoid cases in which NULL roles are selected
		 *
		 */
		var role = $roleFieldElem.children('[value="' + $roleFieldElem.val() + '"]').text().toLowerCase();
		if(role == '- select a value -') {

		    $('#main-content').after('<div class="alert alert-block alert-error"><a class="close" href="#" data-dismiss="alert">×</a><h4 class="element-invisible">Error message</h4>A role is required.</div>');
		    $objectFieldElem.val('');
		    $roleFieldElem.parents('.control-group').addClass('error');
		} else {

		    //! @todo Refactor
		    var objectMatch = /\((\d+)\)/.exec($objectFieldElem.val());
		    var object = 'NULL';
		    if(objectMatch) {

			object = objectMatch[1];
		    }

		    var objectName = $objectFieldElem.val().replace(/\(\d+\)/, '');
		    var m = /"(.+?)"/.exec(objectName);
		    if(m) {

			objectName = m[1];
		    }

		    /**
		     * Retrieve a Personal Relationship Node from a Drupal AJAX endpoint
		     * (If this does not currently exist within the site, create a new Node without explicitly setting an author)
		     *
		     */
		    $.get('/elc/pers-rels/' + encodeURI(subject) + '/' + encodeURI(role) + '/' + encodeURI(object), function(data) {
			
			    // Handle cases in which the Object retrieved from the site is null
			    if(typeof(data) == 'undefined') {
			    
				throw new Error('Failed to create the personal relationship in response to ' + subject + '/' + role + '/' + object);
			    } else {

				var persRel = data.pop();

				/**
				 * Disabled, as the Node ID is now being bound to jQuery Elements
				 *
				 */
				// Perform the tokenization logic
				// @todo Refactor

				var objectName = $objectFieldElem.val();

				var objectNameMatch = /"(.+?)"/.exec($objectFieldElem.val());
				if( objectNameMatch ) {

				    objectName = objectNameMatch[1];
				}

				/**
				 * Add the token to the field
				 * Ensuring that the token both hides the related field, as well as clears the previously entered input
				 *
				 */
				var $tokenAnchor = $("<a href='#' class='token'><span class='token-object'>" + objectName + "</span></a>");

				// Store the Node ID for the relationship within the token
				$tokenAnchor.data(Islandora.ELC.Relationship.Form.KEY, $('.node-form'));
				$tokenAnchor.data(Islandora.ELC.Relationship.Field.TITLE_KEY, persRel.title);
				$tokenAnchor.data(Islandora.ELC.Relationship.Field.NID_KEY, persRel.nid);

				var $tokenClose = $("<span class='token-x'>×</span>").data(Islandora.ELC.Relationship.Form.TOKEN_KEY, $objectFieldElem).click(function() {

					var $objectFieldElem = $(this).data(Islandora.ELC.Relationship.Form.TOKEN_KEY);
					$objectFieldElem.prop('disabled', false);
				    });
				var $tokenItem = $('<li>').append($tokenAnchor.append($tokenClose));
				$objectFieldElem.parents('.field-human-pers-rels-fields').find('.pers-rel-tokens').append($tokenItem);
				
				$objectFieldElem.prop('disabled', false);
				$objectFieldElem.val('');
				$roleFieldElem.val('_none');
			    }
			});
		}
	    } else {
			    
		$relationFieldElem.val('');
	    }
	});
};

/**
 * For integration with Drupal
 *
 */
(function($, Drupal, DssElcPersRelsField) {

    /**
     * jQuery plug-in integration for Drupal
     * Note that the "attach" Method is invoked in response to the reception of *all AJAX requests*
     *
     */
    Drupal.behaviors.dssElcPersRelsField = {
	attach: function (context, settings) {

	    // The relationships Object should be a singleton, bound to the Document
	    var relationships = $(document).data(Islandora.ELC.Relationship.DATA_KEY);
	    if(typeof(relationships) == 'undefined') {

		relationships = new DssElcPersRelsField(document, {jquery: $, button: settings.dssElcPersRelsField.button});
		$(document).data(Islandora.ELC.Relationship.DATA_KEY, relationships);
	    }

	    /**
	     * This was repeatedly updating the total number of fields on the form
	     *
	     */
	    if(typeof($(document).data(Islandora.ELC.Relationship.FIELDS_TOTAL)) == 'undefined') {

		$(document).data(Islandora.ELC.Relationship.FIELDS_TOTAL, $('[id^="edit-field-human-pers-rels-und-"].form-text').length);
	    }
	}
    };
}(jQuery, Drupal, DssElcPersRelsField));
