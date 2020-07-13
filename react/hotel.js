class PostForm extends React.Component {
  constructor(props) {
    super(props);

    // Type options are an object; convert to an array and map
    this.typeOptions = Object.keys(props.messageTypes).map(function(key) {
      if (props.messageTypes.hasOwnProperty(key)) {
        return (
          <option key={key} value={key}>
            {props.messageTypes[key]}
          </option>
        );
      }
    });

    // so we don't have to type this over and over
    this.defaultType = this.typeOptions[0].key;

    this.state = {
      messageText: "",
      messageType: this.defaultType
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.postStatusUpdate = this.postStatusUpdate.bind(this);
  }

  handleTextChange(evt) {
    this.setState({
      messageText: evt.target.value
    });
  }

  handleTypeChange(evt) {
    this.setState({
      messageType: evt.target.value
    });
  }

  postStatusUpdate(evt) {
    evt.preventDefault();

    var newStatus = {
      msg: this.state.messageText,
      type: this.state.messageType,
      time: date.format(new Date(), "YYYY-MM-DD, HH:mm")
    };

    axios.post(this.props.apiUrl + "/post.php", newStatus).then(
      function(response) {
        if (response.data.success) {
          this.setState({
            messageText: "",
            messageType: this.defaultType
          });
        }

        newStatus.id = response.data.id;
        this.props.addStatusMessage(newStatus);
      }.bind(this)
    );
  }

  render() {
    return (
      <form onSubmit={this.postStatusUpdate}>
        <h3>Post an Update</h3>

        <div className="field-group">
          <label htmlFor="txt-message">Message</label>
          <textarea
            id="txt-message"
            rows="2"
            onChange={this.handleTextChange}
            value={this.state.messageText}
          />
        </div>

        <div className="field-group">
          <label htmlFor="txt-type">Type</label>
          <select
            id="txt-type"
            onChange={this.handleTypeChange}
            value={this.state.messageType}>
            {this.typeOptions}
          </select>
        </div>

        <div className="field-group action">
          <input type="submit" value="Post Update" />
        </div>
      </form>
    );
  }
}

function StatusMessage(props) {
  var statusDate = date.parse(props.time, "YYYY-MM-DD, HH:mm"),
    dateFormat = "M/D/Y, h:mm A";

  return (
    <div className="status-message">
      {props.msg}
      <span className="name">— {props.type}</span>
      <span className="time">{date.format(statusDate, dateFormat)}</span>
    </div>
  );
}

class StatusMessageList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.retrieveStatusMessages();
  }

  displayStatusMessages() {
    return this.props.statuses.map(
      function(status) {
        return (
          <li key={status.id}>
            <StatusMessage
              msg={status.msg}
              type={this.props.messageTypes[status.type]}
              time={status.time}
            />
          </li>
        );
      }.bind(this)
    );
  }

  render() {
    if (this.props.isLoaded) {
      return <ul id="status-list">{this.displayStatusMessages()}</ul>;
    } else {
      return (
        <div id="status-list" className="loading">
          Loading...
          <div className="spinner">
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
          </div>
        </div>
      );
    }
  }
}

class StatusMessageManager extends React.Component {
  constructor(props) {
    super(props);

    // just a property, doesn't have to be state
    this.messageTypes = {
      management: "Management",
      dining: "Dining Services",
      ops: "Operations",
      plumbing: "Plumbing",
      pool: "Pool"
    };

    this.apiUrl = "http://localhost/reactjs/status_api";

    this.state = {
      statuses: [],
      isLoaded: false
    };

    this.addStatusMessage = this.addStatusMessage.bind(this);
  }

  componentDidMount() {
    this.retrieveStatusMessages();
  }

  retrieveStatusMessages() {
    axios.get(this.apiUrl + "/get.php?delay=5").then(
      function(response) {
        this.setState({
          statuses: response.data,
          isLoaded: true
        });
      }.bind(this)
    );
  }

  addStatusMessage(status) {
    var updatedStatuses = this.state.statuses.slice(0);

    updatedStatuses.push(status);

    this.setState({
      statuses: updatedStatuses
    });
  }

  render() {
    return (
      <React.Fragment>
        <div id="post-status">
          <PostForm
            messageTypes={this.messageTypes}
            apiUrl={this.apiUrl}
            addStatusMessage={this.addStatusMessage}
          />
        </div>
        <StatusMessageList
          messageTypes={this.messageTypes}
          statuses={this.state.statuses}
          isLoaded={this.state.isLoaded}
        />
      </React.Fragment>
    );
  }
}

ReactDOM.render(<StatusMessageManager />, document.getElementById("react-statusmanager"));
