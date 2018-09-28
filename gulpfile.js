const gulp=require("gulp");
const babel=require("gulp-babel");
const plumber=require("gulp-plumber");

console.log("gulp is watching");

gulp.watch("**/*.jsx",()=>{
    gulp.src("**/*.jsx",{base:"."}).pipe(plumber()).pipe(babel({presets:["@babel/preset-react"]})).pipe(gulp.dest("."));
});