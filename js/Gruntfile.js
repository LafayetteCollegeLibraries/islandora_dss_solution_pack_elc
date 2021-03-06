module.exports = function(grunt) {

    grunt.initConfig({

	    pkg: grunt.file.readJSON('package.json'),

	    uglify: {
		options: {
		    banner: '/**\n' + ' * @file <%= pkg.name %> Module by the Lafayette College Libraries last built on <%= grunt.template.today("yyyy-mm-dd") %>\n' + ' * @see {@link https://github.com/LafayetteCollegeLibraries Lafayette College Libraries}\n' + ' */\n'
		},
		dynamic_mappings: {
		    files: [
			    {
			        expand: true,
			        cwd: 'src/',
			        src: ['**/*.js'],
			        dest: 'build/',
			        ext: '.min.js',
			        extDot: 'first'
			    },
			    ],
		},
	    },
	    jshint: {

		options: {

		    smarttabs: true
		},
		myFiles: ['src/**/*.js']
	    },
	    jasmine: {

		customTemplate: {

		    src: 'src/**/my_new_widget.js',
		    options: {

			specs: 'spec/*[sS]pec.js',
			helpers: 'spec/*[hH]elper.js',
			vendor: [
				 'http://code.jquery.com/jquery-1.8.2.min.js'
				 ]
		    },
		}
	    }
	});

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Compress by default
    //grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('default', ['uglify']);
};
