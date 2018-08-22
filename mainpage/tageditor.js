//TagEditor(object tags)
//tags: tags state object also given to tag menu
class TagEditor extends React.Component {
  render() {
    return React.createElement(
      "div",
      { className: "tag-edit" },
      React.createElement(
        "div",
        { className: "tag-edit-title" },
        React.createElement(
          "span",
          { className: "title" },
          "TAGS"
        ),
        React.createElement(
          "span",
          { className: "close-button" },
          React.createElement("img", { src: "../icons/naw.png" })
        )
      ),
      React.createElement(
        "div",
        { className: "edit-section-holder" },
        (() => {
          var reses = [[], []];
          var currentRes = 0;

          for (var x in this.props.tags) {
            reses[currentRes].push(React.createElement(
              "div",
              { className: "tag", key: x },
              React.createElement(
                "div",
                { className: "tag-content" },
                React.createElement(
                  "span",
                  { className: "tag-name" },
                  x
                ),
                React.createElement("span", { className: "descriptor", contentEditable: true })
              ),
              React.createElement("div", { className: "tag-border" })
            ));

            currentRes = currentRes ? 0 : 1;
          }

          return [React.createElement(
            "div",
            { className: "edit-section", key: 0 },
            reses[0]
          ), React.createElement(
            "div",
            { className: "edit-section", key: 1 },
            reses[1]
          )];
        })()
      )
    );
  }
}