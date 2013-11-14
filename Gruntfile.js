module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            dist: {
                options: {
                    baseUrl: 'src/scripts',
                    mainConfigFile: 'src/scripts/boot.js',
                    name: 'boot',
                    out: 'dist/scripts/build.js',
                    preserveLicenseComments: false
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    'dist/styles/all.css': 'src/styles/all.css'
                }
            }
        },

        copy: {
            dist: {
                cwd: 'src/',
                src: ['scripts/app/data/*', 'scripts/vendor/require.js', 'images/*'],
                dest: 'dist/',
                expand: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['requirejs', 'cssmin', 'copy']);
};