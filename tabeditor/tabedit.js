window.onload=main;

function main()
{
    chrome.storage.local.get("currentTabs",(data)=>{
        data=data.currentTabs;

        if (!data)
        {
            data=[];
        }

        console.log(data);

        ReactDOM.render(React.createElement(EntryHandler,{data:data}),document.querySelector(".entries"));
    });

}

function viewstorage()
{
    chrome.storage.local.get(null,(d)=>{
        console.log(d);
    });
}

//EntryHandler(object data)
//give it all the data as an object
class EntryHandler extends React.Component
{
    constructor(props)
    {
        super(props);
        this.madeEntry=this.madeEntry.bind(this);
        this.getOutput=this.getOutput.bind(this);
        this.saveCurrentEntries=this.saveCurrentEntries.bind(this);
        this.pushtoHdb=this.pushtoHdb.bind(this);

        this.entries=[];
        this.element=React.createRef();
    }

    componentDidMount()
    {
        this.element.current.getOutput=this.getOutput;
    }

    //entry element callback
    madeEntry(ref)
    {
        if (this.entries.length>0)
        {
            this.entries[this.entries.length-1].setNextEntry(ref);
        }

        this.entries.push(ref);
    }

    //returns the current output data
    getOutput()
    {
        var res=[];
        for (var x=0;x<this.entries.length;x++)
        {
            // console.log(this.entries[x]);
            res.push(this.entries[x].genOutput());
        }

        return res;
    }

    //saves current edit progress to storage
    saveCurrentEntries()
    {
        chrome.storage.local.set({currentTabs:this.getOutput()});
    }

    //add current editted entries to the hdb
    pushtoHdb()
    {
        var output=this.getOutput();

        chrome.storage.local.get(["lastid","hdb"],(d)=>{
            if (!d.lastid)
            {
                d.lastid=0;
            }

            if (!d.hdb)
            {
                d.hdb={};
            }

            var res={};
            for (var x=0;x<output.length;x++)
            {
                d.lastid++;
                d.hdb[d.lastid]=output[x];
            }

            chrome.storage.local.set(d);
        });
    }

    render()
    {
        return React.createElement(
            "div",
            {ref:this.element},

            this.props.data.map((x,i)=>{
                return React.createElement(Entry,{data:x,key:i+1,index:i+1,ref:this.madeEntry});
            }),

            ReactDOM.createPortal(
                [
                    React.createElement(
                        "div",
                        {
                            className:"button",
                            onClick:this.saveCurrentEntries,
                            key:1
                        },
                        "save tabs"
                    ),

                    React.createElement(
                        "div",
                        {
                            className:"button",
                            onClick:this.pushtoHdb,
                            key:2
                        },
                        "save to database"
                    )
                ],
                document.querySelector(".controls")
            )

        );
    }
}

//Entry(object data,int key,int index,element nextEntry)
//give it a single data object and ints key and index, which are just
//the number that goes on the left
class Entry extends React.Component
{
    constructor(props)
    {
        super(props);
        this.genOutput=this.genOutput.bind(this);
        this.focusTextBox=this.focusTextBox.bind(this);
        this.focusNextTextBox=this.focusNextTextBox.bind(this);
        this.textPasteOverride=this.textPasteOverride.bind(this);
        this.arrayPaste=this.arrayPaste.bind(this);
        this.startArrayPaste=this.startArrayPaste.bind(this);

        // this.entryFields=Array(3).fill(React.createRef());
        this.entryFields=[React.createRef(),React.createRef(),React.createRef()];
    }

    //set the next entry of this entry
    setNextEntry(entry)
    {
        this.nextEntry=entry;
    }

    //return output data of this entry
    genOutput()
    {
        var data=this.props.data;
        data.title=this.entryFields[0].current.innerText;
        data.imglink=this.entryFields[1].current.innerText;
        data.tags=this.entryFields[2].current.innerText;

        return data;
    }

    //focus one of the 3 input boxes, given the index
    focusTextBox(boxnum)
    {
        this.entryFields[boxnum].current.focus();
    }

    //given an array of strings, paste the first one and pass on the rest,
    //only works for image link field right now
    arrayPaste(pdata)
    {
        if (!pdata.length)
        {
            return;
        }

        this.entryFields[1].current.innerText=pdata.shift();

        if (this.nextEntry)
        {
            this.nextEntry.arrayPaste(pdata);
        }
    }

    //focus one of the 3 input boxes, of the next entry, if there is one
    focusNextTextBox(e,boxnum)
    {
        if (e.key=="Enter")
        {
            e.preventDefault();
            if (this.nextEntry)
            {
                this.nextEntry.focusTextBox(boxnum);
            }
        }
    }

    //override paste event to plain paste
    textPasteOverride(e)
    {
        e.preventDefault();
        document.execCommand("insertHTML",false,e.clipboardData.getData("text/plain"));
    }

    //paste event override for image link box
    startArrayPaste(e)
    {
        e.preventDefault();
        this.arrayPaste(e.clipboardData.getData("text/plain").split("\n"));
    }

    render()
    {
        return React.createElement(
            "div",
            {
                className:`entry ${this.props.data.type}`
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
                    {
                        className:"title",
                        contentEditable:"",
                        ref:this.entryFields[0],
                        onKeyDown:(e)=>{
                            this.focusNextTextBox(e,0);
                        },
                        onPaste:this.textPasteOverride
                    },
                    this.props.data.title
                ),

                React.createElement(
                    "dd",
                    {
                        className:"img-link",
                        contentEditable:"",
                        ref:this.entryFields[1],
                        onKeyDown:(e)=>{
                            this.focusNextTextBox(e,1);
                        },
                        onPaste:this.startArrayPaste
                    },
                    this.props.data.imglink
                ),

                React.createElement(
                    "dd",
                    {
                        className:"tags",
                        contentEditable:"",
                        ref:this.entryFields[2],
                        onKeyDown:(e)=>{
                            this.focusNextTextBox(e,2);
                        },
                        onPaste:this.textPasteOverride
                    },
                    this.props.data.tags
                )
            )
        );
    }
}