/**
 * Javascript functionality for Loan Forms within the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */

(function ($, Drupal) {

    Drupal.behaviors.dssElcLoanForm = {

        attach: function (context, settings) {

	    /**
	     * Disabled in order to resolve EDDC-311
	     *
	     */

            /**
             * Date field handling functionality
             *
             */
            $('.date-date').each(function (i, e) {

                var fieldNameMap = {
                    0: 'Year',
                    1: 'Month',
                    2: 'Day'
                };
                var date = $(e).children('input:first').val();

                for (var j in [0, 1, 2]) {

                    var value = i ? 'value' : 'value2';
                    var id = 'edit-field-loan-duration-und-0-' + value + '-' + fieldNameMap[j].toLowerCase();
                    var name = "field_loan_duration[und][0][" + fieldNameMap[j].toLowerCase() + "][" + value + "]";

                    /**
                     * Append the field for the year, month, and date in accordance with the wireframes
                     * Ensure that the "name" field remains explicitly null in order to ensure that the values are not transmitted in the POST request
                     *
                     */

                    var defaultValueHandler = function (type) {

                        var defaultText = '';
                        if (!$(this).val()) {

                            switch (type) {

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

                    $('<div class="date-wrapper-' + id + ' date-wrapper"></div>')
			.appendTo(e)
			.append($('<input id="' + id + '" class="date-clear form-text" type="text" maxlength="128" size="60" value="" name="">').keyup(function (event) {

			var $input = $(this).parent().siblings('[id$="-date"]');
                        var type = /edit\-field\-loan\-duration\-und\-0\-value2?\-(.+)/.exec(this.id)[1];

                        /**
                         * @todo Refactor
                         *
                         */
                        if ($(this).val() != 'YYYY' && $(this).val() != 'MM' && $(this).val() != 'DD') {

                            var val = $(this).val();

                            /**
                             * Work-around for removing any non-numeric characters
                             * @todo Refactor
                             */
                            val = val.replace(/[a-zA-Z]/g, '', 'g');
                            switch (type) {

                                case 'year':
                                    $input.val($input.val().replace(/^\d{0,4}/, val));
                                    break;
                                case 'month':
                                    $input.val($input.val().replace(/^(\d{0,4})\-?\d{0,2}/, '$1-' + val));
                                    break;
                                default:
                                    $input.val($input.val().replace(/^(\d{0,4})\-?(\d{0,2})\-?\d{0,2}/, '$1-$2-' + val));
                            }

                            /** Ensure that the textbox is not populated should the user clear the value with delete or backspace */
                            if (event.which != 8 && event.which != 46) {

                                defaultValueHandler.call(this, type);

                            }
                        }
                    }));

                    $('.date-wrapper .form-text').each(function (i, e) {

                        var type = /edit\-field\-loan\-duration\-und\-0\-value2?\-(.+)/.exec(e.id)[1];

                        if (!e.text) {

                            defaultValueHandler.call(e, type);
                        }

                        $(e).click(function (event) {

                            /**
                             * @todo Refactor
                             *
                             */
                            switch ($(this).val()) {

                                case 'YYYY':
                                case 'MM':
                                case 'DD':

                                    $(this).val('');
                                    break;

                            }

                        }).blur(function (event) {

                            /**
                             * @todo Refactor
                             *
                             */
                            var type = /edit\-field\-loan\-duration\-und\-0\-value2?\-(.+)/.exec(this.id)[1];
                            defaultValueHandler.call(this, type);

                        });
                    });

                    // Populate the field based upon submitted values
                    if (date) {

                        var m = /^(\d*)\-(\d*)\-(\d*)/.exec(date);

                        /**
                         * @todo Resolve why j is a String Object
                         *
                         */
                        if (m) {

                            $('#' + id).val(m[parseInt(j) + 1]);

                        }
                    }
                }
                // Ensure that the actual field is hidden
                $(e).children('input:first').hide();

            });

            /**
             * Loan Subset Functionality
             *
             */
            $('#edit-loan-subset-1-3').click(function (e) {

                $(this).addClass('active').siblings().removeClass('active');
                $('.form-item-field-loan-notes-und, .fine-column, .shareholder-column').show();

            });
            $('#edit-loan-subset-4-5').click(function (e) {

                $(this).addClass('active').siblings().removeClass('active');
                $('.form-item-field-loan-notes-und, .fine-column, .shareholder-column').hide();

            });

            /**
             * Work-around
             * @todo Refactor
             * Representative is the object of the bib. relationship
             * This field must be automatically populated if it's hidden
             *
             */
            $('#edit-field-loan-shareholder-und').blur(function (e) {

                if ($('#edit-loan-subset-4-5').hasClass('active')) {

                    $('#edit-field-bib-rel-subject-und').val(this.value);

                }
            });

            /**
             * @todo griffinj@lafayette.edu will integrate these fields for the tab indexing
             *
             */
            $('#edit-field-loan-duration-und-0-value-date').keyup(function (event) {

                if (!$(this).val()) {

                    $('div.date-no-float.end-date-wrapper.container-inline-date').hide();

                } else {

                    $('div.date-no-float.end-date-wrapper.container-inline-date').show();

                }
            });

            borrVolFieldHandler = function (i, e) {

                $loanedButton = $(e).parentsUntil('div.loan-column').last().find('button.field-add-more-submit');

                $(e).keydown(function (event) {

                    if ($(this).val() && event.which == '13') {

                        event.preventDefault();

                    }

                });

                $(e).keyup(function (event) {

                    if ($(e).parentsUntil('tbody').last().nextAll().length) {

                    } else {

                        if ($(this).val() && (/,$/.exec($(this).val()) || event.which == '13')) {

							event.preventDefault();
			
                            if (/,$/.exec($(this).val())) {

                                $(this).val($(this).val().slice(0, -1));
                            }

                            // Work-around
                            // Refactor
                            $(e).parentsUntil('div.loan-column').last().find('button.field-add-more-submit').mousedown();

                            $('#edit-field-loan-issues-loaned-und-' + (i + 1) + '-value').waitUntilExists(function () {

                                $(this).focus();
                                borrVolFieldHandler(i + 1, this);

                            });
                        }
                    }

                });
            };

            $('div#borrowed-volumes div.loan-column div > div.form-item').each(function (i, e) {

                $(e).find('button#edit-field-loan-issues-loaned-und-add-more').hide();
                $(e).find('input.text-full.form-text').each(borrVolFieldHandler);

            });

            // html.js body.html div.main-container div.row-fluid section.span12 form#loan-node-form.node-form div div.loan-record div.loan-row div#loan-fields-b div.items-column div#field-bib-rel-object-add-more-wrapper--2 div.form-item table#field-bib-rel-object-values--2.field-multiple-table tbody tr.draggable td div.ajax-new-content div.control-group div.controls input#edit-field-bib-rel-object-und-1-target-id.form-text
            $('#edit-field-bib-rel-object-und-0-target-id');

			/*
			 * @author goodnowt function to detect whether form has been loaded after "save & add another" was clicked, and add classes to mark-up accordingly 
			 * 
			 */
			
			if (document.getElementsByClassName('alert alert-block alert-success').length == 1){
						
				$('#edit-field-loan-shareholder-und').addClass('prepopped');
				$('#edit-field-bib-rel-subject-und').addClass('prepopped');
				$('#edit-field-loan-duration-und-0-value2-year').addClass('prepopped');
				$('#edit-field-loan-duration-und-0-value2-month').addClass('prepopped');
				$('#edit-field-loan-duration-und-0-value2-day').addClass('prepopped');
				$('#edit-field-loan-filename-und').addClass('prepopped');
			}
			
			/*
			 * @author goodnowt functions to set and clear example text for fines 
			 */
			
			$('#edit-field-loan-fine-und-0-value').attr({
				
				value: 'e.g. 1.005'
			});
			
			$('#edit-field-loan-fine-und-0-value').focus(function() {
				
				if ($('#edit-field-loan-fine-und-0-value').attr('value') == 'e.g. 1.005'){
					
					$('#edit-field-loan-fine-und-0-value').attr({
					
						value: ''
					});
				};
			});
			
			$('#edit-field-loan-fine-und-0-value').blur(function() {
				
				if ($('#edit-field-loan-fine-und-0-value').attr('value') == ''){
					
					$('#edit-field-loan-fine-und-0-value').attr({
					
						value: 'e.g. 1.005'
					});
				};
			});
			
			/*
			 * @author goodnowt functions to clear dates example text on tab
			 */
			
			$('#edit-field-loan-duration-und-0-value2-year').on( 'keyup', function( e ) {
				
				if( e.which == 9 ) {
					
					if ($('#edit-field-loan-duration-und-0-value2-year').attr('value') == 'YYYY'){
					
						$('#edit-field-loan-duration-und-0-value2-year').attr({
							
							value: ''
						});
					};
				}
			});
			
			$('#edit-field-loan-duration-und-0-value2-month').on( 'keyup', function( e ) {
				
				if( e.which == 9 ) {
					
					if ($('#edit-field-loan-duration-und-0-value2-month').attr('value') == 'MM'){
					
						$('#edit-field-loan-duration-und-0-value2-month').attr({
							
							value: ''
						});
					};
				}
			});
			
			$('#edit-field-loan-duration-und-0-value2-day').on( 'keyup', function( e ) {
				
				if( e.which == 9 ) {
					
					if ($('#edit-field-loan-duration-und-0-value2-day').attr('value') == 'DD'){
					
						$('#edit-field-loan-duration-und-0-value2-day').attr({
							
							value: ''
						});
					};
				}
			});
			
			$('#edit-field-loan-duration-und-0-value-year').on( 'keyup', function( e ) {
				
				if( e.which == 9 ) {
					
					if ($('#edit-field-loan-duration-und-0-value-year').attr('value') == 'YYYY'){
					
						$('#edit-field-loan-duration-und-0-value-year').attr({
							
							value: ''
						});
					};
				}
			});
			
			$('#edit-field-loan-duration-und-0-value-month').on( 'keyup', function( e ) {
				
				if( e.which == 9 ) {
					
					if ($('#edit-field-loan-duration-und-0-value-month').attr('value') == 'MM'){
					
						$('#edit-field-loan-duration-und-0-value-month').attr({
							
							value: ''
						});
					};
				}
			});
			
			$('#edit-field-loan-duration-und-0-value-day').on( 'keyup', function( e ) {
				
				if( e.which == 9 ) {
					
					if ($('#edit-field-loan-duration-und-0-value-day').attr('value') == 'DD'){
					
						$('#edit-field-loan-duration-und-0-value-day').attr({
							
							value: ''
						});
					};
				}
			});
			
        }

    };
}(jQuery, Drupal));
