/**
 * @file Helper for mocking the Drupal Object
 * @author griffinj@lafayette.edu
 *
 */
+function (window, jasmine, $) {

    "use strict";
    $.fn.dataTable = { Api: {register: function() {} } };

}(window, window.jasmine, window.jQuery);
