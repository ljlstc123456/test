/* 
* @Author: Marte
* @Date:   2016-11-24 10:52:46
* @Last Modified by:   Marte
* @Last Modified time: 2016-12-16 15:27:22
*/

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    html2js = require('gulp-html2js'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    fs = require('fs') ;
 //提取动画库中的配置
function activateAnimations() {
  var categories = JSON.parse(fs.readFileSync('animate-config.json')),
    category, files, file,
    target = ['src/animatecss/_base.less'],
    count = 0;
  for (category in categories) {
    if (categories.hasOwnProperty(category)) {
      files = categories[category];

      for (var i = 0; i < files.length; ++i) {
        if(files[i].split(":")[1] == 1){
          target.push('src/animatecss/' + category + '/' + files[i].split(":")[0]+ '.css');
          count += 1;
        }
      }
    }
  }

  if (!count) {
    console.log('没有动画');
    target = [] ;
  } else {
    console.log(count + (count > 1 ? ' 个动画' : ' 个动画') + ' 被编译');
  }

return target;
}

var animatecss = activateAnimations() ;



//编译模板
gulp.task('tpl', function () {
    gulp.src('src/tpl/*.html')
        .pipe(html2js('templates.js', {
            adapter: 'javascript',
            base: 'templates',
            name: 'TPL'
        }))
        .pipe(gulp.dest('src/js'));
});

//编译header 和 footer
gulp.task('includecssjs',function(){
    gulp.src(['include_css.html','include_js.html'])
        .pipe(html2js('templates.js'))
        .pipe(gulp.dest('./'));
}) ;


//合并第三方库并压缩
gulp.task('libs', function () {
    gulp.src('src/js/第三方库/*.js')
        .pipe(concat('lib.js'))//合并后的文件名
        .pipe(uglify())
        .pipe(gulp.dest('src/js'));
});

//合并我的js
gulp.task('myjs', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('base.js'))//合并后的文件名
        .pipe(gulp.dest('js'));
});

//合并bootstrap的js,并压缩
gulp.task('bootstrapjs', function () {
    gulp.src([
          'src/bootstrap/js/transition.js',
          // 'src/bootstrap/js/alert.js',
          // 'src/bootstrap/js/button.js',
          // 'src/bootstrap/js/carousel.js',
          'src/bootstrap/js/collapse.js',
          // 'src/bootstrap/js/dropdown.js',
          'src/bootstrap/js/modal.js',
          'src/bootstrap/js/tooltip.js',
          'src/bootstrap/js/popover.js',
          // 'src/bootstrap/js/scrollspy.js',
          'src/bootstrap/js/tab.js',
          // 'src/bootstrap/js/affix.js',
          'src/bootstrap/js/placeholder.js',//自己加入的 兼容ie的  placeholder插件
          'src/bootstrap/js/_tpl.js'//underscore的模板引擎
        ])
        .pipe(concat('bootstrap.min.js'))//合并后的文件名
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

//合并压缩validate表单插件
gulp.task('validate', function () {
    gulp.src([
          'src/表单验证/jquery.metadata.js',
          'src/表单验证/jquery.validate.js',
          'src/表单验证/additional-methods.js',
          'src/表单验证/messages_zh.js'
        ])
        .pipe(concat('validate.min.js'))//合并后的文件名
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

//bootstrapcss压缩合并
gulp.task('bootstrapcss', function () {
    gulp.src('src/bootstrap/less/bootstrap.less')
        .pipe(less("bootstrap.min.css"))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css/'));
});

//我的css压缩合并
gulp.task('mycss', function () {
    gulp.src(['src/css/**/*.less','src/css/**/*.css'])
        .pipe(concat("styles.css"))
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('css/'));
});

//编译项目
gulp.task('build',['tpl','myjs','mycss']);
//编译bootstrap
gulp.task('bootstrap',['bootstrapjs','bootstrapcss']) ;
//编译validate
gulp.task('validate',['validate']) ;
//编译header和footer
gulp.task('include',['includecssjs']) ;