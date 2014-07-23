/**
 * Javascript functionality for Item Forms within the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */
(function($, Drupal) {

    Drupal.behaviors.dssElcItemForm = {

	attach: function(context, settings) {

	    /**
	     * Initialize the global state
	     *
	     */
	    var islandoraDssElc = $(document).data('islandoraDssElc') || {};
	    islandoraDssElc['autoCompleteKey'] = false;
	    $(document).data('islandoraDssElc', islandoraDssElc);

	    /*
	    $('#edit-field-item-format-und').attr('tabindex', '1');
	    $('#edit-field-item-number-und-0-value').attr('tabindex', '2');
	    $('#edit-field-item-volume-und').attr('tabindex', '3');

	    $('#edit-field-item-was-authored-by-und').attr('tabindex', '4');
	    $('#edit-field-artifact-title-und-0-value').attr('tabindex', '5');
	    $('#edit-field-item-subject-und').attr('tabindex', '6');

	    $('#edit-publish').attr('tabindex', '7');
	    */

	    /**
	     * Modify the DOM for the addition of tokenized form values
	     *
	     */
	    $.each(["#edit-field-item-number-taxon-und", "#edit-field-artifact-was-authored-by-und", "#edit-field-item-subject-und"], function(i, elementId) {

		    $(elementId).before('<ul id="' + $(elementId).attr('id') + '-tokens" class="token-list"></ul>');
		});
	    
	    /**
	     * AJAX response handling for integration with the Drupal cache
	     * Possibly deprecated, but ideally extended for full integration with the Drupal solution for autocompletion
	     * @todo Remove or extend
	     */
	    /*
	    // http://elc.stage.lafayette.edu/entityreference/autocomplete/tags/field_artifact_was_authored_by/node/item/NULL/thi
	    $(document).ajaxSuccess(function( event, xhr, settings ) {

		    // Should I be working with Backbone.js at this point? (Mutator and accessor?)
		    // Restructure ?
		    var m = /entityreference\/autocomplete\/tags\/(.+?)\//.exec(settings.url);
		    if(m) {

			var field = m[1];
			var islandoraDssElc = $(document).data('islandoraDssElc') || {};

			var response = JSON.parse(xhr.responseText);
			var data = {};
			data[field] = Object.keys(response);

			//if(data[field].length > 1) {

			    islandoraDssElc = $.extend(islandoraDssElc, data);
			    $(document).data('islandoraDssElc', islandoraDssElc);
			    //}
		    }
		});
	    */

	    /**
	     * Event handling for the token elements
	     *
	     */
	    $(document).on('click', '.token', function(e) {

		    e.preventDefault();
		    $(this).parents('li').remove();
		});
	    
	    /**
	     * Event handling for the autocomplete elements (Drupal 7 core)
	     *
	     */
	    $(document).on('click', '.reference-autocomplete', function(e) {
		
		    var $fieldElem = $(e.target).parents('.controls').children('input.form-text');

		    var islandoraDssElc = $(document).data('islandoraDssElc') || {};

		    /**
		     * For now, only implementing for default language encoding
		     * @todo Restructure for extended languages and character sets
		     *
		     */
		    var m = /edit\-(.+?)\-und/.exec($fieldElem.attr('id'));

		    if(islandoraDssElc.hasOwnProperty('autoCompleteItem')) {

			$("<li><a href='#' class='token'><span>" + islandoraDssElc['autoCompleteItem'] + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		    } else {

			$("<li><a href='#' class='token'><span>" + $fieldElem.val() + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		    }

		    $fieldElem.val('');
		});

	    /**
	     * Handling for fields which reference other Drupal entities
	     *
	     */
	    $(document).on('keydown keyup', '#edit-field-artifact-was-authored-by-und', function(e) {
		    
		    if((e.which == 188 || e.which == 13) && $(this).val().length > 1) {

			var $listElem = $(this).parents('.controls').find('.reference-autocomplete');

			if($listElem.length == 1) {

			    var islandoraDssElc = $(document).data('islandoraDssElc') || {};
			    islandoraDssElc['autoCompleteKey'] = true;

			    /**
			     * Work-around
			     * One must query Drupal again for the entity ID
			     * (Unfortunately, this cannot be resolved more properly without implementing handling for the Drupal cache)
			     *
			     */
			    $.get('/entityreference/autocomplete/tags/field_artifact_was_authored_by/node/item/NULL/' + encodeURI($listElem.text()), function(data) {

				    var m = /(".+?")/.exec(Object.keys(data));
				    if(m) {

					islandoraDssElc['autoCompleteItem'] = m[1];
				    }
				});

			    $(document).data('islandoraDssElc', islandoraDssElc);

			    $listElem.click();
			    e.preventDefault();

			    islandoraDssElc['autoCompleteKey'] = false;
			    delete islandoraDssElc['autoCompleteItem'];
			    $(document).data('islandoraDssElc', islandoraDssElc);
			} else if($listElem.length == 0) {

			    $('<div class="form-alert-dialog" title="Error"><p>This author does not exist!</p></div>').appendTo('.main-container').dialog({
				    modal: true,

					close: function(event, ui) {
				    
					$('#form-alert-dialog').remove();
					$(this).focus();
				    }
				});

			    $(this).val('');
			    e.preventDefault();
			}
		    }
		});

	    /**
	     * Handling for fields which do not reference other Drupal entities
	     * @todo Abstract as a plug-in
	     */
	    $(document).on('keydown keyup', '#edit-field-item-number-taxon-und, #edit-field-item-subject-und', function(e) {

		    if((e.which == 188 || e.which == 13) && $(this).val().length > 1) {

			var $fieldElem = $(e.target).parents('.controls').children('input.form-text');

			$("<li><a href='#' class='token'><span>" + $fieldElem.val() + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		    
			$('.token').click(function(e) {

				e.preventDefault();
				$(this).parents('li').remove();
			    });
			$fieldElem.val('');

			e.preventDefault();
		    }
		});

	    /**
	     * Event handling for the submission of the Item form itself
	     *
	     */
	    $('#item-node-form').submit(function(e) {
		    
		    /** @todo Refactor and abstract for other forms */
		    $.each(["#edit-field-item-number-taxon-und", "#edit-field-artifact-was-authored-by-und", "#edit-field-item-subject-und"], function(i, elementId) {

			    $(elementId).val($(elementId + '-tokens li a').text().split('×').slice(0,-1).join(', '));
			});
		});
	}
    }
}(jQuery, Drupal));
