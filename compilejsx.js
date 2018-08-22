const babel=require("babel-core");
const fs=require("fs");

babel.transformFile("mainpage/tageditor.jsx",{presets:["react"]},(err,res)=>{
    if (err)
    {
        console.log(err);
        return;
    }

    fs.writeFile("mainpage/tageditor.js",res.code,()=>{});
});