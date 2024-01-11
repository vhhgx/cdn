// const gulp = require('gulp')
// // 获取 cleancss 模块（用于压缩 CSS）
// const uglify = require('gulp-uglify');
// const cleanCSS = require('gulp-clean-css')
// const rename = require('gulp-rename')
// const concat = require('gulp-concat')

// // 压缩js文件
// // gulp.task('jsCompress', function() {
// //  return gulp.src('js/1.js').pipe(uglify()).pipe(gulp.dest('dist/js'))
// // });

// // 压缩css文件
// gulp.task('cssCompress', function () {
// 	return gulp.src('libraries/style/reset.css')
//   // return gulp.src('libraries/style/flex.css')
//     .pipe(cleanCSS())
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('libraries/dist/css'))
// });

// // gulp.task('cssCompress', function () {
// //   return gulp.src('css/*.css')
// //     .pipe(cleanCSS())
// //     .pipe(concat('main.min.css'))
// //     .pipe(gulp.dest('css/dist'))
// // });

const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')

// 定义一个名为 'compress-css' 的 Gulp 任务
gulp.task('compress-css', () => {
  return gulp
    .src('src/styles/flex.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('dist/styles'))
})
