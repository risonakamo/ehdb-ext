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

function processTab(tab)
{
    if (tab.url.slice(0,19)=="https://nhentai.net")
    {
        return `${tab.title}\nimage/group\n${tab.url}\n---\n`;
    }

    else if (tab.url.slice(0,31)=="https://chan.sankakucomplex.com")
    {
        return `${tab.title}\nimage/group\n${tab.url}\n---\n`;
    }

    else if (tab.url.slice(0,21)=="https://www.pixiv.net")
    {
        return `${tab.title}\npixiv\n${tab.url}\n---\n`;
    }

    else if (tab.url.slice(0,17)=="https://hitomi.la")
    {
        return `${tab.title}\ncg/group\n${tab.url}\n---\n`;
    }

    return `${tab.title}\nunsupported site\n${tab.url}\n---\n`;
}