window.onload=main;

var _hdb;

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