# gulp-pngquant-cache

A pngquant gulp plugin with cache.

**Inspired & Based on :** 
[gulp-pngquant](https://github.com/leidottw/gulp-pngquant) & [gulp-tinypng-unlimited](https://github.com/ystrdy/gulp-tinypng-unlimited)


## Installation

```bash
$ npm install gulp-pngquant-cache
```

## Usage

```js

const gulp = require('gulp');
const gulpPngquant = require('gulp-pngquant-cache');

gulp.task('compress', function() {
    gulp.src('./images/*.png')
        .pipe(gulpPngquant({
            quality: '65-80',
            cache: true,
            cachePath: path.join(__dirname, '_cache/')
        }))
        .pipe(gulp.dest('./compressed/'));
});

```

## License

MIT © [leidottw](https://github.com/finscn)
