module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            dist: {
                options: {
                    baseUrl: 'scripts',
                    mainConfigFile: 'scripts/boot.js',
                    name: 'boot',
                    out: 'scripts/build.js',
                    preserveLicenseComments: false,
                    paths: {
                        requireLib: 'vendor/require'
                    },
                    include: 'requireLib'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['requirejs']);
};