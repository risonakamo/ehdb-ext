window.onload=main;

function main()
{
    chrome.storage.local.get("hdb",(d)=>{
        if (!d.hdb)
        {
            d.hdb={};
        }

        console.log(d.hdb);

        ReactDOM.render(React.createElement(EntryBoxHandler,{data:d.hdb}),document.querySelector(".entries"));
    });
}

//EntryBoxHandler(object data)
//give it the whole database
class EntryBoxHandler extends React.Component
{
    render()
    {
        return (()=>{
            var res=[];

            for (var x in this.props.data)
            {
                res.push(React.createElement(
                    EntryBox,
                    {data:this.props.data[x],id:x,key:x}
                ));
            }

            return res;
        })();
    }
}

//EntryBox(object data,int id)
//give it a data entry and id seperate
class EntryBox extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state={wide:""};
    }

    render()
    {
        return React.createElement(
            "div",
            {className:`entry-box ${this.props.data.type}`},

            React.createElement(
                "a",
                {href:this.props.data.url,target:"__blank"},
                React.createElement("div",{className:"title"},this.props.data.title)
            ),

            React.createElement(
                "div",
                {className:"bot-box"},

                React.createElement(
                    "div",
                    {className:`img-box ${this.state.wide}`},
                    React.createElement("img",{src:this.props.data.imglink})
                ),

                React.createElement(
                    "div",
                    {className:"info"},

                    React.createElement(
                        "div",
                        {className:"tags"},
                        this.props.data.tags.map((x,i)=>{
                            return React.createElement(
                                "a",
                                {className:"tag",key:i},
                                `${x.toUpperCase()}`
                            );
                        })
                    ),

                    React.createElement(
                        "div",
                        {className:"type"},

                        React.createElement("div",{className:"type-inside"},this.props.data.type)
                    ),

                    React.createElement("div",{className:"id-label"},`#${this.props.id}`)
                )
            )
        );
    }
}