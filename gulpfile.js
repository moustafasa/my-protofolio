const { series, parallel, dest, src, watch } = require("gulp"),
  prefixer = require("gulp-autoprefixer"),
  pug = require("gulp-pug"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass")(require("sass")),
  maps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify"),
  connect = require("gulp-connect"),
  cleanCss = require("gulp-clean-css"),
  notify = require("gulp-notify"),
  plumber = require("gulp-plumber"),
  zip = require("gulp-zip"),
  open = require("open"),
  ghPages = require("gulp-gh-pages");
// htmlMin = require("gulp-htmlmin");

// paths
let sassPath = { src: "./stage/css/pages/", dest: "./dist/css" };
let pugPath = { src: "./stage/html/pages/*.pug", dest: "./dist/" };
let jsPath = { src: "./stage/js/*.js", dest: "./dist/js" };
let cssPath = { src: "./dist/css/*.css", dest: "./dist/css/min" };

// tasks
function sassTask(cb) {
  src(sassPath.src + "*.*")
    .pipe(plumber())
    .pipe(maps.init({ largeFile: true }))
    .pipe(sass().on("error", sass.logError))
    // .pipe(prefixer("last 2 versions"))
    .pipe(maps.write("./maps"))
    .pipe(dest(sassPath.dest))
    .pipe(connect.reload());
  cb();
}
function minifycss(cb) {
  src(cssPath.src, { sourcemaps: true })
    .pipe(plumber())
    .pipe(cleanCss())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest(cssPath.dest, { sourcemaps: "./maps" }))
    .pipe(connect.reload());
  cb();
}
function html(cb) {
  src(pugPath.src)
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(dest(pugPath.dest))
    .pipe(connect.reload());
  cb();
}

function js(cb) {
  src(jsPath.src)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(dest(jsPath.dest))
    .pipe(connect.reload());
  cb();
}

function watchTask(cb) {
  connect.server({ root: "./dist", livereload: true, port: 8080 });
  open("http://localhost:8080");
  watch(["./stage/css/**"], { ignoreInitial: false }, series(sassTask));
  watch(["./stage/html/**"], { ignoreInitial: false }, series(html));
  watch(["./stage/js/**"], { ignoreInitial: false }, series(js));
  cb();
}

exports.default = watchTask;
