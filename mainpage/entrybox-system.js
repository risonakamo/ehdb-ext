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
        this.deleteSelf=this.deleteSelf.bind(this);

        this.state={
            wide:"",
            data:this.props.data,
            editMode:""
            //dead:0
        };

        if (this.props.data.fit=="WIDE")
        {
            this.state.wide="wide";
        }

        this.spawnedEditBox=0;
    }

    //perform data update given data object
    updateData(data)
    {
        if (data)
        {
            data={...data};
            var fit;

            if (data.fit=="TALL")
            {
                fit="";
            }

            else
            {
                fit="wide";
            }

            this.setState({data,wide:fit});

            _hdb[this.props.id]=data;
            chrome.storage.local.set({hdb:_hdb});
        }

        this.setState({editMode:""});
    }

    //show edit pane
    enterEditMode()
    {
        this.setState({editMode:"edit-mode"});
        this.spawnedEditBox=1;
    }

    //delete self element and entry in hdb
    deleteSelf()
    {
        this.setState({dead:1});
        delete _hdb[this.props.id];
        chrome.storage.local.set({hdb:_hdb});
    }

    render()
    {
        if (this.state.dead)
        {
            return null;
        }

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
                                    if (x=="")
                                    {
                                        return;
                                    }

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
                                    doDelete:this.deleteSelf
                                }
                            );
                        }
                    })()
                )
            )
        );
    }
}