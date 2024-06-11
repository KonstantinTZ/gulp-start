const { src, dest, watch, parallel, series } = require('gulp');


const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function scripts() {
    return src([
        // 'node_modules/swiper/swiper-bundle.js', // пример как подключать несколько файлов JS
        // 'app/js/*.js', // ИЛИ все файлы из этой папки
        //'app/js/**/*.js', // ИЛИ все файлы из всех папок внутри этой папки
        // '!app/js/main.min.js'// !Кроме таких то файлов
        'app/js/main.js'

    ]) // нашли рабочие файлы
        .pipe(concat('main.min.js')) // обработали
        .pipe(uglify()) // обработали
        .pipe(dest('app/js')) // отдали "чистые файлы"
        .pipe(browserSync.stream()); // обновили страницу
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({ overrideBrowserslist: ['last 4 version'] })) // указвываем колличество версий префексирования
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream()); // обновили страницу
}

function watching() {
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/**/*.html']).on('change', browserSync.reload);//для всех HTML в любых папках внутри app
}

function browsersyncFn() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], { base: 'app' }) // сохранить структуру
        .pipe(dest('dist'))
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

exports.scripts = scripts;
exports.styles = styles;
exports.watching = watching;
exports.browsersyncFn = browsersyncFn;

exports.build = series(cleanDist, building); // series т.к. важна последовательность
exports.default = parallel(styles, scripts, browsersyncFn, watching)