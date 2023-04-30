const gulp = require("gulp");
const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

// # 通用的CSS压缩

// gulp.task("css", () => {
//   return gulp
//     .src("src/css/**/*.css")
//     .pipe(concat("eltos.css"))
//     .pipe(
//       autoprefixer({
//         cascade: false,
//       })
//     )
//     .pipe(cssnano())
//     .pipe(rename({ suffix: ".min" }))
//     .pipe(gulp.dest("dist/css"));
// });

gulp.task("fonts", () => {
  return gulp
    .src("src/css/fonts/iconfont.css")
    .pipe(concat("fonts.css"))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/fonts"));
});

// gulp.task("layout", () => {
//   return gulp
//     .src("src/css/common/layout.css")
//     .pipe(concat("layout.css"))
//     .pipe(
//       autoprefixer({
//         cascade: false,
//       })
//     )
//     .pipe(cssnano())
//     .pipe(rename({ suffix: ".min" }))
//     .pipe(gulp.dest("dist/css"));
// });

// gulp.task("default", gulp.parallel("css", "layout"));
gulp.task("default", gulp.parallel("fonts"));
