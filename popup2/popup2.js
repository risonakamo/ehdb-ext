window.onload=main;

var _tabcount={known:0,unknown:0};

function main()
{
    chrome.tabs.query({currentWindow:true},(tabs)=>{
        var tabbars=document.querySelector(".tab-bars");
        var res=[];
        for (var x=0;x<tabs.length;x++)
        {
            res.push(processTabjson(tabs[x]));
            tabbars.insertAdjacentHTML("beforeend",genTabBar(res[x]));
        }

        var tabcounts=document.querySelectorAll(".tab-count .count");
        tabcounts[0].innerText=_tabcount.known;
        tabcounts[1].innerText=_tabcount.unknown;

        console.log(res);
    });
}

//process tab and return js object data
function processTabjson(tab)
{
    var res={};
    _tabcount.known+=1;

    if (tab.url.slice(0,19)=="https://nhentai.net")
    {
        res.title=tab.title.replace(/.*: (.+) ».*/,"$1");
        res.type="NH";
    }

    else if (tab.url.slice(0,31)=="https://chan.sankakucomplex.com")
    {
        res.title=tab.title.replace(/(.+) \|.*/,"$1");
        res.type="SAN";
    }

    else if (tab.url.slice(0,21)=="https://www.pixiv.net")
    {
        res.title=tab.title.replace(/「(.+)」.*/,"$1");
        res.type="PX";
    }

    else if (tab.url.slice(0,17)=="https://hitomi.la")
    {
        res.title=tab.title.replace(/(.+) \|.*/,"$1");
        res.type="HIT";
    }

    else
    {
        res.title=tab.title;
        res.type="NONE";
        _tabcount.known-=1;
        _tabcount.unknown+=1;
    }

    res.url=tab.url;

    return res;
}

//generate tab bar element that goes in .tab-bars
//give it tab object from processTabjson
function genTabBar(tab)
{
    //from popup2-tabbar-gen.html
    return `<div class="bar ${tab.type}"><div class="type">${tab.type}</div><div class="title">${tab.title}</div></div>`;
}