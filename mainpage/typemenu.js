//TypeMenu(function setTypeFilter)
//setTypeFilter function from parent to set a type filter
class TypeMenu extends React.Component
{
    constructor(props)
    {
        super(props);
        this.activateSelect=this.activateSelect.bind(this);

        this.state={
            filterActive:"",
            selectedType:["","","","",""]
        };
    }

    //activate filter on button index and type string for typeFilter function
    activateSelect(index,type)
    {
        if (this.state.selectedType[index]=="selected")
        {
            this.state.selectedType[index]="";
            this.props.setTypeFilter(null);
            this.setState({selectedType:this.state.selectedType,filterActive:""});
            return;
        }

        for (var x=0;x<5;x++)
        {
            if (x==index)
            {
                this.state.selectedType[x]="selected";
            }

            else
            {
                this.state.selectedType[x]="";
            }
        }

        this.props.setTypeFilter(type);
        this.setState({selectedType:this.state.selectedType,filterActive:"filter-active"});
    }

    render()
    {
        return React.createElement("div",{className:`type-tag-hold ${this.state.filterActive}`},
            ["PX","HIT","NH","SAN","DL"].map((x,i)=>{
                return React.createElement(
                    "div",
                    {
                        className:`type-tag ${x} ${this.state.selectedType[i]}`,
                        key:i,
                        onClick:()=>{
                            this.activateSelect(i,x);
                        }
                    },

                    React.createElement("img",{src:`../icons/${x}.png`})
                );
            })
        );
    }
}