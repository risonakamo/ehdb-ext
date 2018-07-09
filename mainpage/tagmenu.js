//TagMenu(object tags)
//give it the tags object with all the tags
class TagMenu extends React.Component
{
    render()
    {
        return (()=>{
            var res=[];

            for (var x in this.props.tags)
            {
                res.push(React.createElement(TagMenuTag,{tagname:x,amount:this.props.tags[x],key:x}));
            }

            return res;
        })();
    }
}

//TagMenuTag(string tagname,int amount)
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
        }

        else
        {
            this.setState({selected:null});
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