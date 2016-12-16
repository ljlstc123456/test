var fs = require('fs') ;
var fileArray = [] ;
function articles(){
    readFile("page") ;
    
} ;

function readFile(path){
    fs.readdir(path,function(err,files){
        if(err){
            console.log(err);
            return;
        }
        files.forEach(function(filename){
            fs.stat(path+"/"+filename,function(err, stats){
                if (err) throw err;
                //文件
                if(stats.isFile()&&filename.indexOf(".html")!=-1&&filename!="article.html"){
                   var data=fs.readFileSync(path+"/"+filename,'utf-8');

                   var a =  fs.statSync(path+"/"+filename);

                   //console.log(data) ;
                   var json = {
                        title:data.split('<a href="javascript:void(0)">')[1].split('</a>')[0],
                        content:data.split('<p>')[1].split('</p>')[0],
                        time:a.ctime.getTime(),
                        filename:path+"/"+filename
                   } ;
                   
                   fileArray.push(json) ;
                   fileArray.sort(function(a,b){
                        return b.time - a.time;
                   });
                   
                   writeFile(JSON.stringify({"articles":fileArray})) ;
                }else if(stats.isDirectory()){
                    var name = filename;
                    readFile(path+"/"+name);
                }
            });
        });
    });
} ;

// 写入到filelisttxt文件
function writeFile(data){
  var data = data;
  fs.writeFile("page/"+"article-config.json",data+'\n',function(err){
      if(err) throw err;
      console.log("写入成功");
  });
}

articles() ;
//exports.articles = articles;//留出接口
