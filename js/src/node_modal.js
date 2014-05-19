
/**
 * The NodeModal Drupal 7 jQuery Plug-in
 * @author griffinj@lafayette.edu
 */

(function($) {

    /**
     * Global constants
     */
    //STYLE_ELEMENTS = $('<script src="http://elc.dev.lafayette.edu/misc/jquery.js?v=1.4.4"></script><script src="http://elc.dev.lafayette.edu/misc/jquery.once.js?v=1.2"></script><script src="http://elc.dev.lafayette.edu/misc/drupal.js?mp9pul"></script><script src="http://elc.dev.lafayette.edu/misc/ui/jquery.ui.core.min.js?v=1.8.7"></script><script src="http://elc.dev.lafayette.edu/misc/jquery.ba-bbq.js?v=1.2.1"></script><script src="http://elc.dev.lafayette.edu/modules/overlay/overlay-parent.js?v=1.0"></script><script src="http://elc.dev.lafayette.edu/modules/contextual/contextual.js?v=1.0"></script><script src="http://elc.dev.lafayette.edu/misc/jquery.cookie.js?v=1.0"></script><script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js?mp9pul"></script><script src="http://elc.dev.lafayette.edu/sites/all/modules/multi_node_add/multi_node_add.js?mp9pul"></script><script src="http://elc.dev.lafayette.edu/modules/toolbar/toolbar.js?mp9pul"></script>');
    STYLE_ELEMENTS = $('');

    CONTAINER_STYLE = false;
    CONTAINER_INDEX = 0;
    
    /**
     * The NodeFormModal Object
     * Instantiate jQuery UI modal Dialog widgets for Drupal Node Objects
     *
     */
    $.fn.nodeFormModal = function(isAjaxRequest) {

	if($(this).data('nodeFormModal')) {

	    return $(this);
	}

	// Initialize the jQuery data method
	this.$element = $(this);
	this.$element.data('nodeFormModal', {});

	/**
	 * Global constants
	 */
	this.MODAL_RIGHT_POSITION = {

	    my: 'right bottom',
	    at: 'right bottom',
	    of: window
	};

	this.MODAL_LEFT_POSITION = {

	    my: 'left top',
	    at: 'left top',
	    of: window
	};

	/**
	 * Mutate the Object appended to the jQuery Object using .data()
	 *
	 */
	this.set = function(property, value) {
	    
	    nodeFormModal = this.$element.data('nodeFormModal');
	    nodeFormModal[property] = value;
	    
	    return this.$element.data('nodeFormModal',  nodeFormModal);
	}
	
	/**
	 * Access the Object appended to the jQuery Object using .data()
	 *
	 */
	this.get = function(property) {
	    
	    return this.$element.data('nodeFormModal')[property];
	}
	
	/**
	 * Retrieve the name of the operation at the data access layer (i. e. add, edit, delete...) from the element ID
	 *
	 */
	this.getMethodForElement = function() {
	    
	    // Throw an exception if the ID is badly formed
	    // The value of method must lie within the scope of each individual element handler
	    try {
		
		return /(.+?)\-/.exec(this.$element.attr('id'))[1];
	    } catch(e) {
		
		throw new Error('Badly formed element ID does not contain the name of the method: ' + this.$element.attr('id'));
	    }
	}
	
	this.set('method', this.getMethodForElement());
	
	/**
	 * Retrieve the name of the Content Type from the element ID
	 *
	 */
	this.getContentTypeForElement = function() {
	    
	    switch(this.get('method')) {
		
	    case 'edit':
	    
	    pattern = RegExp('edit\-(.+?)\-([0-9]+?)\-modal');
	    break;
	    
	    case 'add':
	    
	    pattern = RegExp('add\-(.+?)\-modal');
	    matchIndex = 1;
	    break;
	    
	    default:
	    
	    throw new Error('Badly formed element ID does not contain the method name "' + this.get('method') + '": ' + this.$element.attr('id'));
	    }
	    
	    m = pattern.exec( this.$element.attr('id'));
	    if(m) {
		
		return m[1];
	    } else {
		
		return 'node';
	    }
	}

	// Pass the Content Type to the jQuery Element Object
	contentTypeName = this.getContentTypeForElement();
	this.set('contentTypeName', contentTypeName);

	// If this is a "human", pass the type of human (i. e. Shareholder vs. Representative) to the jQuery Element Object
	if(contentTypeName == 'human') {

	    humanType = this.$element.text()[0].toUpperCase() + this.$element.text().slice(1);

	    // Work-around
	    //humanType = /(New |Edit this )(.+)/.exec(humanType)[2]

	    /**
	     * Work-around for parsing the URL
	     * Resolves EDDC-107
	     *
	     */
	    humanType = $('.item-record').length ? 'Author' : 'Person';
	    this.set('humanType', humanType);
	}
	
	// Assume that we are always dealing with valid HTML
	container = $('<div id="' + this.get('method') + '-' + this.get('contentTypeName') + '-modal" class="' + this.get('method') + '-node-modal-container">Loading...</div>').appendTo($('body')).hide();

	if(this.get('modalPosition') == null || (typeof this.get('modalPosition') == 'undefined')) {

	    this.set('modalPosition', true);
	} else {

	    this.set('modalPosition', !this.get('modalPosition'));
	}

	$formField = $(this).parents('div[class*=-column]').find('input.form-text');

	// Disable the button upon updating the form field
	/*
	$formField.change(function() {
		
		// 7 letter full name minimum
		if($(this).val().length > 8) {

		    // Work-around
		    if(true) {
			
			return $(this).parents('div[class*=-column]').find('button.add-node-modal').attr('disabled', true);
		    }
		}
	    })
	.keyup(function(event) {

		if(event.which == 8 || event.which == 46 || $(this).val().length > 0) {

		    // Work-around
		    if(true) {
			
			return $(this).parents('div[class*=-column]').find('button.add-node-modal').attr('disabled', false);
		    }
		}
	    });
	*/
	
	return this.$element.click(function(event) {

		// property values are relative to the scope, and only the state of the HTML Document persists between method calls
		event.preventDefault();
		event.stopImmediatePropagation();

		this.contentTypeName = $(this).data('nodeFormModal')['contentTypeName'];
		this.humanType = $(this).data('nodeFormModal')['humanType'];
		
		//method = getMethodForElement($(this));
		//container = $('<div id="' + method + '-' + getContentTypeForElement($(this), method) + '-modal" class="' + method + '-node-modal-container">Loading...</div>').appendTo($('body')).hide();
		
		//if($('.ui-dialog').length % 2 > 0 ) {

		// 1225
		if($(this).data('nodeFormModal')['modalPosition']) {

		    if(this.humanType) {

			dialogTitle = 'Add a' + (/[aeiou]/i.exec(this.contentTypeName[0]) ? 'n ' : ' ') + this.humanType[0].toUpperCase() + this.humanType.slice(1);
		    } else {

			dialogTitle = 'Add a' + (/[aeiou]/i.exec(this.contentTypeName[0]) ? 'n ' : ' ') + this.contentTypeName[0].toUpperCase() + this.contentTypeName.slice(1);
		    }

		    dialogOptions = {
		    
			autoOpen: false,
			title: dialogTitle,
			width: 600,
			//height: (['book', 'periodical', 'item'].indexOf(this.contentTypeName) != -1 ? 680 : 448),
			height: (['book', 'periodical', 'item'].indexOf(this.contentTypeName) != -1 ? 560 : 448),
			close: function( event, ui ) {

			    $('#modal-content-container').data('nodeFormModal', {});
			}
		    };
		}
		/*
else {

		    dialogOptions = {

			autoOpen: false,
			width: 640,
			height: 480,
			position: {
			    
			    my: 'right bottom',
			    at: 'right bottom',
			    of: window
			}
		    };
		}
		*/
		$(this).data('nodeFormModal')['modalPosition'] = !$(this).data('nodeFormModal')['modalPosition'];

		/*
		dialogOptions = $('.ui-dialog').length % 2 > 0 ? {
		    
		    autoOpen: false,
		    width: 640,
		    height: 480
		} : {
		    
		    autoOpen: false,
			width: 640,
			height: 480,
			position: {
			
			my: 'right bottom',
			    at: 'right bottom',
			    of: window
			    }
		};
		*/

		//console.log(container );
		container.dialog( dialogOptions);
		
		container.dialog('open');
		// Work-around
		container.parent().css('z-index', 20000 + 10000 * $('.ui-dialog').length);
		
		this.method = $(this).data('nodeFormModal')['method'];

		/*
		  switch(this.method) {
		  
		  case 'edit':
		  
		  //url = '/node/' + this.get('contentTypeName') + '/edit';
		  //url = '/node/' + this.contentTypeName + '/edit';
		  url = $(this).attr('href');
		  break;
		  
		  case 'add':
		  
		  //url = '/node/add/' + this.get('contentTypeName');
		  //url = '/node/add/' + this.contentTypeName;
		  url = $(this).attr('href');
		  break;
		  }
		*/
		
		//url = $(this).attr('href');
		
		// For the variables within the scope of the AJAX request
		method = this.method;

		contentTypeName = this.contentTypeName;
		url = '/node/add/' + contentTypeName;
		
		//console.log( $(this).data('nodeFormModal')['loadFormModal']);
		//$.get(url, $(this).data('nodeFormModal')['loadFormModal']);
		
		// html.js body.html div.ui-dialog div#add-item-modal.add-node-modal-container div#page div#content.clearfix div.region div#block-system-main.block div.content form#human-node-form.node-form
		// html.js body.html div#page div#content.clearfix div.region div#block-system-main.block div.content form#human-node-form.node-form
		
		//$modalContainer = $('#modal-content-container');
		$modalContainer = $('<div id="modal-content-container-' + contentTypeName + '" class="modal-content-container" style="display: none;"></div>').appendTo($('body'));

		$modalContainer.data('nodeFormModal', {

			relatedFormElement: $(this),
			contentTypeName: this.contentTypeName,
			    humanType: this.humanType,
			    modal: container
			    });
		
		$.get(url, { isModalQuery: true }, function(data, textStatus, xhr) {

			$modalContainer = $('.modal-content-container').last();
			//$('#modal-content-container').append($(data));
			$modalContainer.append($(data).find('.main-container'));
			
			//$modal = container;
			$modal = $modalContainer.data('nodeFormModal')['modal'];
			contentTypeName = $modalContainer.data('nodeFormModal')['contentTypeName'];
			$relatedFormElement = $modalContainer.data('nodeFormModal')['relatedFormElement'];

			$form = $modalContainer.find('form#' + contentTypeName + '-node-form');
			$modalContainer.empty();
			$modal.empty();
			$modal.append($form);

			humanType = $modalContainer.data('nodeFormModal')['humanType'];

			if(humanType) {

			    $modal.find('#edit-field-person-type-und').val(humanType);
			}

			//container.load(url + ' div#page div#content.clearfix div.region div#block-system-main.block div.content form#' + contentTypeName + '-node-form.node-form', function(responseText, textStatus, xhr) {
			
			// Hide the preview button
			$modal.find('#edit-preview').hide();

			/**
			 * @author griffinj@lafayette.edu
			 *
			 */
			$modal.find('#edit-submit').hide();
			
			$submit = $modal.find('#edit-publish');
			//$submit = $modal.find('#edit-submit');

			/*
			  $(this).find('div#branding').hide();
			  $(this).find('ul.tabs.primary').hide();
			*/
			
			// Work-around
			//$('<input type="hidden" value="Save" name="op" />').appendTo($form);
			$('<input type="hidden" value="Publish" name="op" />').appendTo($form);
			// Work-around
			$form.append(STYLE_ELEMENTS);
			
			// Work-around
			//$submit.data('nodeFormModal.form', $form);
			//$submit.data('nodeFormModal.container', $(this));
			
			$submit.data('nodeFormModal', {
				
				relatedFormElement: $relatedFormElement,
				form: $form,
				    //container: $(this)
				    container: $modal
				    });

			/**
			 * Event handler for the modal form submission
			 *
			 */
			$submit.click(function(event) {
				
				event.preventDefault();
				event.stopImmediatePropagation();
				
				$form = $(this).data('nodeFormModal').form;

				//$.post('/node/' + method + '/' + contentTypeName, form.serialize(), function(data, textStatus) {
				$.post($form.attr('action'), $form.serialize(), function(data, textStatus, xhr) {
					
					$modalContainer = $('.modal-content-container').last();
					/*
					$modal = $modalContainer.data('nodeFormModal')['modal'];
					contentTypeName = $modalContainer.data('nodeFormModal')['contentTypeName'];
					$relatedFormElement = $modalContainer.data('nodeFormModal')['relatedFormElement'];

					$submit = $( '.ui-dialog').last().find('#edit-publish.btn');
					*/

					//$submit = $modalContainer.data('nodeFormModal')['relatedFormElement'];
					error = $(data).find('div.error');
					
					if(error.length > 0) {
					    
					    $.map(error, function(e, i) {
						    
						    $(e).dialog();
						});
					} else {

					    // Work-around; Refactor
					    $thisModal = null;
					    $('.ui-dialog').map(function(i, e) {

						    $e = $(e);

						    if(!$thisModal || (parseInt($e.css('zIndex'), 10) > parseInt($thisModal.css('zIndex'), 10))) {

							$thisModal = $e;
						    }
						});

					    $submit = $thisModal.find('#edit-publish');
					    //$submit = $thisModal.find('#edit-submit');

					    $relatedFormElement = $submit.data('nodeFormModal').relatedFormElement;

					    // This updates the form element to which the button was related
					    $relatedInputField = $relatedFormElement.parent().parent().find('input.form-text:last');
					    
					    // This assumes that the title is the first field
					    //entityRefStr = $(data).find('div.field-item.even').first().text() + ' (' + nodeId + ')';
					    entityRefStr = $(data).find('em.placeholder').text();

					    // Work-around
					    nodeId = /node\-(\d+)/.exec($(data).find('article').attr('id'))[1];
					    entityRefStr += ' (' + nodeId + ')';

					    /*
					    / **
					     * Work-around
					     * One must query Drupal again for the entity ID
					     *
					     * /

					    var m = /edit\-(.+?)\-und/.exec($relatedInputField.attr('id'));
					    var inputFieldName = m[1];
					    inputFieldName = inputFieldName.replace(/\-/g, '_', 'g');
					    $.get('/entityreference/autocomplete/tags/' + inputFieldName + '/node/item/NULL/' + encodeURI(entityRefStr), function(data) {

						    var entities = Object.keys(data).sort(function(u, v) {

							    u = /\((\d+)\)/.exec(u)[1];
							    v = /\((\d+)\)/.exec(v)[1];

							    if(u < v) {

								return -1;
							    }
							    if(u > v) {

								return 1;
							    }
							    
							    return 0;
							});
						    var m = /(".+?")/.exec(entities.pop());

						    if(m) {

							//islandoraDssElc['autoCompleteItem'] = m[1];
							//entityRefStr += ' (' + entityRefId + ')';

							entityRefStr = m[1];
						    }
						});
					    */

					    //$relatedInputField.val(entityRefStr);

					    /**
					     * Handling for personal relationship nodes
					     *
					     */
					    if($relatedInputField.attr('id') == 'edit-field-pers-rel-object-und') {

						$relatedInputField.val(entityRefStr);
						//$relatedInputField.change();
					    } else {

						/**
						 * Integration for tokenization
						 * @todo Refactor
						 */
						$("<li><a href='#' class='token'><span>" + '"' + entityRefStr + '"' + "</span><span class='token-x'>×</span></a></li>").appendTo( $relatedInputField.siblings('.token-list') );
						$relatedInputField.val('');
					    }

					    // Close the container
					    $container = $submit.data('nodeFormModal').container;
					    $container.dialog('close');
					    $container.remove();

					    // Trigger any handlers bound to the form field using the jQuery "change" event
					    $relatedInputField.change();
					}
				    });
			    });
			
			if(!isAjaxRequest) {

			    // Recurse for all elements in the modal
			    $(this).find('.add-node-modal').each(function(i, e) {
				    
				    // trace
				});
			}
		    });
	    });
    }
}(jQuery));
