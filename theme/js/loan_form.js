/**
 * Javascript functionality for Loan Forms within the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */
(function($, Drupal) {

    Drupal.behaviors.dssElcLoanForm = {

	attach: function(context, settings) {

	    // Work-around for Drupal form tabindex attribute values
	    $('#edit-field-loan-filename-und').attr('tabindex', '1');
	    $('#edit-field-loan-shareholder-und').attr('tabindex', '2');
	    $('#edit-field-bib-rel-subject-und').attr('tabindex', '3');
	    $('#edit-field-bib-rel-object-und-0-target-id').attr('tabindex', '4');

	    $('#edit-field-loan-issues-loaned-und-0-value').attr('tabindex', '5');
	    $('#edit-field-loan-volumes-loaned-und-0-value').attr('tabindex', '6');
	    $('#edit-field-loan-months-loaned-und-0-value').attr('tabindex', '7');
	    $('#edit-field-loan-years-loaned-und-0-value').attr('tabindex', '8');

	    $('#edit-field-loan-duration-und-0-value-date').attr('tabindex', '9');
	    $('#edit-field-loan-duration-und-0-value2-date').attr('tabindex', '10');
	    $('#edit-field-loan-fine-und-0-value').attr('tabindex', '11');

	    $('#edit-publish').attr('tabindex', '12');

	    // Usability feature to the Shareholder and Representative form fields
	    $('#edit-field-loan-shareholder-und').change(function(event) {

		    if(!$(this).data('loanForm')) {

			$(this).data('loanForm', {
			    
				prevPatron: ''
				    });
		    } else {

			prevPatron = $(this).data('loanForm')['prevPatron'];
		    }

		    if(!$('#edit-field-bib-rel-subject-und').val() ||
		       prevPatron == $('#edit-field-bib-rel-subject-und').val()) {

			$('#edit-field-bib-rel-subject-und').val($(this).val());
		    }

		    $(this).data('loanForm')['prevPatron'] = $(this).val();
		});

	    // Work-around
	    /*
	    $('#edit-field-loan-duration-und-0-show-todate').click(function(event) {

		    $('div.date-no-float.end-date-wrapper.container-inline-date').toggle();
		});
	    */

	    $('div.date-no-float.end-date-wrapper.container-inline-date').hide();

	    // Focus on...
	    //$('#edit-field-loan-duration-und-0-value-date').focusout(function(event) {
	    $('#edit-field-loan-duration-und-0-value-date').keyup(function(event) {

		    if(!$(this).val()) {

			//$('#edit-field-loan-duration-und-0-show-todate').click();
			$('div.date-no-float.end-date-wrapper.container-inline-date').hide();
		    } else {

			$('div.date-no-float.end-date-wrapper.container-inline-date').show();
		    }
		});

	    //$issuesLoaned = $('div#field-loan-issues-loaned-add-more-wrapper div.form-item').first();
	    borrVolFieldHandler = function(i, e) {

		$loanedButton = $(e).parentsUntil('div.loan-column').last().find('button.field-add-more-submit');

		$(e).keydown(function(event) {

			if($(this).val() && event.which == '13') {

			    event.preventDefault();
			}
		    });

		$(e).keyup(function(event) {

			if($(e).parentsUntil('tbody').last().nextAll().length  ) {

			    // jQuery('#edit-field-loan-volumes-loaned-und-0-value').parentsUntil('tbody').last().siblings()
			} else {

			    if($(this).val() && ( /,$/.exec($(this).val()) || event.which == '13'))  {

				if( /,$/.exec($(this).val())) {

				    $(this).val($(this).val().slice(0, -1));
				}

				// Work-around
				// Refactor
				//$loanedButton.mousedown();
				$(e).parentsUntil('div.loan-column').last().find('button.field-add-more-submit').mousedown();

				$('#edit-field-loan-issues-loaned-und-' + (i + 1) + '-value').waitUntilExists(function() {
					
					$(this).focus();
					borrVolFieldHandler(i + 1, this);
				    });
			    }
			}

		    });
	    };
	    //$loanedButton = $issuesLoaned.find('button#edit-field-loan-issues-loaned-und-add-more');
	    //$loanedButton.hide();

	    //$issuesLoaned.find('input.text-full.form-text').each(borrVolFieldHandler);
	    $('div#borrowed-volumes div.loan-column div > div.form-item').each(function(i, e) {

		    $(e).find('button#edit-field-loan-issues-loaned-und-add-more').hide();
		    $(e).find('input.text-full.form-text').each(borrVolFieldHandler);
		});

	    // html.js body.html div.main-container div.row-fluid section.span12 form#loan-node-form.node-form div div.loan-record div.loan-row div#loan-fields-b div.items-column div#field-bib-rel-object-add-more-wrapper--2 div.form-item table#field-bib-rel-object-values--2.field-multiple-table tbody tr.draggable td div.ajax-new-content div.control-group div.controls input#edit-field-bib-rel-object-und-1-target-id.form-text
	    $('#edit-field-bib-rel-object-und-0-target-id');
	}
    }
}(jQuery, Drupal));
