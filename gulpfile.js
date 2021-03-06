//gulp对象只有五个方法，src,dest,task,run,watch////
  //src方法获取文件数据流
  //task自定义任务名称和任务
  //run运行某个自定义任务
  //watch监控文件变化
  //dest将数据流输入到某个文件夹下

//全局配置
var author='wanghongxin';
var banner = ['/**',
  ' * @Author:<%= pkg.name1 %> and <%= pkg.name2 %>',
  ' * @Time:<%= new Date().toString().replace(/[\u4e00-\u9fa5]+/,"modified by wanghongxin") %>',
  ' */',
  ''].join('\n');
//定义项目依赖////////////  
    ////引入gulp////////
var gulp = require('gulp');
    //引入组件////
var jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    obfuscate = require('gulp-obfuscate'),
    minifycss = require('gulp-minify-css'),
    f5 = require('browser-sync'),
    bundle=require('gulp-browserify'),
    map=require('gulp-sourcemaps'),
    header=require('gulp-header'),
    // headerfooter = require('gulp-header-footer'),
    //sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');
// 备份源码
  //将app/js,app/css,app/html下的文件备份到根目录src文件夹下 
  ///////////////////////////////////////////////////////////////////////////////////
  //app目录下的js,css,html文件修改频繁,git适合用来恢复错误                            ////
  //备份到项目根目录下的文件应该是提交给公司的比较稳定的版本，这里的文件适合用git管理版本 ////                            //
  ////////////////////////////////
  /**
   * [task方法的用途]
   * @param  {[第一个参数]} ) { 第一个参数是字符串，可以任意自定义，为任务的名字} [description]
   * @param  {[第二个参数]} ) { 第二个参数是函数，可以任意自定义，为gulp任务} [description]
   * @param  {[第二个参数]} ) { 
   * 步骤一：在gulpfile定义了任务后
   * 步骤二：可以在git的bash/windows自带的cmd/等等命令行终端里
   * 步骤三：cd进入项目根目录，运行gulp+任务名字即可} [description]
   * @return {[type]}   [description]
   */
//备份脚本文件
gulp.task('copyjs', function() {
    return gulp.src('app/js/*.js')
        // .pipe(headerfooter({
        //       header:'//author:wanghongxin',
        //       footer:'//author:wanghongxin',
        //       filter: function(file){
        //           return true
        //       }
        //     }))
        .pipe(gulp.dest('src/js'));
});
//备份样式表
gulp.task('copycss', function() {
    return gulp.src('app/css/*.css')
        .pipe(gulp.dest('src/css'));
});
//备份文档
gulp.task('copyhtml', function() {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('src'));
});
//搭建服务器,监控文件变化,自动刷新浏览器
gulp.task('f5', function() {
    var files = [
        'app/**/*.html',
        'app/css/**/*.css',
        'app/img/**/*.png',
        'app/js/**/*.js'
    ];
    f5.init(files, {
        server: {
            baseDir: './app'
        }
    });
});
// 检查脚本,统一团队代码规范
gulp.task('jshint', function() {
    return gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//编译sass//
  ///////////////////////////////////////////////////////////////////////
  //将main.scss编译成main.css并放入app/css目录下//////// //
  ///////////////////////////////////////////////////////////////////////
  //可以在bash里手动输入gulp sass手动编译，     //////////////////////////
  //也可以用gulp.watch方法，自动监控文件变化，自动编译 //////////////
  ///////////////////////////////////////////////
gulp.task('sass', function() {
    gulp.src('app/sass/main.scss')
        .pipe(sass())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('app/css'));
});

//browserify
gulp.task('bundleA', function() {
    // Single entry point to browserify
    return gulp.src('app/js/service.js')
        .pipe(bundle())
        .pipe(rename('init.js'))
        .pipe(gulp.dest('app/js/bin'));
});
// gulp.task('bundleB', function() {
//     // Single entry point to browserify
//     return gulp.src('app/js/follow.js')
//         .pipe(bundle())
//         .pipe(rename('follow.js'))
//         .pipe(gulp.dest('app/js/bin'));
// });
gulp.task('bundleC', function() {
    // Single entry point to browserify
    return gulp.src('app/js/follow_iframe_music.js')
        .pipe(bundle())
        .pipe(rename('follow_iframe_music.js'))
        .pipe(gulp.dest('app/js/bin'));
});
gulp.task('bundleD', function() {
    // Single entry point to browserify
    return gulp.src('app/js/follow_auto.js')
        .pipe(bundle())
        .pipe(rename('follow_auto.js'))
        .pipe(gulp.dest('app/js/bin'));
});

// 合并、压缩并重命名文件        //
  ////////////////////////////
  // 此任务不必写入默认任务里//
  // 该任务在项目测试通过后，上线前运行即可，编译后的源码也不需要git管理 //
////////////////////////
gulp.task('minifyjs', function() {
    return gulp.src('app/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(header(banner,{pkg:{name1:'wanghongxin',name2:'fuwei'}}))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('minifyA', ['bundleA'],function() {
    return gulp.src('app/js/bin/init.js')
        .pipe(map.init())
        .pipe(rename('init.min.js'))
        .pipe(uglify({compress:{drop_console:true}}))
        .pipe(header(banner,{pkg:{name1:'wanghongxin',name2:'fuwei'}}))
        .pipe(map.write('maps',{addComment: true}))
        .pipe(gulp.dest('app/js/bin'));
});
// gulp.task('minifyB', ['bundleB'],function() {
//     return gulp.src('app/js/bin/follow.js')
//         .pipe(map.init())
//         .pipe(rename('follow.min.js'))
//         .pipe(uglify({compress:{drop_console:true}}))
//         .pipe(header(banner,{pkg:{name1:'wanghongxin',name2:'fuwei'}}))
//         .pipe(map.write('maps',{addComment: true}))
//         .pipe(gulp.dest('app/js/bin'));
// });
gulp.task('minifyC', ['bundleC'],function() {
    return gulp.src('app/js/bin/follow_iframe_music.js')
        .pipe(map.init())
        .pipe(rename('follow_iframe_music.min.js'))
        .pipe(uglify({compress:{drop_console:true}}))
        .pipe(header(banner,{pkg:{name1:'wanghongxin',name2:'fuwei'}}))
        .pipe(map.write('maps',{addComment: true}))
        .pipe(gulp.dest('app/js/bin'));
});
gulp.task('minifyD', ['bundleD'],function() {
    return gulp.src('app/js/bin/follow_auto.js')
        .pipe(map.init())
        .pipe(rename('follow_auto.min.js'))
        .pipe(uglify({compress:{drop_console:true}}))
        .pipe(header(banner,{pkg:{name1:'wanghongxin',name2:'fuwei'}}))
        .pipe(map.write('maps',{addComment: true}))
        .pipe(gulp.dest('app/js/bin'));
});
gulp.task('minifystyle', function() {
    return gulp.src('app/css/*.css')
        .pipe(concat('maga.css'))
        .pipe(header(banner,{pkg:{name1:'wanghongxin',name2:'fuwei'}}))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename('maga.min.css'))
        .pipe(minifycss())
        .pipe(header(banner,{pkg:{name1:'wanghongxin',name2:'fuwei'}}))
        .pipe(gulp.dest('app/css/bin'));
});
gulp.task('combinecss',function(){
  return gulp.src('app/css/*.css')
        .pipe(concat('maga.css'))
        .pipe(gulp.dest('app/css/bin'));
});
// 混淆代码 
// gulp.task('confuse', function() {
//     gulp.src('app/js/app.js')
//         .pipe(obfuscate())
//         .pipe(rename('bundle.esc.js'))
//         .pipe(gulp.dest('app/js'))
// });
//基于其它任务的默认任务
// gulp.task('default', function() {
//     gulp.run('jshint', 'sass','f5'); //运行代码检查，sass编译，自动刷新任务
//     gulp.watch('app/sass/**/*.scss', function() { //检测sass文件变化，自动运行sass任务
//         gulp.run('sass');
//     });
// });

//bundle版本
gulp.task('default', function() {
    gulp.run('bundleA','bundleC','bundleD','minifystyle','minifyA','minifyC','minifyD','f5'); //运行代码检查，sass编译，自动刷新任务
    // gulp.watch('app/sass/**/*.scss', function() { //检测sass文件变化，自动运行sass任务
    //     gulp.run('sass');
    // });
    gulp.watch(['app/js/*.js','app/js/lib/*.js','app/js/vender.js'], function() { //检测js文件变化，自动运行bundle任务
        gulp.run('bundleA','bundleC');
    });
    gulp.watch('app/js/bin/init.js', function() { //检测js文件变化，自动运行bundle任务
        gulp.run('minifyA');
    });
    // gulp.watch('app/js/bin/follow.js', function() { //检测js文件变化，自动运行bundle任务
    //     gulp.run('minifyB');
    // });
    gulp.watch('app/js/bin/follow_iframe_music.js', function() { //检测js文件变化，自动运行bundle任务
        gulp.run('minifyC');
    });
    gulp.watch('app/js/bin/follow_auto.js', function() { //检测js文件变化，自动运行bundle任务
        gulp.run('minifyD');
    });
    gulp.watch('app/css/**/*.css', function() { //检测js文件变化，自动运行bundle任务
        gulp.run('combinecss');
    });

});
gulp.task('online', function() {
    gulp.run('bundleA','bundleC','bundleD','minifyA','minifyC','minifyD','minifystyle')
});









































// var gulp=require('gulp'),
//     jshint=require('gulp-jshint'),
//     uglify=require('gulp-uglify'),
//     rename=require('gulp-rename'),
//     concat=require('gulp-concat'),
//     browserSync = require('browser-sync');


// gulp.task('min',function(){
//     return gulp.src('src/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'))
//     .pipe(uglify())
//     .pipe(rename({suffix:'.min'}))
//     .pipe(gulp.dest('min'))
//     .pipe(concat('app.min.js'))
//     .pipe(gulp.dest('dist'));
// });


// gulp.task('concat',function(){
//     return gulp.src('src/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'))
//     .pipe(concat('app.js'))
//     .pipe(gulp.dest('dist'))
//     .pipe(uglify())
//     .pipe(rename({suffix:'-min'}))
//     .pipe(gulp.dest('dist'));
// });


// gulp.task('browser-sync', function () {
//    var files = [
//       'app/**/*.html',
//       'app/assets/css/**/*.css',
//       'app/assets/imgs/**/*.png',
//       'app/assets/js/**/*.js'
//    ];

//    browserSync.init(files, {
//       server: {
//          baseDir: './app'
//       }
//    });
// });


// // 混淆                                       
// var gulp=require('gulp'),                
//     obfuscate=require('gulp-obfuscate'); 
// gulp.task('confuse',function(){        
//     gulp.src('dist/app.min.js')            
//         .pipe(obfuscate())               
//         .pipe(gulp.dest('build'))        
// });
