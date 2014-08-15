
/**
 * @file Helper for mocking the Drupal Object
 * @author griffinj@lafayette.edu
 *
 */
+function (window, jasmine, $) {

    "use strict";
    window.Drupal = {
	behaviors: [],
	settings: []
    };

}(window, window.jasmine, window.jQuery);
