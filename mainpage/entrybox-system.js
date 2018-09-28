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
        this.checkTagFilter=this.checkTagFilter.bind(this);
        this.tagFilterSet=this.tagFilterSet.bind(this);
        this.checkTypeFilter=this.checkTypeFilter.bind(this);
        this.setTypeFilter=this.setTypeFilter.bind(this);

        this.state={
            //tagsReady:0* it exists but later
            //shuffleActive:0*
            tags:{},
            data:this.props.data,
            ids:Object.keys(this.props.data),
            tagFilter:new Set()
            // typeFilter
        };

        //this.downloadLoaded=0;*

        this.tagEditor=React.createRef(); //the tag editor component
    }

    //tags have been processed
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

            //if that tag is now empty, remove it from the tag filter
            if (!stateTags[oldTags[x]])
            {
                this.tagFilterSet(oldTags[x],0);
            }
        }

        this.setState({tags:stateTags});
    }

    //shuffle entries
    shuffleEntries()
    {
        randomiseArray(this.state.ids);
        this.setState({ids:this.state.ids});
    }

    //check if an entry should NOT render according to the tagfilter
    checkTagFilter(entryTags)
    {
        //if there are no tags in the tag filter
        if (!this.state.tagFilter.size || !entryTags)
        {
            return false;
        }

        //an entry must have every tag in the tag filter (AND operation)
        entryTags=new Set(entryTags);
        for (var x of this.state.tagFilter)
        {
            if (!entryTags.has(x))
            {
                return true;
            }
        }

        return false;
    }

    //set a tag in the tagfilter
    //action=1 to add, 0 to remove
    tagFilterSet(tag,action)
    {
        if (action)
        {
            this.state.tagFilter.add(tag);
        }

        else
        {
            this.state.tagFilter.delete(tag);
        }

        this.setState({tagFilter:this.state.tagFilter});
    }

    //check if an entry should NOT render according to type filter
    checkTypeFilter(type)
    {
        //type filter is not active
        if (!this.state.typeFilter || type==this.state.typeFilter)
        {
            return false;
        }

        return true;
    }

    //set the type filter. null to reset
    setTypeFilter(type)
    {
        this.setState({typeFilter:type});
    }

    render()
    {
        return [
            //the entries
            (()=>{
                var res=[];

                var ids=this.state.ids;
                var currentEntry;
                for (var x=0,l=ids.length;x<l;x++)
                {
                    currentEntry=this.state.data[ids[x]];

                    if (!currentEntry)
                    {
                        continue;
                    }

                    res.push(React.createElement(
                        EntryBox,
                        {
                            data:currentEntry,id:ids[x],key:ids[x],
                            updateTags:this.updateTags,
                            filtered:(this.checkTagFilter(currentEntry.tags)
                                ||this.checkTypeFilter(currentEntry.type))
                        }
                    ));

                    if (!this.state.tagsReady)
                    {
                        this.updateTags(currentEntry.tags);
                    }
                }

                return res;
            })(),

            //the backup link
            React.createElement("div",{className:"backup-link",key:"backuplink"},
                React.createElement(
                    "a",
                    {
                        href:"",
                        download:"hdb.json",
                        onClick:(e)=>{
                            if (this.dataLoaded)
                            {
                                this.dataLoaded=0;
                                return;
                            }

                            e.preventDefault();

                            e.currentTarget.href=`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({
                                db:Object.values(_hdb),
                                tagDescriptions:this.tagEditor.current.getTagData()
                            }))}`;
                            this.dataLoaded=1;

                            e.currentTarget.click();
                        }
                    },
                    "Download Database Backup"
                )
            ),

            //the tag menu
            (()=>{
                if (this.state.tagsReady)
                {
                    return ReactDOM.createPortal(React.createElement(
                        TagMenu,
                        {tags:this.state.tags,shuffleEntries:this.shuffleEntries,setFilter:this.tagFilterSet}
                    ),document.querySelector(".menu-group"));
                }

                return null;
            })(),

            //the type menu
            ReactDOM.createPortal(React.createElement(TypeMenu,
                {setTypeFilter:this.setTypeFilter}),document.querySelector(".type-menu")),

            //the tag editor
            (()=>{
                if (this.state.tagsReady)
                {
                    return ReactDOM.createPortal(React.createElement(
                        TagEditor,
                        {tags:this.state.tags,ref:this.tagEditor}
                    ),document.querySelector(".tag-edit-outer"));
                }
            })()
        ];
    }
}

//EntryBox(object data,int id,function updateTags,bool filtered)
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

        var filtered="";
        if (this.props.filtered)
        {
            var filtered="filtered";
        }

        this.state.data.tags.sort();

        return React.createElement(
            "div",
            {className:`entry-box ${this.state.data.type} ${filtered}`},

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