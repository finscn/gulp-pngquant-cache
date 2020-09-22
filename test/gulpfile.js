const path = require('path');
const gulp = require('gulp');
const gulpPngquant = require('../');

gulp.task('default', () => {
    return gulp.src('./img/**/*.png')
        .pipe(gulpPngquant({
            quality: '70-80',
            cache: true,
            cachePath: path.join(__dirname, '_cache/'),
        }))
        .pipe(gulp.dest('./dist'));
});
