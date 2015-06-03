module.exports = function(grunt) {


	//Configurações
	grunt.initConfig({
		
		less: {
			development: {
				options: {
					paths: ['css']
				},
				files: {
					"css/main.css" : "css/main.less"
				}
			},
			production: {
				options: {
					paths: ['css']
				},
				files: {
					"css/main.css" : "css/main.less"
				}
			}
		}, // Less
		watch: {
			dist: {
				files: [
					'css/**/*.less', 
				],
				tasks: ['less']
			}
		} // Watch

	});

	//Carregando tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	//Registrando tasks
	grunt.registerTask('default', ['less']);
	grunt.registerTask('w', ['watch']);

}