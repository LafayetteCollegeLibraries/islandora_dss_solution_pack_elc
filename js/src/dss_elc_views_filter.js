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
    //
    $.fn.dataTable.pipeline = function(opts) {
	// Configuration options
	var conf = $.extend( {
		pages: 5,     // number of pages to cache
		url: '',      // script url
		data: null,   // function or object with parameters to send to the server
		// matching how `ajax.data` works in DataTables
		method: 'GET' // Ajax HTTP method
	    }, opts );
 
	// Private variables for storing the cache
	var cacheLower = -1;
	var cacheUpper = null;
	var cacheLastRequest = null;
	var cacheLastJson = null;
 
	return function(request, drawCallback, settings) {

	    var ajax          = false;
	    var requestStart  = request.start;
	    var requestLength = request.length;
	    var requestEnd    = requestStart + requestLength;
         
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
		//ajax = true;
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

		settings.jqXHR = $.ajax( {
			"type":     conf.method,
			"url":      conf.url,
			"data":     params,
			"dataType": "html",
			"cache":    false,
			"success":  function(xml) {

			    /**
			     * Here is where we primarily diverge from the approach implemented within the tutorial
			     */
			    var json = {data: []};
			    // Parse the DOM requests for the data
			    // Map each <td> as an element within a nested array
			    $(xml).find('.views-table tbody tr').each(function(i, row) {

				    json.data = json.data.concat($(row).children('td').map(function(i,e) {

						return e.textContent.trim();
					    }));
				});

			    cacheLastJson = $.extend(true, {}, json);
 
			    if ( cacheLower != requestStart ) {
				json.data.splice( 0, requestStart-cacheLower );
			    }
			    json.data.splice( requestLength, json.data.length );
                     
			    drawCallback( json );
			},
			"error":  function(jqXHR, textStatus, errorThrown) {

			    console.error(errorThrown);
			}
		    });
	    }
	    else {
		json = $.extend( true, {}, cacheLastJson );
		json.draw = request.draw; // Update the echo for each response
		json.data.splice( 0, requestStart-cacheLower );
		json.data.splice( requestLength, json.data.length );
 
		drawCallback(json);
	    }
	}
    };

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

    Drupal.behaviors.dssElcViewsFilter = {

	attach: function(context, settings) {

	    /**
	     * Instantiate the DataTable Object
	     */
	    var table = $('.views-table').DataTable({
		    
		    //"paging": false

		    /*
		    "ajax": {
		        "url": document.URL,
			"dataSrc": function(xml) {

			    $(xml).find('').each(function(i,e) {

				    
				});
			}
		    }
		    */

		    /*
		    "processing": true,
		    "serverSide": true,
		    "ajax": $.fn.dataTable.pipeline({

			    url: '/items',
			    pages: 1 // number of pages to cache
			})
		    */
		});

	    /**
	     * Iterate over all results
	     *
	     */
	    var termPage = parseInt(/page\=(\d+)/.exec($('.pager-last a').attr('href'))[1]);
	    var range = function(u, v) {

		return v >= u ? range(u, v - 1).concat(v) : [];
	    };
	    //$.each(range(1, termPage), function(j) {
	    $.each(range(1, 2), function(j) {

		    //$.get('/items', {page: j}, function(xml) {

			    /*
		    $.get('/ajax/items', {
			    sort: 'field_loan_duration_value',
			    page: j
				}, function(rows) {

			    for(row in rows) {

				table.add(row);
			    }
			});
			    */
		});

	    /**
	     * Append the input fields
	     */
	    $('th.views-field').filter(function(i,e) {

		    return !/View/.test(this.textContent) && !/Edit/.test(this.textContent);
		}).each(function() {
		    
		    $('<input class="" type="text" placeholder="Search '+ $(this).text().trim() +'" />').on( 'keyup change', function() {
			    
			    if(this.value != '') {
				
				//$('.views-table').DataTable.column( $(this).parent().index()+':visible' )
				table.column( $(this).parent().index()+':visible' )
				    .search( this.value )
				    .draw();
			    }
			}).on('click', function(event) {

				/**
				 * Ensures that focusing upon the filtration <input> element doesn't trigger the invoke sorting methods for the resident column
				 */
				event.stopImmediatePropagation();
			    }).appendTo(this);
		    });
	}
    };
}(jQuery, Drupal));
