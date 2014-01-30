'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    proj: {
      app: 'app',
      dist: 'dist'
    },
    watch: {
      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['sass:dist']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/css/**/*.css',
          '{.tmp,<%= proj.app %>}/<%= js %>/**/*.js',
          '<%= proj.app %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= proj.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: [
            '<%= proj.dist %>'
          ]
        }
      },
      test: {
        options: {
          base: [
            '.tmp',
            'test',
            '<%= proj.app %>'
          ]
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= proj.dist %>/*',
            '!<%= proj.dist %>/.git*'
          ]
        }]
      },
      server: [
        '.tmp'
      ]
    },
    sass: {
      dist: {
          files: {
              '<%= proj.app %>css/styles.css': '<%= proj.app %>scss/styles.scss'
          }
      },
      dev: {
          options: {
              outputStyle: [
                  'expanded'
              ]
          },
          files: {
              '<%= proj.app %>css/styles.css': '<%= proj.app %>scss/styles.scss'
          }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= proj.dist %>/css',
          src: '**/*.css',
          dest: '<%= proj.dist %>/css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '.tmp/css',
          src: '**/*.css',
          dest: '.tmp/css'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= proj.app %>',
          src: [
            // Jekyll processes and moves HTML and text files.
            // Usemin moves CSS and javascript inside of Usemin blocks.
            // Copy moves asset files and directories.
            'img/**/*',
            'fonts/**/*',
            // Like Jekyll, exclude files & folders prefixed with an underscore.
            '!**/_*{,/**}',
            // Explicitly add any files your site needs for distribution here.
            '_bower_components/jquery/jquery.min.js',
            'favicon.ico',
            'apple-touch*.png'
          ],
          dest: '<%= proj.dist %>'
        }]
      },
      // Copy CSS into .tmp directory for Autoprefixer processing
      stageCss: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= proj.app %>/css',
          src: '**/*.css',
          dest: '.tmp/css'
        }]
      }
    },
    rev: {
      options: {
        length: 4
      },
      dist: {
        files: {
          src: [
            '<%= proj.dist %>/js/**/*.js',
            '<%= proj.dist %>/css/**/*.css',
            '<%= proj.dist %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}',
            '<%= proj.dist %>/fonts/**/*.{eot*,otf,svg,ttf,woff}'
          ]
        }
      }
    },
    buildcontrol: {
      dist: {
        options: {
          remote: 'git@github.com:baudoin/proj.git',
          branch: 'production',
          commit: true,
          push: true
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= proj.app %>/js/**/*.js',
        'test/spec/**/*.js',
        '!<%= proj.app %>/js/vendor/**/*'
      ]
    },
    concurrent: {
      server: [
        // 'compass:server',
        'copy:stageCss',
      ],
      dist: [
        // 'compass:dist',
        'copy:dist'
      ]
    }
  });

  // Default task.
  // grunt.registerTask('default', ['jshint','sass','watch']);

  // // These plugins provide necessary tasks.
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-sass');
  // grunt.loadNpmTasks('grunt-contrib-watch');

  // Define Tasks
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('check', [
    'clean:server',
    // 'compass:server',
    'jshint:all',
    'csscss:check',
    'csslint:check'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    'useminPrepare',
    'concat',
    'autoprefixer:dist',
    'cssmin',
    'svgmin',
    'rev',
    'usemin',
    'htmlmin'
    ]);

  grunt.registerTask('deploy', [
    'check',
    'test',
    'build',
    'buildcontrol'
    ]);

  grunt.registerTask('default', [
    'check',
    'test',
    'build'
  ]);

};
