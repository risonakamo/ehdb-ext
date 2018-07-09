//EntryBoxHandler(object data)
//give it the whole database
class EntryBoxHandler extends React.Component
{
    constructor(props)
    {
        super(props);
        this.tagsReady=this.tagsReady.bind(this);
        this.updateTags=this.updateTags.bind(this);
        this.shuffleEntries=this.shuffleEntries.bind(this);

        this.state={
            //tagsReady:0
            //shuffleActive:0
            tags:{},
            data:this.props.data
        };
    }

    tagsReady()
    {
        if (!this.state.tagsReady)
        {
            this.setState({tagsReady:1});
        }
    }

    componentDidMount()
    {
        this.tagsReady();
    }

    //update tags object
    //first array of tags will be counted, 2nd will be un-counted
    updateTags(tags,oldTags)
    {
        var currentTag;
        var stateTags=this.state.tags;

        for (var x=0,l=tags.length;x<l;x++)
        {
            currentTag=tags[x];
            if (!stateTags[currentTag])
            {
                stateTags[currentTag]=1;
            }

            else
            {
                stateTags[currentTag]++;
            }
        }

        if (!oldTags)
        {
            return;
        }

        for (var x=0,l=oldTags.length;x<l;x++)
        {
            stateTags[oldTags[x]]--;
        }

        console.log(stateTags);
        this.setState({tags:stateTags});
    }

    shuffleEntries()
    {
        this.setState({shuffleActive:1});
    }

    render()
    {
        return [
            (()=>{
                var res=[];

                for (var x in this.state.data)
                {
                    res.push(React.createElement(
                        EntryBox,
                        {data:this.state.data[x],id:x,key:x,updateTags:this.updateTags}
                    ));

                    if (!this.state.tagsReady)
                    {
                        this.updateTags(this.state.data[x].tags);
                    }
                }

                if (this.state.shuffleActive)
                {
                    randomiseArray(res);
                }

                console.log("hey");
                return res;
            })(),

            (()=>{
                if (this.state.tagsReady)
                {
                    return ReactDOM.createPortal(React.createElement(
                        TagMenu,
                        {tags:this.state.tags,shuffleEntries:this.shuffleEntries}
                    ),document.querySelector(".menu-group"));
                }

                return null;
            })()
        ];
    }
}

//EntryBox(object data,int id,function updateTags)
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
            //dead:0 doesnt need to exist
        };

        if (this.props.data.fit=="WIDE")
        {
            this.state.wide="wide";
        }

        this.spawnedEditBox=0;
    }

    //perform data update given data object
    //and also cleans up the data a bit before entry
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

            if (data.tags.length==1 && data.tags[0]=="")
            {
                data.tags=[];
            }

            this.props.updateTags(data.tags,_hdb[this.props.id].tags);

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
        this.props.updateTags([],_hdb[this.props.id].tags);
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