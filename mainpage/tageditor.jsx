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