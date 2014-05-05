/**
 * Javascript functionality for Item Forms within the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */
(function($, Drupal) {

    Drupal.behaviors.dssElcItemForm = {

	attach: function(context, settings) {

	    $('#edit-field-item-format-und').attr('tabindex', '1');
	    $('#edit-field-item-number-und-0-value').attr('tabindex', '2');
	    $('#edit-field-item-volume-und').attr('tabindex', '3');

	    $('#edit-field-item-was-authored-by-und').attr('tabindex', '4');
	    $('#edit-field-artifact-title-und-0-value').attr('tabindex', '5');
	    $('#edit-field-item-subject-und').attr('tabindex', '6');

	    $('#edit-publish').attr('tabindex', '7');

	    /**
	     * For Tokeninput Integration
	     * Resolves EDDC-79
	     *
	     */

	    $.each(["#edit-field-item-number-taxon-und", "#edit-field-artifact-was-authored-by-und", "#edit-field-item-subject-und"], function(i, elementId) {

		    $(elementId).before('<ul id="' + $(elementId).attr('id') + '-tokens" class="token-list"></ul>');
		    //$().before('<ul id="was-authored-by-und-tokens" class="token-list"></ul>');
		    //$().before('<ul id="was-authored-by-und-tokens" class="token-list"></ul>');
		});

	    $(document).on('click', '.reference-autocomplete', function(e) {
		
		    //var $fieldElem = $("#edit-field-artifact-was-authored-by-und");
		    var $fieldElem = $(e.target).parents('.controls').children('input.form-text');

		    //$("<li><a href='#' class='token'><span>" + $fieldElem.val() + "</span><span href='#' class='token-x'>x</span></a></li>").appendTo($('#was-authored-by-und-tokens'));

		    $("<li><a href='#' class='token'><span>" + $fieldElem.val() + "</span><span class='token-x'>×</span></a></li>").appendTo( $fieldElem.siblings('.token-list') );
		    
		    $('.token').click(function(e) {

			    e.preventDefault();
			    $(this).parents('li').remove();
			});
		    //$("<a href='#' class='token'><span>" + $fieldElem.val() + "</span><span href='#' class='token-x'>x</span></a>").wrap('li').appendTo($('#was-authored-by-und-tokens'));
		    $fieldElem.val('');
		});

	    $('#item-node-form').submit(function(e) {

		    //$("#edit-field-artifact-was-authored-by-und").val( jQuery('#was-authored-by-und-tokens li a').text().split('x').slice(0,-1).join(', '));

		    $.each(["#edit-field-item-number-taxon-und", "#edit-field-artifact-was-authored-by-und", "#edit-field-item-subject-und"], function(i, elementId) {

			    //before('<ul id="' + e.attr('id') + '-tokens" class="token-list"></ul>');
			    $(elementId).val($(elementId + '-tokens li a').text().split('×').slice(0,-1).join(', '));

			    console.log('trace5');
			});
		});
	}
    }
}(jQuery, Drupal));
