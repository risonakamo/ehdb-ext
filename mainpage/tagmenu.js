//TagMenu(object tags)
//tags: the _tags object
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
    render()
    {
        return React.createElement(
            "li",
            null,

            React.createElement("span",null,
                React.createElement("div",{className:"amount-label"},this.props.amount),
                this.props.tagname
            )
        );
    }
}