//TagMenu(object tags,function shuffleEntries)
//TagMenu(object tags,function shuffleEntries,function setFilter)
//tags: all the tags object
//shuffleEntries: parent function that shuffles entries
//setFilter: parent function to set a tag filter
class TagMenu extends React.Component
{
    render()
    {
        return [
            React.createElement(
                "li",
                {
                    className:"shuffle",
                    onClick:this.props.shuffleEntries,
                    key:"shuffle"
                },

                React.createElement("span",null,
                    React.createElement("div",{className:"amount-label"},"⟲"),
                    "SHUFFLE"
                )
            ),

            (()=>{
                var res=[];

                var tagNames=Object.keys(this.props.tags);
                tagNames.sort();

                var currentTag;
                for (var x=0,l=tagNames.length;x<l;x++)
                {
                    currentTag=tagNames[x];
                    if (this.props.tags[currentTag])
                    {
                        res.push(React.createElement(TagMenuTag,{tagname:currentTag,amount:this.props.tags[currentTag],
                            key:currentTag,setFilter:this.props.setFilter}));
                    }
                }

                return res;
            })()
        ];
    }
}

//TagMenuTag(string tagname,int amount,function setFilter)
class TagMenuTag extends React.Component
{
    constructor(props)
    {
        super(props);
        this.toggleSelected=this.toggleSelected.bind(this);

        this.state={
            //selected:null*
        };
    }

    toggleSelected()
    {
        if (!this.state.selected)
        {
            this.setState({selected:"selected"});
            this.props.setFilter(this.props.tagname,1);
        }

        else
        {
            this.setState({selected:null});
            this.props.setFilter(this.props.tagname,0);
        }
    }

    render()
    {
        return React.createElement(
            "li",
            {
                className:this.state.selected,
                onClick:this.toggleSelected
            },

            React.createElement("span",null,
                React.createElement("div",{className:"amount-label"},this.props.amount),
                this.props.tagname
            )
        );
    }
}