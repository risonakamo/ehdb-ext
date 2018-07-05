window.onload=main;

function main()
{

}

function combine()
{
    var gendata=JSON.parse(document.querySelector(".gen-input").value);
    var imgs=document.querySelector(".imgs").value.split("\n");
    var tags=document.querySelector(".tags").value.split("\n");

    //could make this better
    if (gendata.length!=imgs.length || gendata.length!=tags.length)
    {
        console.warn("data length mismatch");
        console.group("data counts");
        console.warn(`gendata: ${gendata.length}`);
        console.warn(`imgs: ${imgs.length}`);
        console.warn(`tags: ${tags.length}`);
        console.groupEnd();
        return;
    }

    var res="";
    for (var x=0,l=gendata.length;x<l;x++)
    {
        res+=`${gendata[x].title}\n${gendata[x].type}\n${imgs[x]}\n${gendata[x].url}\n${tags[x]}\n------\n`;
    }

    return res;
}