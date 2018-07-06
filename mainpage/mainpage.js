window.onload=main;

function main()
{
    chrome.storage.local.get("hdb",(d)=>{
        if (!d.hdb)
        {
            d.hdb={};
        }

        console.log(d.hdb);

        // ReactDOM.render(React.createElement(EntryBoxHandler,{data:d.hdb}),document.querySelector(".entries"));
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

//EditPane(object data,int id)
//give it data object of thing to edit and ID
class EditPane extends React.Component
{
    constructor(props)
    {
        super(props);

        this.props.data.tags=this.props.data.tags.toString();

        this.state={
            data:this.props.data
        };

        if (!this.state.data.fit)
        {
            this.state.data.fit="TALL";
        }
    }

    render()
    {
        return React.createElement(
            "div",
            {className:"edit-pane"},

            React.createElement(
                "div",
                {className:"edit-row"},

                React.createElement("div",{className:"label"},"title"),
                React.createElement("input",{type:"text",value:this.state.data.title})
            ),

            React.createElement(
                "div",
                {className:"edit-row"},

                React.createElement("div",{className:"label"},"image"),
                React.createElement("input",{type:"text",value:this.state.data.imglink})
            ),

            React.createElement(
                "div",
                {className:"edit-row"},

                React.createElement("div",{className:"label"},"url"),
                React.createElement("input",{type:"text",value:this.state.data.url})
            ),

            React.createElement(
                "div",
                {className:"edit-row"},

                React.createElement("div",{className:"label"},"tags"),
                React.createElement("input",{type:"text",value:this.state.data.tags})
            ),

            React.createElement(
                "div",
                {className:"edit-row type"},

                React.createElement("div",{className:"label"},"type"),
                React.createElement("input",{type:"text",value:this.state.data.type}),
                React.createElement("div",{className:"label"},"img fit"),

                React.createElement(
                    "div",
                    {className:"toggle"},
                    this.state.data.fit
                )
            ),

            React.createElement(
                "div",
                {className:"edit-row buttons"},

                React.createElement("div",{className:"button bigger"},"Save"),
                React.createElement("div",{className:"button bigger"},"Cancel"),
                React.createElement("div",{className:"button delete"},"Delete")
            )

        );
    }
}