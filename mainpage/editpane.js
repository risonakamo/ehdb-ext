/*EditPane(object data,int id,function updateParent,function doDelete)
    data: single data entry
    id: the id of the data entry
    updateParemt: function to call with data to update the parent
    doDelete: function to call to delete the parent
*/
class EditPane extends React.Component
{
    constructor(props)
    {
        super(props);
        this.toggleFit=this.toggleFit.bind(this);
        this.resetEdit=this.resetEdit.bind(this);
        this.shortcutKeyAction=this.shortcutKeyAction.bind(this);
        this.submitAction=this.submitAction.bind(this);

        this.state={
            data:{...this.props.data}
        };

        if (!this.state.data.fit)
        {
            this.state.data.fit="TALL";
        }

        this.deleteButton=React.createRef(); //the delete button
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
    //also cancel action
    resetEdit()
    {
        var data=this.props.data;

        if (!data.fit)
        {
            data.fit="TALL";
        }

        this.deleteButton.current.resetConfirm();

        this.setState({data},()=>{
            this.props.updateParent();
        });
    }

    //event handler for key combos
    shortcutKeyAction(e)
    {
        if (e.key=="Enter")
        {
            e.preventDefault();
            this.submitAction();
        }

        else if (e.key=="Escape")
        {
            e.preventDefault();
            this.resetEdit();
        }
    }

    //perform save action
    submitAction(e)
    {
        if (!Array.isArray(this.state.data.tags))
        {
            this.state.data.tags=this.state.data.tags.split(",");
        }

        this.deleteButton.current.resetConfirm();
        this.props.updateParent(this.state.data);
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
                            },
                            onKeyDown:this.shortcutKeyAction
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
                        },
                        onKeyDown:this.shortcutKeyAction
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
                        onClick:this.submitAction
                    },
                    "Save"
                ),

                React.createElement(
                    "div",
                    {
                        className:"button bigger",
                        onClick:this.resetEdit
                    },
                    "Cancel"
                ),

                React.createElement(deleteButton,{doDelete:this.props.doDelete,ref:this.deleteButton})
            )
        );
    }
}

//the delete button
//deleteButton(parent-function doDelete)
//doDelete: function from parent EditPane
class deleteButton extends React.Component
{
    constructor(props)
    {
        super(props);
        this.showConfirm=this.showConfirm.bind(this);

        this.state={
            //confirmDelete:0 //indicates if confirm delete is showing
        };
    }

    showConfirm()
    {
        this.setState({confirmDelete:1});
    }

    //public, reset the confirmation state
    resetConfirm()
    {
        this.setState({confirmDelete:0});
    }

    render()
    {
        var buttonAction;
        var buttonText;
        if (!this.state.confirmDelete)
        {
            buttonAction=this.showConfirm;
            buttonText="Delete";
        }

        else
        {
            buttonAction=this.props.doDelete;
            buttonText="Really?";
        }

        return React.createElement(
            "div",
            {
                className:"button delete",
                onClick:buttonAction
            },
            buttonText
        );
    }
}