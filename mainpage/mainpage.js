window.onload=main;

var _hdb;
var _tags={};

function main()
{
    chrome.storage.local.get("hdb",(d)=>{
        _hdb=d.hdb;

        if (!_hdb)
        {
            _hdb={};
        }

        console.log(_hdb);

        ReactDOM.render(React.createElement(EntryBoxHandler,{data:_hdb}),document.querySelector(".entries"));
    });
}

//update tags object
//first array of tags will be counted, 2nd will be un-counted
function countTag(tags,oldTags)
{
    for (var x=0,l=tags.length;x<l;x++)
    {
        if (!_tags[tags[x]])
        {
            _tags[tags[x]]=1;
        }

        else
        {
            _tags[tags[x]]++;
        }
    }

    if (!oldTags)
    {
        return;
    }

    for (var x=0,l=oldTags.length;x<l;x++)
    {
        _tags[oldTags[x]]--;
    }
}