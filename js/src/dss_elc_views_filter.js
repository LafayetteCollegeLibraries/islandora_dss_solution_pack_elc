/**
 * @file DssElcViewsFilter Class and dssElcViewsFilter jQuery Plug-in
 * @author griffinj@lafayette.edu
 *
 */

/** Inline constructor for providing access to methods */
function DssElcViewsFilter() {};

/**
 * Mutator
 * @todo Refactor by extending Backbone.js Model
 */
DssElcViewsFilter.prototype.set = function(property, value) {

    this.property = value;
    $(this.element).data('dssElcViewsFilter', this);
};

/**
 * Accessor
 * @todo Refactor by extending Backbone.js Model
 */
DssElcViewsFilter.prototype.get = function(property) {

    var dssElcViewsFilter = $(this.element).data('dssElcViewsFilter');
    return dssElcViewsFilter[property];
};

/**
 * @constructor for DssElcViewsFilter
 * @params [Object] options
 *
 */
function DssElcViewsFilter(options) {

    // Retrieve the jQuery Object from the global context
    var $ = options.$ || jQuery;

    var settings = $.extend({}, options);
    //this.context = settings.context;

    this.element = settings.element;
};

/**
 * jQuery and Drupal 7 Integration
 */
(function($, Drupal) {

    /**
     * The jQuery Plug-in
     */
    $.fn.dssElcViewsFilter = function() {

	return this.each(function(i,e) {

		new DssElcViewsFilter({element: this});
	    });
    };

    /**
     * The DataTables pipeline implementation
     */
    //
    // Pipelining function for DataTables. To be used to the `ajax` option of DataTables
    // making table a global var

    $.fn.dataTable.pipeline = function(opts) {
    
	var this_url;

	//deciding which url to make the ajax request to
	switch (document.title) {
            
	case 'Browse Items | The Easton Library Company Project': 
	    this_url = '/datatable_item/views/items';
	    break;
             	
	case 'Browse People | The Easton Library Company Project':
	    this_url = '/datatable_person/views/people';
	    break;
             	
	case 'Browse Loans | The Easton Library Company Project':
	default:
	    this_url = '/datatable_loan/views/loans';
	    break;
	};
    
	// Configuration options
	var conf = $.extend( {
		pages: 5,     // number of pages to cache
		url: this_url,
		data: null,   // function or object with parameters to send to the server
		// matching how `ajax.data` works in DataTables
		method: 'GET' // Ajax HTTP method
	    }, opts );
 
	// Private variables for storing the cache
	var cacheLower = -1;
	var cacheUpper = null;
	var cacheLastRequest = null;
	var cacheLastJson = null;
	var cacheLastAuthor = null;
 
	return function(request, drawCallback, settings) {

	    var ajax          = false;
	    var requestStart  = request.start;
	    var requestLength = request.length;
	    var requestEnd    = requestStart + requestLength;
	    var drawStart     = request.start;
        
	    var isSearch = false;
	    if ( settings.clearCache ) {
		// API requested that the cache be cleared
		ajax = true;
		settings.clearCache = false;
	    }
	    else if ( cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper ) {
		// outside cached data - need to make a request
		ajax = true;
	    }
	    else if ( JSON.stringify( request.order )   !== JSON.stringify( cacheLastRequest.order ) ||
		      JSON.stringify( request.columns ) !== JSON.stringify( cacheLastRequest.columns ) ||
		      JSON.stringify( request.search )  !== JSON.stringify( cacheLastRequest.search )
		      ) {

		/**
		 * Unfortunately, integration with the Views API must be further extended in order to specify only select columns or to refine the View with a search
		 * @todo Integrate with the View and Search API's
		 */
		
		isSearch = true;
		// properties changed (ordering, columns, searching)
		ajax = true;
	    }
	    // Store the request for checking next time around
	    cacheLastRequest = $.extend( true, {}, request );
 
	    if ( ajax ) {
		// Need data from the server
		if ( requestStart < cacheLower ) {
		    requestStart = requestStart - (requestLength*(conf.pages-1));
 
		    if ( requestStart < 0 ) {
			requestStart = 0;
		    }
		}
             
		cacheLower = requestStart;
		cacheUpper = requestStart + (requestLength * conf.pages);
 
		request.start = requestStart;
		request.length = requestLength*conf.pages;
 
		// Provide the same `data` options as DataTables.
		if ( $.isFunction ( conf.data ) ) {
		    // As a function it is executed with the data object as an arg
		    // for manipulation. If an object is returned, it is used as the
		    // data object to submit
		    var d = conf.data( request );
		    if ( d ) {
			$.extend( request, d );
		    }
		}
		else if ( $.isPlainObject( conf.data ) ) {
		    // As an object, the data given extends the default
		    $.extend( request, conf.data );
		}

		/**
		 * Specify the pages for Views
		 * Map request.start to $view->current_page
		 * Map request.length to $view->offset
		 * Map request.order to $view->sort (must be transformed into an array of variables linked to Drupal View field names e.g. field_loan_duration_value)
		 * Map request.order to $view->filters (must be transformed into an array of variables linked to Drupal View field names e.g. field_loan_duration_value)
		 *
		 */
		/*
		  var dtSettings = { currentPage: request.start,
				     offset: request.length };
		*/
		var dtSettings = {};

		/**
		 * Wrapper for the request Object
		 * @todo More cleanly integrate with the services and services_views Modules
		 * @todo Include CSRF token (Drupal services Module)
		 *
		 */

		var params = {

		    'dataTables': {

			'settings': dtSettings,
		    },
		    'token': 'csrf_validate_me',
		    'page': (requestStart == 0 || isSearch) ? requestStart : (requestStart / 10)
		};
		//var params = $.extend({}, request);

		//Checking to make sure that the search values havent been deleted
		if($('input:first','tr').text()!='') {

			request.columns[0].search.value = '';
		}
		if($('input:last','tr').text()!='') {

			request.columns[1].search.value = '';
		}	
		request.authors = jQuery('input','#search_authors').prop('checked');

		/**
		 * @author griffinj@lafayette.edu
		 * Cleaning values for the request.order Array
		 *
		 */
		//request.order = request.order.map(function, 
		request.order = request.order.map(function(e) {

			if(typeof(e.dir) == 'number') {

			    e.dir = [null,'asc','desc'][e.dir];
			}

			return e;
		    });
		
		settings.jqXHR = $.ajax( {
			"type":     conf.method,
			"url":      conf.url,
			"data":     request,
			"dataType": "json",
			"cache":    false,
			"success":  function(json) {

			    cacheLastJson = $.extend(true, {}, json);
 
			    if ( cacheLower != drawStart ) {
				json.aaData.splice( 0, drawStart-cacheLower );
			    }
                    
			    json.aaData.splice( requestLength, json.aaData.length );
	                    
			    drawCallback( json );
			    cleanUp();
			},
			"error":  function(jqXHR, textStatus, errorThrown) {

			    /**
			     * @author griffinj@lafayette.edu
			     * Resolves issues for an unavailable Solr instance
			     *
			     **/
			    if(jqXHR.status == 500) {

				console.error('Apache Solr instance raised an error at ' + conf.url);
				console.error('Request: ');
				console.error(request);
				console.error(jqXHR.responseText);
			    } else {

				console.error(errorThrown);
				console.error(jqXHR);
				console.error(textStatus);
			    }
			}
		    });
	    }
	    else {
		json = $.extend( true, {}, cacheLastJson );
		json.draw = request.draw; // Update the echo for each response
		json.aaData.splice( 0, requestStart-cacheLower );
		json.aaData.splice( requestLength, json.aaData.length );
 		
		drawCallback(json);
		cleanUp();
	    }
	};
    };

    /*
     * Reads the node values from each view/edit cell and replaces it with a hyperlink to the correct page
     * @author stathisw@lafayette.edu
     *
     */
    function formatLinks () {
	
	if(window.location.pathname == '/items' ||
	   
	   window.location.pathname == '/loans' ||
	   /node/.exec(window.location.pathname)) {
		    
	    $('td:eq(6)','tr').each(function(i,e){
				var temp = $(e).text();
				$(e).text('');
				$('<a href="'+'/node/'+temp+'">'+'View'+'</a>').appendTo($(e));
				
			});
			
			$('td:eq(7)','tr').each(function(i,e){
				var temp = $(e).text();
				$(e).text('');
				$('<a href="'+'/node/'+temp+'/edit">'+'Edit'+'</a>').appendTo($(e));
				
			});
			
		}
		else if(window.location.pathname == '/people'){
			
			$('td:eq(2)','tr').each(function(i,e){
				var temp = $(e).text();
				$(e).text('');
				$('<a href="'+'/node/'+temp+'">'+'View'+'</a>').appendTo($(e));
				
			});
			
			$('td:eq(3)','tr').each(function(i,e){
				var temp = $(e).text();
				$(e).text('');
				$('<a href="'+'/node/'+temp+'/edit">'+'Edit'+'</a>').appendTo($(e));
				
			});
			
		}
	}
	/*
	 * Parses the date and changes it to a human-readable form
	 */
        function formatDate() {
	        if(window.location.pathname == '/people') {
			jQuery('td:eq(1)','tr').each(function(i,e) {
				if(!window.isNaN( $(e).text())) {
				    var temp = parseInt($(e).text());
				    var dateObj = new Date((temp)*1000);
				    $(e).text( moment(dateObj).format('YYYY-MM-DD') );
				}
			});
		}
		else if(window.location.pathname == '/items' ||
			window.location.pathname == '/loans' ||
			/node/.exec(window.location.pathname)) {

			jQuery('td:eq(5)','tr').each(function(i,e) {
				if(!window.isNaN( $(e).text())) {
				    var temp = parseInt($(e).text());
				    var dateObj = new Date((temp)*1000);
				    $(e).text( moment(dateObj).format('YYYY-MM-DD') );
				}
			});
			if(window.location.pathname =='/loans' ||
			   /node/.exec(window.location.pathname)) {
				jQuery('td:eq(2)','tr').each(function(i,e) {
					if(!window.isNaN( $(e).text())) {
					    var temp = parseInt($(e).text());
					    if(temp > 0) {
						var dateObj = new Date((temp)*1000);
						$(e).text( moment(dateObj).format('YYYY-MM-DD') );
					    } else {
						var dateObj = new Date((temp)*1000);
						$(e).text( moment(dateObj).format('YYYY-MM-DD') );
					    }
					}
			});
			}
		}
	}
	/*
	 * Does various tasks related to cleaning up the DataTables object to make it presentable in the end
	 */
	function cleanUp(){
	
		formatDate();
		formatLinks();
		jQuery('#DataTables_Table_2_filter').remove();
		jQuery('.views-field-changed').children('input').remove();
		jQuery('.views-field-field-loan-duration').children('input').remove();
	
	}
	

    /**
     * Modify the cache-clearing setting within the scope of the method
     * (No real purpose to writing an OO-wrapper for this plug-in)
     * Please see https://datatables.net/examples/server_side/pipeline.html
     */
    // Register an API method that will empty the pipelined data, forcing an Ajax
    // fetch on the next draw (i.e. `table.clearPipeline().draw()`)
    $.fn.dataTable.Api.register( 'clearPipeline()', function() {

	    return this.iterator( 'table', function (settings) {

		    settings.clearCache = true;
		});
	});

    var this_url;

    Drupal.behaviors.dssElcViewsFilter = {

	attach: function(context, settings) {

	/**
	 * @author griffinj@lafayette.edu
	 * Abstract the default sorting to vary by each View
	 *
	 */

	order = [[ 0, "asc" ]];

	//deciding which url to make the ajax request to
	switch (document.title){
            
             case 'Browse Items | The Easton Library Company Project': 
             	this_url = '/datatable_item/views/items';
	        order = [[ 1, "asc" ]];
             	break;
             	
             case 'Browse People | The Easton Library Company Project':
             	this_url = '/datatable_person/views/people';
             	break;
             	
             case 'Browse Loans | The Easton Library Company Project':
	     default:
		this_url = '/datatable_loan/views/loans';
	        order = [[ 2, "asc" ]];
             	break;
             };

	/**
	 * @author griffinj@lafayette.edu
	 *
	 */
	var nidMatch = /node\/(\d+)/.exec( window.location.pathname );
	if(nidMatch) {

	    this_url = '/datatable_loan/views/loans/?nid=' + nidMatch[1];
	    order = [[ 2, "asc" ]];
	}
	
	// Store the current sort
	// For some reason, this could not be retrieve this from the DataTables instance

	$(document).data('dssElc.dataTables.currentSortCol', order[0][0]);
	$(document).data('dssElc.dataTables.currentSortDir', order[0][0]);
	$(document).data('dssElc.dataTables.currentSort', order);

	/**
	 * Instantiate the DataTable Object
	 */
	var table = $('.views-table').DataTable({
		    
		"order": order,
		"processing": true,
		"serverSide": true,
		"ajax": $.fn.dataTable.pipeline({
			
			url: this_url,
			pages: 5 // number of pages to cache
		    })
	    });

	/*
	table.on( 'search.dt', function(e, settings) {

		/**
		 * This does *not* resolve EDDC-339
		 *
		 * /
	    });
	*/

	/**
	 * @author stathisw@lafayette.edu
	 * Integrates the Pipeline functionality with the DataTables plug-in
	 *
	 */
	jQuery('th.views-field').filter(function(i,e) {
		
		return !/View/.test(this.textContent) && !/Edit/.test(this.textContent);
		
	    }).on('click',function(event){

		    $.fn.dataTable.pipeline({
			    
			    url: this_url,
			    pages: 5, // number of pages to cache
			});
		});
	
	/**
	 * Append the input fields
	 */
	$('th.views-field').filter(function(i,e) {
		
		return !/View/.test(this.textContent) && !/Edit/.test(this.textContent);
		
	    }).each(function() {
		    
		    $('<input class="" type="text" placeholder="Search '+ $(this).text().trim() +'" />')

			.on('keyup', function(e) {

				/**
				 * DEPRECATED
				 * @todo Remove
				 * @author griffinj@lafayette.edu
				 * Implements handling for the depression of the "enter" key
				 * Resolves EDDC-339
				 *
				 */
				var searchFilter = $(this).val();

				console.log('keyup event triggered');
				console.log(e);

				/**
				 * This is handled instread within DataTables core
				 *
				 */

				/*
				if(e.keyCode == 13 && searchFilter == '') {

				    e.stopImmediatePropagation();
				    return;
				}
				*/

				$(document).data('dssElc.dataTables.columnKeyup', e);

				$(document).data('dssElc.dataTables.emptySearch', $(this).val() == '');
				$(document).data('dssElc.dataTables.searchFilter', searchFilter);
				
				var $table = table.column( $(this).parent().index()+':visible' )

				    .on('order.dt', function(e, settings) {

					    /**
					     * Introduces a race condition for browsers; as a consequence, this does not conclusively resolve the issue
					     * This does *not* resolve EDDC-339
					     * @author griffinj@lafayette.edu
					     * Implements handling for the depression of the "enter" key
					     *
					     */
					    

					    //if(typeof(searchFilter) != 'undefined' && searchFilter == '') {
					    var emptySearch = $(document).data('dssElc.dataTables.emptySearch');

					    if( typeof(emptySearch) != 'undefined' && emptySearch ) {

						console.log('trace: emptySearch global');
						
					        $(document).data('dssElc.dataTables.emptySearch', false);

						/*
						searchFilter = $('th.views-field:nth-child(' + settings.aLastSort[0].col + ') input').val();
						table.order([ settings.aLastSort[0].col + 1, settings.aLastSort[0].dir ]).draw();
						*/

						//currentSortIndex = $(document).data('dssElc.dataTables.currentSortIndex');

						//table.order([ currentSortIndex, settings.aLastSort[0].dir ]).draw();
						table.order( [ $(document).data('dssElc.dataTables.currentSortCol'),
							       $(document).data('dssElc.dataTables.currentSortDir') ] ).draw();

						//table.order([ [ settings.aLastSort[0].col + 1, settings.aLastSort[0].dir ]  ]).draw();

						//searchFilter = $('th.views-field:nth-child(' + settings.aLastSort[0].col + 2 + ') input').val();
					    }

					    $(document).data('dssElc.dataTables.currentSortCol', settings.aLastSort[0].col);
					    $(document).data('dssElc.dataTables.currentSortDir', settings.aLastSort[0].dir);
					    $(document).data('dssElc.dataTables.currentSort', settings.aaSorting);

					    /*
					    //var filter = '';
					    var sortIndex = $(document).data('dssElc.dataTables.sortIndex');
					    if(typeof(sortIndex) == 'undefined') {

						sortIndex = table.order()[0][0] + 1;
						$(document).data('dssElc.dataTables.sortIndex',
								 sortIndex);
					    }
					    var filter = $('th.views-field:nth-child(' + sortIndex + ') input').val();

					    //if(typeof(filter) != 'undefined' && filter == '') {

					    */
					});

				//.search( this.value )
				//.draw();
				
				/**
				 * EDDC-339
				 *
				 */
				if( this.value.trim() != '' || ( e.keyCode == 8 || e.keyCode == 46 )) {
				    
				    $table.search( this.value ).draw();
				}
				
			    }).on('click', function(event) {
				    
				    /**
				     * Ensures that focusing upon the filtration <input> element doesn't trigger the invoke sorting methods for the resident column
				     */
				    event.stopImmediatePropagation();
				}).appendTo(this);
		});
	/*
	 * 
	 * @author stathisw implementing a checkbox for deciding whether or not to search authors
	 *
	 * @author goodnowt edited for placement checkbox in mark-up
	 * 
	 */
	if(window.location.pathname == '/people'){	   
	    jQuery('#DataTables_Table_0_filter').before('<div id="search_authors" class="DataTables_Control" align=middle />');
	    jQuery('#search_authors').append('<input type="checkbox" name="search_authors" />');
	    jQuery('#search_authors').append('<p align=middle/>');
	    jQuery('p','#search_authors').append('Include Authors').width(100);
	    jQuery('input','#search_authors').on('click',function(event){
		    
		    table.clearPipeline().draw();
		});
	}
	}
    };
}(jQuery, Drupal));
