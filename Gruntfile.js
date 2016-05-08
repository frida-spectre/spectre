module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            release: ['./dist']
        },
        ts: {
            default: {
                tsconfig: true
            }
        }
    });
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('default', ['clean', 'ts']);
};