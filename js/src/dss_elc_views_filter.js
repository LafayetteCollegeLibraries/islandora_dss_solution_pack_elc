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

    Drupal.behaviors.dssElcViewsFilter = {

	attach: function(context, settings) {

	    /**
	     * Instantiate the DataTable Object
	     */
	    var table = $('.views-table').DataTable({
		    
		    //"paging": false
		});
	    
	    /**
	     * Append the input fields
	     */
	    $('th.views-field').each(function() {
		    
		    $('<input class="" type="text" placeholder="Search '+ $(this).text().trim() +'" />').on( 'keyup change', function() {
			    
			    if(this.value != '') {
				
				//$('.views-table').DataTable.column( $(this).parent().index()+':visible' )
				table.column( $(this).parent().index()+':visible' )
				    .search( this.value )
				    .draw();
			    }
			}).appendTo(this);
		});
	}
    };
}(jQuery, Drupal));
