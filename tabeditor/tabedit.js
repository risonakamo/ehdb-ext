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

        _bob=React.createElement(EntryHandler,{data:data});

        ReactDOM.render(_bob,document.querySelector(".entries"));
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

        this.entries=[];
        this.element=React.createRef();
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

    //produce the output
    getOutput()
    {
        for (var x=0;x<this.entries.length;x++)
        {
            console.log(this.entries[x]);
            // console.log(this.entries[x].genOutput());
        }
    }

    componentDidMount()
    {
        this.element.current.getOutput=this.getOutput;
    }

    render()
    {
        return React.createElement(
            "div",
            {ref:this.element},

            this.props.data.map((x,i)=>{
                return React.createElement(Entry,{data:x,key:i+1,index:i+1,ref:this.madeEntry});
            })
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
        data.title=this.entryFields[0].current.innerHTML;
        data.imglink=this.entryFields[1].current.innerHTML;
        data.tags=this.entryFields[2].current.innerHTML;

        return data;
    }

    //focus one of the 3 input boxes, given the index
    focusTextBox(boxnum)
    {
        this.entryFields[boxnum].current.focus();
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
                        }
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
                        }
                    }
                ),

                React.createElement(
                    "dd",
                    {
                        className:"tags",
                        contentEditable:"",
                        ref:this.entryFields[2],
                        onKeyDown:(e)=>{
                            this.focusNextTextBox(e,2);
                        }
                    }
                )
            )
        );
    }
}