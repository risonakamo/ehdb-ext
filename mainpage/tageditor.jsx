//TagEditor(object tags)
//tags: tags state object also given to tag menu
class TagEditor extends React.Component
{
  render()
  {
    return (
      <div className="tag-edit">
        <div className="tag-edit-title">
          <span className="title">TAGS</span>
          <span className="close-button">
            <img src="../icons/naw.png"/>
          </span>
        </div>

        <div className="edit-section-holder">
          <div className="edit-section">
            {(()=>{
              var res=[];
              for (var x in this.props.tags)
              {
                res.push(
                  <div className="tag" key={x}>
                    <div className="tag-content">
                      <span className="tag-name">{x}</span>
                      <span className="descriptor" contentEditable></span>
                    </div>
                    <div className="tag-border"></div>
                  </div>
                );
              }

              return res;
            })()}
          </div>

          <div className="edit-section">

          </div>
        </div>
      </div>
    );
  }
}