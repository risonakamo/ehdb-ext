window.onload=main;

var _tabcount={known:0,unknown:0};
var _currentTabs;

function main()
{
    ReactDOM.render(React.createElement(ButtonControl),document.querySelector(".controls"));

    chrome.tabs.query({currentWindow:true},(tabs)=>{
        var tabbars=document.querySelector(".tab-bars");
        _currentTabs=[];
        for (var x=0;x<tabs.length;x++)
        {
            _currentTabs.push(processTabjson(tabs[x]));
            tabbars.insertAdjacentHTML("beforeend",genTabBar(_currentTabs[x]));
        }

        var tabcounts=document.querySelectorAll(".tab-count .count");
        tabcounts[0].innerText=_tabcount.known;
        tabcounts[1].innerText=_tabcount.unknown;

        console.log(_currentTabs);
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

    else if (tab.url.slice(0,22)=="https://www.dlsite.com")
    {
        res.title=tab.title.replace(/(.*)\s+サークルプロフィール \|.*/,"$1");
        res.type="DL";
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

function storeCurrentTabs()
{
    chrome.storage.local.set({currentTabs:_currentTabs});
}

function controlEvents()
{
    var buttons=document.querySelectorAll(".button");

    //save tabs
    buttons[0].addEventListener("click",(e)=>{
        storeCurrentTabs();
    });

    buttons[1].addEventListener("click",(e)=>{
        chrome.tabs.create({url:"tabeditor/tabedit.html"});
    });

    buttons[2].addEventListener("click",(e)=>{
        chrome.tabs.create({url:"mainpage/mainpage.html"});
    });
}

class ButtonControl extends React.Component
{
    constructor(props)
    {
        super(props);

        //menu text/button icon states to switch buttonState
        this.initialMenu=[["Tab Edit","/icons/tabedit.png"],["Main Page","/icons/mainpage.png"],""];
        this.confirmMenu=[["Confirm Save","/icons/confirm.png"],["Cancel Save","/icons/naw.png"],"deselectable"];

        //this.confirmMode=0

        this.state={
            buttonState:this.initialMenu
        };
    }

    render()
    {
        return [
            React.createElement(
                "div",
                {
                    className:`button ${this.state.buttonState[2]}`,
                    key:0,
                    onClick:()=>{
                        if (this.confirmMode)
                        {
                            return;
                        }

                        this.setState({buttonState:this.confirmMenu});
                        this.confirmMode=1;
                    }
                },

                React.createElement("img",{src:"/icons/savetabs.png"}),
                React.createElement("div",null,"Save Tabs")
            ),

            React.createElement(
                "div",
                {
                    className:"button",
                    key:1,
                    onClick:()=>{
                        if (this.confirmMode)
                        {
                            this.setState({buttonState:this.initialMenu});
                            this.confirmMode=0;
                            storeCurrentTabs();
                            return;
                        }

                        chrome.tabs.create({url:"tabeditor/tabedit.html"});
                    }
                },

                React.createElement("img",{src:this.state.buttonState[0][1]}),
                React.createElement("div",null,this.state.buttonState[0][0])
            ),

            React.createElement(
                "div",
                {
                    className:"button",
                    key:2,
                    onClick:()=>{
                        if (this.confirmMode)
                        {
                            this.setState({buttonState:this.initialMenu});
                            this.confirmMode=0;
                            return;
                        }

                        chrome.tabs.create({url:"mainpage/mainpage.html"});
                    }
                },

                React.createElement("img",{src:this.state.buttonState[1][1]}),
                React.createElement("div",null,this.state.buttonState[1][0])
            )
        ];
    }
}