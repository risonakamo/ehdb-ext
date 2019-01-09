window.onload=main;

var _hdb;

function main()
{
    var entries=document.querySelector(".entries");
    entries.focus();
    chrome.storage.local.get("hdb",(d)=>{
        _hdb=d.hdb;

        if (!_hdb)
        {
            _hdb={};
        }

        // console.log(_hdb);

        ReactDOM.render(React.createElement(EntryBoxHandler,{data:_hdb}),entries);
    });
}

//shuffle array in place
function randomiseArray(array)
{
    var t;
    var ri;
    for (var x=array.length-1;x>0;x--)
    {
        ri=randint(0,x);
        t=array[x];
        array[x]=array[ri];
        array[ri]=t;
    }
}

function randint(min,max)
{
    return Math.floor(Math.random()*(max-min+1))+min;
}