const babel=require("babel-core");
const fs=require("fs");

babel.transformFile("mainpage/tageditor.jsx",{presets:["react"]},(err,res)=>{
    fs.writeFile("mainpage/tageditor.js",res.code,()=>{});
});