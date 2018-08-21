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
      React.createElement("div", { className: "edit-section" }),
      React.createElement("div", { className: "edit-section" })
    );
  }
}