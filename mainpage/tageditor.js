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
      enabled: false,
      tagData: {} //contains description data from localstorage
    };

    //array of all edit tag elements
    this.editTagElements = [];
    //this.firstMount;* if first mount has happened

    document.querySelector(".tag-title").addEventListener("click", this.toggleOpenEditor);
  }

  componentDidMount() {
    if (this.firstMount) {
      return;
    }

    //should only grab the descriptions once. after that the tagData state
    //variable should always be up to date unless there are 2 windows
    chrome.storage.local.get("tagDescriptions", data => {
      data = data.tagDescriptions;

      if (!data) {
        data = {};
      }

      this.setState({ tagData: data });
    });

    this.firstMount = 1;
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
    var currentTag;
    for (var x = 0, l = this.editTagElements.length; x < l; x++) {
      currentTag = this.editTagElements[x].returnTagData();

      if (currentTag[1].length > 0) {
        this.state.tagData[currentTag[0]] = currentTag[1];
      }
    }

    chrome.storage.local.set({ tagDescriptions: this.state.tagData });
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
            reses[currentRes].push(React.createElement(EditTag, { tagName: x, description: this.state.tagData[x],
              toggleOpenEditor: this.toggleOpenEditor, ref: this.tagEditLoaded, key: x }));

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

//EditTag(string tagName,string description,function toggleOpenEditor)
//tagName: the name of the tag
//description: description to initialise the tag edit with
//toggleOpenEditor: function from parent
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
            suppressContentEditableWarning: true,
            onKeyDown: e => {
              if (e.key == "Escape") {
                this.props.toggleOpenEditor();
              }
            }
          },
          this.props.description
        )
      ),
      React.createElement("div", { className: "tag-border" })
    );
  }
}