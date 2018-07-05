window.onload=main;

var _bob;

function main()
{
    chrome.storage.local.get("currentTabs",(data)=>{
        data=data.currentTabs;

        if (!data)
        {
            data=[];
        }

        console.log(data);

        _bob=React.createElement(EntryHandler,{data:data});

        ReactDOM.render(_bob,document.querySelector(".entries"));
    });

}

//EntryHandler(object data)
//give it all the data
class EntryHandler extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return React.createElement(
            "div",
            null,

            this.props.data.map((x,i)=>{
                return React.createElement(Entry,{data:x,key:i+1,index:i+1});
            })
        );
    }
}

//Entry(object data,int key,int index)
//give it a single data object and ints key and index, which are just
//the number that goes on the left
class Entry extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return React.createElement(
            "div",
            {
                className: `entry ${this.props.data.type}`
            },

            React.createElement(
                "dl",
                null,

                React.createElement(
                    "dd",
                    {className:"number"},
                    this.props.index
                ),

                React.createElement(
                    "dd",
                    {className:"type"},
                    this.props.data.type
                ),

                React.createElement(
                    "dd",
                    {className:"title",contentEditable:""},
                    this.props.data.title
                ),

                React.createElement(
                    "dd",
                    {className:"img-link",contentEditable:""}
                ),

                React.createElement(
                    "dd",
                    {className:"tags",contentEditable:""}
                )
            )
        );
    }
}