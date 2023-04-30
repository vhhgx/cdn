const gulp = require("gulp");
const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

// # 通用的CSS压缩

gulp.task("css", () => {
  return gulp
    .src("src/css/**/*.css")
    .pipe(concat("eltos.css"))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("layout", () => {
  return gulp
    .src("src/css/common/layout.css")
    .pipe(concat("layout.css"))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("default", gulp.parallel("css", "layout"));

// 压缩js文件
// gulp.task('jsCompress', function() {
//  return gulp.src('js/1.js').pipe(uglify()).pipe(gulp.dest('dist/js'))
// });

// // 压缩css文件
// gulp.task('cssCompress', function () {
// 	return gulp.src('libraries/style/reset.css')
//   // return gulp.src('libraries/style/flex.css')
//     .pipe(cleanCSS())
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('libraries/dist/css'))
// });

// gulp.task('cssCompress', function () {
//   return gulp.src('css/*.css')
//     .pipe(cleanCSS())
//     .pipe(concat('main.min.css'))
//     .pipe(gulp.dest('css/dist'))
// });
