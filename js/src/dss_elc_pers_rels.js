/**
 * @file Autocompletion widget
 * @author griffinj@lafayette.edu
 *
 */

function DssElcPersRelsField(document, options) {

    try {

	var $ = settings.$ || jQuery;
	this.$ = $;
    } catch(e) {

	console.error('jQuery is required for the DssElcPersRelsField widget');
    }
    this.settings = $.extend({jquery: $, button: null}, options);

    this.button = settings.button ? $(settings.button) : $('button[name="field_human_pers_rels_add_more"]');
    this.document = document;

    this.bindButtonHandlers();
    this.bindAjaxHandlers();

    $('[id^="edit-field-human-pers-rels-und-"].form-text').each(function(i,e) {

	    // testHumanName is a Representative in relation to Peter (137661)
	    if(e.value) {

		var m = /is a (.+?) in relation to (.+)/.exec(e.value);
		if(!m) {

		    console.error("Could not parse the personal_relationship Node Title: " + e.value);
		} else {

		    $(e).siblings('.field-human-pers-rels-fields').find('#edit-field-pers-rel-role-und').val(m[1]);
		    $(e).siblings('.field-human-pers-rels-fields').find('#edit-field-pers-rel-object-und').val(m[2]);
		}
	    }
	});
};

DssElcPersRelsField.prototype.buttonOnClickHandler = function(e) {

    var $ = this.$ || jQuery;
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
		$(e).parent().append('<div class="field-human-pers-rels-fields"><div><div><label>Type</label><input id="edit-field-pers-rel-role-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_pers_rel_role[und]" autocomplete="OFF" aria-autocomplete="list"></div><div><label>Person</label><input id="edit-field-pers-rel-object-und" class="form-text form-autocomplete" type="text" maxlength="1024" size="60" value="" name="field_pers_rel_object[und]" autocomplete="OFF" aria-autocomplete="list"></div></div><button id="add-human-modal" class="btn btn-primary form-submit add-node-modal" type="button" value="new_person" name="field_human_pers_rels[und][' + i + '][op]" data-content-type="human" data-node-type="">Create New Person</button></div>');
	    }
	});

    this.$roleFields = $('#edit-field-pers-rel-role-und-autocomplete');
    this.$personFields = $('#edit-field-pers-rel-object-und-autocomplete');
    //this.$roleFields = $('#edit-field-pers-rel-role-und');
    //this.$personFields = $('#edit-field-pers-rel-object-und');
    //}).call()
};

/**
 * Bind the handlers for the "Add Another Item" button (default Drupal interface)
 *
 */
DssElcPersRelsField.prototype.bindButtonHandlers = function() {

    var $ = this.$;
    //$('button[name="field_human_pers_rels_add_more"]').click((function(e) {
    this.button.click(this.buttonOnClickHandler);
    this.buttonOnClickHandler();
};

/**
 * Bind the handlers for AJAX request transmission and reception
 *
 */
DssElcPersRelsField.prototype.bindAjaxHandlers = function() {

    var $ = this.$;
    var document = this.document;
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

		/**
		 * @todo Refactor with this.$roleFields and this.$personFields
		 *
		 */
		$('#edit-field-pers-rel-role-und-autocomplete, #edit-field-pers-rel-object-und-autocomplete').each(function(i,e) {
		//this.$roleFields.add(this.$personFields).each(function(i,e) {

			var uri = this.value;
			if (!acdb[uri]) {

			    acdb[uri] = new Drupal.ACDB(uri);
			}
			
			/**
			 * Linking the individual input fields with the actual autocompletion widgets
			 *
			 */
			$('[id="' + e.id.substr(0, e.id.length - 13) + '"]:visible').each(function(i, input) {
			//$('[id="' + e.id + '"]:visible').each(function(i, input) {
				
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
		 * @todo Refactor with this.$roleFields and this.$personFields
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
 * For integration with Drupal
 *
 */
(function($, Drupal, DssElcPersRelsField) {

    /**
     * jQuery plug-in integration for Drupal
     *
     */
    Drupal.behaviors.dssElcPersRelsField = {
	attach: function (context, settings) {
	    
	    $(document).data('dssElcPersRelsField', new DssElcPersRelsField(document, {jquery: $, button: settings.dssElcPersRelsField.button}));
	}
    };
}(jQuery, Drupal, DssElcPersRelsField));
