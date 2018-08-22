//TagEditor(object tags)
//tags: tags state object also given to tag menu
class TagEditor extends React.Component
{
  constructor(props)
  {
    super(props);
    this.elementLoaded=this.elementLoaded.bind(this);

    this.state={
      enabled:false
    };

    //this.tagEditOuter* the outside parent element. loaded by elementLoaded()
  }

  elementLoaded(ref)
  {
    this.tagEditOuter=ref.parentElement;
  }

  render()
  {
    return (
      <div className="tag-edit" ref={this.elementLoaded}>
        <div className="tag-edit-title">
          <span className="title">TAGS</span>
          <span className="close-button" onClick={()=>{
            this.tagEditOuter.classList.remove("enabled");
            this.state.enabled=false;
          }}>
            <img src="../icons/naw.png"/>
          </span>
        </div>

        <div className="edit-section-holder">
          {(()=>{
            var reses=[[],[]];
            var currentRes=0;

            for (var x in this.props.tags)
            {
              reses[currentRes].push(
                <div className="tag" key={x}>
                  <div className="tag-content">
                    <span className="tag-name">{x}</span>
                    <span className="descriptor" contentEditable></span>
                  </div>
                  <div className="tag-border"></div>
                </div>
              );

              currentRes=currentRes?0:1;
            }

            return [
              <div className="edit-section" key={0}>{reses[0]}</div>,
              <div className="edit-section" key={1}>{reses[1]}</div>
            ];
          })()}
        </div>
      </div>
    );
  }
}