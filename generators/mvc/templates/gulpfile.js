var gulp = require('gulp');

require('require-dir')('./gulp'); 

gulp.task('default', ['build', 'package'], function() { 
    return null;
});