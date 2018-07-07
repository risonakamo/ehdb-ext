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
        this.updateData=this.updateData.bind(this);
        this.enterEditMode=this.enterEditMode.bind(this);

        this.state={
            wide:"",
            data:this.props.data,
            editMode:""
        };

        if (this.props.data.fit=="WIDE")
        {
            this.state.wide="wide";
        }

        this.spawnedEditBox=0;
    }

    updateData(data)
    {
        if (data)
        {
            var fit;
            if (data.fit=="TALL")
            {
                fit="";
            }

            else
            {
                fit="wide";
            }

            this.setState({data:data,wide:fit});
        }

        this.setState({editMode:""});
    }

    enterEditMode()
    {
        this.setState({editMode:"edit-mode"});
        this.spawnedEditBox=1;
    }

    render()
    {
        return React.createElement(
            "div",
            {className:`entry-box ${this.state.data.type}`},

            React.createElement(
                "a",
                {href:this.props.data.url,target:"__blank"},
                React.createElement("div",{className:"title"},this.state.data.title)
            ),

            React.createElement("div",{className:"slider-hold"},
                React.createElement("div",{className:`slider ${this.state.editMode}`},
                    React.createElement("div",{className:"bot-box"},

                        React.createElement(
                            "div",
                            {className:`img-box ${this.state.wide}`},
                            React.createElement("img",{src:this.state.data.imglink})
                        ),

                        React.createElement("div",{className:"info"},
                            React.createElement(
                                "div",
                                {className:"tags"},
                                this.state.data.tags.map((x,i)=>{
                                    return React.createElement(
                                        "a",
                                        {className:"tag",key:i},
                                        `${x.toUpperCase()}`
                                    );
                                })
                            ),

                            React.createElement("div",{className:"id-label"},`#${this.props.id}`),

                            React.createElement(
                                "div",
                                {
                                    className:"type",
                                    onClick:this.enterEditMode
                                },

                                React.createElement("div",{className:"type-inside"},this.state.data.type)
                            )
                        )
                    ),

                    (()=>{
                        if (this.state.editMode=="edit-mode" || this.spawnedEditBox)
                        {
                            return React.createElement(
                                EditPane,
                                {
                                    data:{...this.state.data},
                                    id:this.props.id,
                                    updateParent:this.updateData,
                                    enteringEdit:this.state.editMode
                                }
                            );
                        }
                    })()
                )
            )
        );
    }
}

//EditPane(object data,int id,function updateParent,string enteringEdit)
//give it data object of thing to edit and ID and the callback of the
//parent to return from edit mode, and the edit mode string to say if its
//entering edit mode
class EditPane extends React.Component
{
    constructor(props)
    {
        super(props);
        this.toggleFit=this.toggleFit.bind(this);
        this.resetEdit=this.resetEdit.bind(this);

        this.state={
            data:{...this.props.data}
        };

        if (!this.state.data.fit)
        {
            this.state.data.fit="TALL";
        }
    }

    //toggle img fit button function
    toggleFit()
    {
        if (this.state.data.fit=="TALL")
        {
            this.state.data.fit="WIDE";
        }

        else
        {
            this.state.data.fit="TALL";
        }

        this.setState({data:this.state.data});
    }

    //text field change function. give it the event and the name of the
    //data field that is changing (ie title,imglink,ect)
    fieldChange(e,field)
    {
        this.state.data[field]=e.currentTarget.value;
        this.setState({data:this.state.data});
    }

    //reset the edit to correct data hopefully (basically cancel)
    resetEdit()
    {
        var data=this.props.data;

        if (!data.fit)
        {
            data.fit="TALL";
        }

        this.setState({data});
    }

    render()
    {
        return React.createElement(
            "div",
            {className:"edit-pane"},

            [["title","title"],["image","imglink"],["url","url"],["tags","tags"]].map((x,i)=>{
                return React.createElement(
                    "div",
                    {className:"edit-row",key:i},

                    React.createElement("div",{className:"label"},x[0]),
                    React.createElement(
                        "input",
                        {
                            type:"text",
                            value:this.state.data[x[1]],
                            onChange:(e)=>{
                                this.fieldChange(e,x[1]);
                            }
                        }
                    )
                );
            }),

            React.createElement(
                "div",
                {className:"edit-row type"},

                React.createElement("div",{className:"label"},"type"),
                React.createElement(
                    "input",
                    {
                        type:"text",
                        value:this.state.data.type,
                        onChange:(e)=>{
                            this.fieldChange(e,"type");
                        }
                    }
                ),
                React.createElement("div",{className:"label"},"img fit"),

                React.createElement(
                    "div",
                    {
                        className:"toggle",
                        onClick:this.toggleFit
                    },
                    this.state.data.fit
                )
            ),

            React.createElement(
                "div",
                {className:"edit-row buttons"},

                React.createElement(
                    "div",
                    {
                        className:"button bigger",
                        onClick:()=>{
                            if (!Array.isArray(this.state.data.tags))
                            {
                                this.state.data.tags=this.state.data.tags.split(",");
                            }

                            this.props.updateParent(this.state.data);
                        }
                    },
                    "Save"
                ),

                React.createElement(
                    "div",
                    {
                        className:"button bigger",
                        onClick:()=>{
                            this.resetEdit();
                            this.props.updateParent();
                        }
                    },
                    "Cancel"
                ),

                React.createElement("div",{className:"button delete"},"Delete")
            )
        );
    }
}