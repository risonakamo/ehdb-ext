window.onload=main;

var _tabcount={known:0,unknown:0};

function main()
{
    chrome.tabs.query({currentWindow:true},(tabs)=>{
        var res=[];
        for (var x=0,l=tabs.length;x<l;x++)
        {
            res.push(processTabjson(tabs[x]));
        }

        document.querySelector(".result").innerText=JSON.stringify(res);

        var infoline=document.querySelector(".info");
        var infolinestring=`found ${_tabcount.known} known site(s)`;
        if (_tabcount.unknown>0)
        {
            infolinestring+=`\nfound ${_tabcount.unknown} unknown site(s)`;
        }
        infolinestring+="\n---------\n";
        infoline.innerText=infolinestring;
    });

    document.querySelector(".combine-page").addEventListener("click",(e)=>{
        e.preventDefault();
        chrome.tabs.create({url:"combine/combine.html"});
    });
}

//old main returned output as new line strings
function mainold()
{
    chrome.tabs.query({currentWindow:true},(tabs)=>{
        var res="";
        for (var x=0,l=tabs.length;x<l;x++)
        {
            res+=processTab(tabs[x]);
        }

        document.querySelector(".result").innerText=res;

        var infoline=document.querySelector(".info");
        var infolinestring=`found ${_tabcount.known} known site(s)`;
        if (_tabcount.unknown>0)
        {
            infolinestring+=`\nfound ${_tabcount.unknown} unknown site(s)`;
        }
        infolinestring+="\n---------\n";
        infoline.innerText=infolinestring;
    });
}

/*output order:
  title
  type string
  url
  ---
*/
function processTab(tab)
{
    var res="";
    _tabcount.known+=1;

    if (tab.url.slice(0,19)=="https://nhentai.net")
    {
        res+=tab.title.replace(/.*: (.+) ».*/,"$1");
        res+=`\nmanga/group`;
    }

    else if (tab.url.slice(0,31)=="https://chan.sankakucomplex.com")
    {
        res+=tab.title.replace(/(.+) \|.*/,"$1");
        res+=`\nimage/group`;
    }

    else if (tab.url.slice(0,21)=="https://www.pixiv.net")
    {
        res+=tab.title.replace(/「(.+)」.*/,"$1");
        res+=`\npixiv`;
    }

    else if (tab.url.slice(0,17)=="https://hitomi.la")
    {
        res+=tab.title.replace(/(.+) \|.*/,"$1");
        res+=`\ncg/group`;
    }

    else
    {
        res+=tab.title;
        res+=`\nn/a`;
        _tabcount.known-=1;
        _tabcount.unknown+=1;
    }

    res+=`\n${tab.url}\n---\n`;

    return res;
}

//process tab and return js object data
function processTabjson(tab)
{
    var res={};
    _tabcount.known+=1;

    if (tab.url.slice(0,19)=="https://nhentai.net")
    {
        res.title=tab.title.replace(/.*: (.+) ».*/,"$1");
        res.type="manga/group";
    }

    else if (tab.url.slice(0,31)=="https://chan.sankakucomplex.com")
    {
        res.title=tab.title.replace(/(.+) \|.*/,"$1");
        res.type="image/group";
    }

    else if (tab.url.slice(0,21)=="https://www.pixiv.net")
    {
        res.title=tab.title.replace(/「(.+)」.*/,"$1");
        res.type="pixiv";
    }

    else if (tab.url.slice(0,17)=="https://hitomi.la")
    {
        res.title=tab.title.replace(/(.+) \|.*/,"$1");
        res.type="cg/group";
    }

    else
    {
        res.title=tab.title;
        res.type="n/a";
        _tabcount.known-=1;
        _tabcount.unknown+=1;
    }

    res.url=tab.url;

    return res;
}