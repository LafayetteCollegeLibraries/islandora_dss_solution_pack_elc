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

	    /**
	     * Date field handling functionality
	     *
	     */
	    $('.date-date').each(function(i,e) {

		    var fieldNameMap = { 0 : 'Year', 1 : 'Month', 2 : 'Day' };
		    var date = $(e).children('input:first').val();

		    for(var j in [0,1,2]) {

			var value = i ? 'value' : 'value2';
			var id = 'edit-field-loan-duration-und-0-' + value + '-' + fieldNameMap[j].toLowerCase();
			var name = "field_loan_duration[und][0][" + fieldNameMap[j].toLowerCase() + "][" + value + "]";

			/**
			 * Append the field for the year, month, and date in accordance with the wireframes
			 * Ensure that the "name" field remains explicitly null in order to ensure that the values are not transmitted in the POST request
			 *
			 */
			//$('<input id="' + id + '" class="date-clear form-text" type="text" maxlength="128" size="60" value="" name="' + name + '" tabindex="9">').keyup(function(event) {

			// Insert <div> wrapper
			/**
			 * Resolves EDDC-121
			 *
			 */
			var defaultValueHandler = function(type) {

			    var defaultText = '';
			    if(!$(this).val()) {

				switch(type) {

				case 'year':
				
				defaultText = 'YYYY';
				break;
				case 'month':
				defaultText = 'MM';
				break;
				case 'day':
				defaultText = 'DD';
				break;
				}

				$(this).val(defaultText);
			    }
			};

			$('<div class="date-wrapper-' + id + ' date-wrapper"></div>').appendTo(e).append($('<input id="' + id + '" class="date-clear form-text" type="text" maxlength="128" size="60" value="" name="">').keyup(function(event) {
				    
				    var $input = $(this).parent().siblings('[id$="-date"]');
				    var type = /edit\-field\-loan\-duration\-und\-0\-value2?\-(.+)/.exec(this.id)[1];

				    /**
				     * @todo Refactor
				     *
				     */
				    if(!($(this).val() == 'YYYY'
					 && $(this).val() == 'MM'
					 && $(this).val() == 'DD')) {
					switch(type) {

					case 'year':
					$input.val( $input.val().replace(/^\d{0,4}/, $(this).val()) );
					break;
					case 'month':
					$input.val( $input.val().replace(/^(\d{0,4})\-?\d{0,2}/, '$1-' + $(this).val()) );
					break;
					default:
					    $input.val( $input.val().replace(/^(\d{0,4})\-?(\d{0,2})\-?\d{0,2}/, '$1-$2-' + $(this).val()) );
					}

					defaultValueHandler.call(this, type);
				    }
				    //}).appendTo($(e)));
				}));

			$('.date-wrapper .form-text').each(function(i,e) {

				var type = /edit\-field\-loan\-duration\-und\-0\-value2?\-(.+)/.exec(e.id)[1];
				defaultValueHandler.call(e, type);

				$(e).click(function(event) {

					/**
					 * @todo Refactor
					 *
					 */
					switch($(this).val()) {
					    
					case 'YYYY':
					case 'MM':
					case 'DD':
					    
					    $(this).val('');
					    break;
					}
				    }).blur(function(event) {

					    /**
					     * @todo Refactor
					     *
					     */
					    var type = /edit\-field\-loan\-duration\-und\-0\-value2?\-(.+)/.exec(this.id)[1];
					    defaultValueHandler.call(this, type);
					});
			    });

			// Populate the field based upon submitted values
			if(date) {
			    
			    var m = /^(\d*)\-(\d*)\-(\d*)/.exec(date);

			    /**
			     * @todo Resolve why j is a String Object
			     *
			     */
			    if(m) {

				$('#' + id).val(m[ parseInt(j) + 1]);
			    }
			}
		    }
		    
		    // Ensure that the actual field is hidden
		    //$(e).children('input:first').hide();
		});

	    //$('div.date-no-float.end-date-wrapper.container-inline-date').hide();

	    /**
	     * Loan Subset Functionality
	     *
	     */
	    $('#edit-loan-subset-1-3').click(function(e) {

		    $(this).addClass('active').siblings().removeClass('active');
		    $('.type-column, .fine-column').show();
		});
	    $('#edit-loan-subset-4-5').click(function(e) {

		    $(this).addClass('active').siblings().removeClass('active');
		    $('.type-column, .fine-column').hide();
		});

	    // Focus on...

	    '<input id="edit-field-loan-duration-und-0-value-date" class="date-clear form-text" type="text" maxlength="128" size="60" value="" name="field_loan_duration[und][0][value][date]" tabindex="9">'
	    '<input id="edit-field-loan-duration-und-0-value2-date" class="date-clear form-text" type="text" maxlength="128" size="60" value="" name="field_loan_duration[und][0][value2][date]" tabindex="10">'

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
