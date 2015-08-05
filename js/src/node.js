
/**
 * Javascript functionality for the "dss_elc" Module
 * @author griffinj@lafayette.edu
 *
 */
(function($, Drupal) {

    Drupal.behaviors.dssElc = {

	attach: function(context, settings) {

	    /*
	     * Bootstrap throws the following exception:
	     * TypeError: Drupal.theme.prototype[func] is undefined
	     * http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js?mp9pul Line 294
	     *
	     */

	    /**
	     * @author stathisw@lafayette.edu
	     *
	     */
	    //Disable form submission on 'enter'
	    $('form:first').attr('onsubmit', 'return false');
	    
	    //Enable form submission when a button is clicked
	    jQuery('button','#edit-actions').click(function(e){
	    	
		    $('form:first').attr('onsubmit', 'return true');
		});
	    //Enable when selected and enter pressed
	    jQuery('button','#edit-actions').keypress(function(e){
		    
		    if(e.which == 13){
	    		$('form:first').attr('onsubmit', 'return true');
		    }
		});

	    // If this is not an Ajax request...
	    /**
	     * Set the Modal handlers for the addition of Human nodes
	     */
	    // Specify whether or not this is an AJAX request
	    $('.add-node-modal, .edit-node-modal').each(function(i, element) {
			
		    //try-catch is a workaround for an uncaught error. This is the solution
		    //for EDDC-295. In the future, find out why settings.dssElc.isAjaxRequest is null
		    try{

			$(element).nodeFormModal(settings.dssElc.isAjaxRequest);
		    } catch(exception){

			//$(element).nodeFormModal(false);
		    }
		});
	    
	    addSubjectContainer = $('div.node-add-subject');

	    // Loans (refactor)
	    // Initially empty the <select> element of all <option> elements
	    //$('select#edit-field-loan-shareholder-und').empty();
	    
	    /**
	     * Loan form handling
	     * Autocompletion widget for the dynamic retrieval of Person Objects for the Loan Form
	     *
	     */
	    $('input#edit-field-bib-rel-subject-und').change(function() {

		    // 7 letter full name minimum
		    if($(this).val().length > 8) {

			// Work-around
			if(true) {

			    //return addSubjectContainer.find('button').attr('disabled', true);
			    return true;
			}

			humanTitle = $(this).val();
			
			m = /(.+) \((\d+)\)/.exec(humanTitle);
			//m = /(d+)\)"/.exec(humanTitle);
			
			if(m) {
			    
			    //humanTitle = m[1];
			    humanTitle = m[2];
			    url = '/node/get/nid/' + humanTitle;
			} else {

			    url = '/node/get/human/title/' + humanTitle;
			}

			$shareholderField = $('#edit-field-loan-shareholder-und');
			
			//$.get('/node/get/human/title/' + humanTitle, function(data) {
			$.get(url, function(data) {
				
				//console.log(data);
				
				subjectField = $('input#edit-field-bib-rel-subject-und');
				
				if(data) {
				    
				    person = data;
				    
				    $('div#autocomplete').hide();
				    addSubjectContainer.hide();
				    
				    // If there are Node Objects related to this Node...
				    if(typeof person.field_human_pers_rels !== 'undefined' && person.field_human_pers_rels !== null) {
					
					$('div.node-edit-subject').remove();
					$('ul#node-related-objects').remove();

					// Refactor this into an element faded in using jQuery UI...
					listElement = $('<ul id="node-related-objects">Relationships for ' + person.title + '</ul>').appendTo('div#node-related-objects-container');
					listElement.empty();
					
					// Retrieve persons related to this person
					// (Relational JOIN operation)
					// Should this be refactored using the Drupal API?
					for(i in person.field_human_pers_rels.und) {
					    
					    persRelNid = person.field_human_pers_rels.und[i].target_id;

					    $.get('/node/get/nid/' + persRelNid, function(data) {
						    
						    persRel = data;
						    // Identify the role
						    // Verify the relationship between the TID and the value "Representative"
						    if(persRel.field_pers_rel_role.und[0].tid == '658') {

							$.get('/node/get/nid/' + persRel.field_pers_rel_object.und[0].target_id, function(shareholder) {

								$shareholderField.val(shareholder.title + ' (' + persRel.field_pers_rel_object.und[0].target_id + ')');
								//$('select#edit-representative').val(shareholder.title);
								//$('<option value=' + persRel.field_pers_rel_object.und[0].target_id + '>' + shareholder.title + '</option>').appendTo($('select#edit-field-loan-shareholder-und') );
								//$('select#edit-field-loan-shareholder-und').attr('disabled', false);
							    });
						    }

						    listElement.append($('<li class="node-related-object">' + persRel.title + '</li>'));
						});
					}
				    }
				    
				    //pattern = /node\-(add)\-subject/;
				    //pattern = /node\/add\/human/;
				    //console.log(addSubjectContainer.parent().html());
				    
				    $editSubjectContainer = $(('<div class="node-add-subject">' + addSubjectContainer.html() + '</div>')
							      .replace('node/add/human', 'node/' + person.nid + '/edit')
							      .replace(/(\-)?add\-/, '$1edit-')
							      // Refactor
							      .replace('add-node-modal', 'edit-node-modal')
							      .replace(/add\-(.+?)\-modal/, 'edit-$1-' + person.nid + '-modal')
							      .replace('New', 'Edit this'));
				    
				    $editSubjectContainer.insertAfter(addSubjectContainer);
				    $editSubjectContainer.children('.edit-node-modal').nodeFormModal();

				    //defineModalHandlers($('.edit-node-modal'), 'edit');
				    //editSubjectContainer = $('node/14/edit');
				}
				//console.log( data.field_is_pers_related_to );
			    });
		    }
		});
		
	    /**
	     * Clearing the field
	     *
	     */
	    $('input#edit-field-bib-rel-subject-und').keyup(function(event) {
		    
		    if(event.which == 8 || event.which == 46 || $(this).val().length > 0) {

			// Work-around
			if(true) {

			    return true;
			    //return addSubjectContainer.find('button').attr('disabled', false);
			}

			if(event.which == 8 || event.which == 46) {

			    //$('select#edit-field-loan-shareholder-und').attr('disabled', true);
			    //$('select#edit-field-loan-shareholder-und').empty();
			}

			listElement = $('ul#node-related-objects');
			listElement.empty();
			$('div.node-edit-subject').remove();
			addSubjectContainer.show();
			$('div#autocomplete').show();
		    }
		    
		    if($(this).val().length > 0) {

			$(this).change();
		    }
		});
	    
	}
    };

}(jQuery, Drupal));