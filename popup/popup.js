window.onload=main;

function main()
{
    chrome.tabs.query({currentWindow:true},(tabs)=>{
        var res="";
        for (var x=0,l=tabs.length;x<l;x++)
        {
            res+=processTab(tabs[x]);
        }

        document.querySelector(".result").innerText=res;
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
    }

    res+=`\n${tab.url}\n---\n`;

    return res;
}