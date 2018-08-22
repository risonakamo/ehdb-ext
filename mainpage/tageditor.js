//TagEditor(object tags)
//tags: tags state object also given to tag menu
class TagEditor extends React.Component {
  constructor(props) {
    super(props);
    this.elementLoaded = this.elementLoaded.bind(this);
    this.toggleOpenEditor = this.toggleOpenEditor.bind(this);
    this.saveTagDescriptions = this.saveTagDescriptions.bind(this);
    this.tagEditLoaded = this.tagEditLoaded.bind(this);

    this.state = {
      enabled: false
    };

    //array of all edit tag elements
    this.editTagElements = [];

    document.querySelector(".tag-title").addEventListener("click", this.toggleOpenEditor);
  }

  //when main element is loaded
  elementLoaded(ref) {
    this.tagEditOuter = ref.parentElement;
  }

  //when each tag edit loades
  tagEditLoaded(ref) {
    this.editTagElements.push(ref);
  }

  //show or hide the tag editor
  toggleOpenEditor() {
    this.state.enabled = !this.state.enabled;
    this.tagEditOuter.classList.toggle("enabled");
  }

  saveTagDescriptions() {
    for (var x = 0, l = this.editTagElements.length; x < l; x++) {
      console.log(this.editTagElements[x].returnTagData());
    }
  }

  render() {
    return React.createElement(
      "div",
      { className: "tag-edit", ref: this.elementLoaded },
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
          { className: "close-button", onClick: () => {
              this.saveTagDescriptions();
              this.toggleOpenEditor();
            } },
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
            reses[currentRes].push(React.createElement(EditTag, { tagName: x, ref: this.tagEditLoaded, key: x }));

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

//EditTag(string tagName,string description)
//tagName: the name of the tag
//description: description to initialise the tag edit with
class EditTag extends React.Component {
  constructor(props) {
    super(props);
    this.returnTagData = this.returnTagData.bind(this);

    this.descriptionElement = React.createRef();
  }

  //returns array with [tagname,the description entered]
  returnTagData() {
    return [this.props.tagName, this.descriptionElement.current.innerText];
  }

  render() {
    return React.createElement(
      "div",
      { className: "tag" },
      React.createElement(
        "div",
        { className: "tag-content" },
        React.createElement(
          "span",
          { className: "tag-name" },
          this.props.tagName
        ),
        React.createElement(
          "span",
          { className: "descriptor", contentEditable: true,
            ref: this.descriptionElement,
            suppressContentEditableWarning: true
          },
          this.props.description
        )
      ),
      React.createElement("div", { className: "tag-border" })
    );
  }
}