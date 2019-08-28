var fs = require("fs")
var path = require("path")
var relativePath = '/dist/static/css'
var root = path.join(__dirname) + relativePath

function readDirSync(path) {
	var pa = fs.readdirSync(path);
	// 循环遍历当前的文件以及文件夹
	pa.forEach(function(ele, index) {
		let fileNameReg = /\.css$/g;
		if(fileNameReg.test(ele)){
			// console.log(ele,typeof ele);
			replaceMethod(ele);
		}
	})
}
function replaceMethod(ele){
	var _path = root + "/" + ele
	fs.readFile(_path,'utf-8',function(err,data){  
	    if(err){  
	        console.error(err);  
	    }  
	    else{
	        data = data.replace(/(\.\/)?static\/img\//g,'../../static/img/');
	        fs.writeFile(_path,data,function(err){
	        	if(err){
	        		console.log(err);
	        	}else{
	        		// console.log("替换完成");
	        	}
	        });
	    }
	});
}
function runReplace(){
	readDirSync(root);
}
module.exports = runReplace