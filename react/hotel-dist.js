"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PostForm = function (_React$Component) {
  _inherits(PostForm, _React$Component);

  function PostForm(props) {
    _classCallCheck(this, PostForm);

    // Type options are an object; convert to an array and map
    var _this = _possibleConstructorReturn(this, (PostForm.__proto__ || Object.getPrototypeOf(PostForm)).call(this, props));

    _this.typeOptions = Object.keys(props.messageTypes).map(function (key) {
      if (props.messageTypes.hasOwnProperty(key)) {
        return React.createElement(
          "option",
          { key: key, value: key },
          props.messageTypes[key]
        );
      }
    });

    // so we don't have to type this over and over
    _this.defaultType = _this.typeOptions[0].key;

    _this.state = {
      messageText: "",
      messageType: _this.defaultType
    };

    _this.handleTextChange = _this.handleTextChange.bind(_this);
    _this.handleTypeChange = _this.handleTypeChange.bind(_this);
    _this.postStatusUpdate = _this.postStatusUpdate.bind(_this);
    return _this;
  }

  _createClass(PostForm, [{
    key: "handleTextChange",
    value: function handleTextChange(evt) {
      this.setState({
        messageText: evt.target.value
      });
    }
  }, {
    key: "handleTypeChange",
    value: function handleTypeChange(evt) {
      this.setState({
        messageType: evt.target.value
      });
    }
  }, {
    key: "postStatusUpdate",
    value: function postStatusUpdate(evt) {
      evt.preventDefault();

      var newStatus = {
        msg: this.state.messageText,
        type: this.state.messageType,
        time: date.format(new Date(), "YYYY-MM-DD, HH:mm")
      };

      axios.post(this.props.apiUrl + "/post.php", newStatus).then(function (response) {
        if (response.data.success) {
          this.setState({
            messageText: "",
            messageType: this.defaultType
          });
        }

        newStatus.id = response.data.id;
        this.props.addStatusMessage(newStatus);
      }.bind(this));
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "form",
        { onSubmit: this.postStatusUpdate },
        React.createElement(
          "h3",
          null,
          "Post an Update"
        ),
        React.createElement(
          "div",
          { className: "field-group" },
          React.createElement(
            "label",
            { htmlFor: "txt-message" },
            "Message"
          ),
          React.createElement("textarea", {
            id: "txt-message",
            rows: "2",
            onChange: this.handleTextChange,
            value: this.state.messageText
          })
        ),
        React.createElement(
          "div",
          { className: "field-group" },
          React.createElement(
            "label",
            { htmlFor: "txt-type" },
            "Type"
          ),
          React.createElement(
            "select",
            {
              id: "txt-type",
              onChange: this.handleTypeChange,
              value: this.state.messageType },
            this.typeOptions
          )
        ),
        React.createElement(
          "div",
          { className: "field-group action" },
          React.createElement("input", { type: "submit", value: "Post Update" })
        )
      );
    }
  }]);

  return PostForm;
}(React.Component);

function StatusMessage(props) {
  var statusDate = date.parse(props.time, "YYYY-MM-DD, HH:mm"),
      dateFormat = "M/D/Y, h:mm A";

  return React.createElement(
    "div",
    { className: "status-message" },
    props.msg,
    React.createElement(
      "span",
      { className: "name" },
      "\u2014\xA0",
      props.type
    ),
    React.createElement(
      "span",
      { className: "time" },
      date.format(statusDate, dateFormat)
    )
  );
}

var StatusMessageList = function (_React$Component2) {
  _inherits(StatusMessageList, _React$Component2);

  function StatusMessageList(props) {
    _classCallCheck(this, StatusMessageList);

    return _possibleConstructorReturn(this, (StatusMessageList.__proto__ || Object.getPrototypeOf(StatusMessageList)).call(this, props));
  }

  _createClass(StatusMessageList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // this.retrieveStatusMessages();
    }
  }, {
    key: "displayStatusMessages",
    value: function displayStatusMessages() {
      return this.props.statuses.map(function (status) {
        return React.createElement(
          "li",
          { key: status.id },
          React.createElement(StatusMessage, {
            msg: status.msg,
            type: this.props.messageTypes[status.type],
            time: status.time
          })
        );
      }.bind(this));
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.isLoaded) {
        return React.createElement(
          "ul",
          { id: "status-list" },
          this.displayStatusMessages()
        );
      } else {
        return React.createElement(
          "div",
          { id: "status-list", className: "loading" },
          "Loading...",
          React.createElement(
            "div",
            { className: "spinner" },
            React.createElement("div", { className: "bounce1" }),
            React.createElement("div", { className: "bounce2" }),
            React.createElement("div", { className: "bounce3" })
          )
        );
      }
    }
  }]);

  return StatusMessageList;
}(React.Component);

var StatusMessageManager = function (_React$Component3) {
  _inherits(StatusMessageManager, _React$Component3);

  function StatusMessageManager(props) {
    _classCallCheck(this, StatusMessageManager);

    // just a property, doesn't have to be state
    var _this3 = _possibleConstructorReturn(this, (StatusMessageManager.__proto__ || Object.getPrototypeOf(StatusMessageManager)).call(this, props));

    _this3.messageTypes = {
      management: "Management",
      dining: "Dining Services",
      ops: "Operations",
      plumbing: "Plumbing",
      pool: "Pool"
    };

    _this3.apiUrl = "http://localhost/reactjs/status_api";

    _this3.state = {
      statuses: [],
      isLoaded: false
    };

    _this3.addStatusMessage = _this3.addStatusMessage.bind(_this3);
    return _this3;
  }

  _createClass(StatusMessageManager, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.retrieveStatusMessages();
    }
  }, {
    key: "retrieveStatusMessages",
    value: function retrieveStatusMessages() {
      axios.get(this.apiUrl + "/get.php?delay=5").then(function (response) {
        this.setState({
          statuses: response.data,
          isLoaded: true
        });
      }.bind(this));
    }
  }, {
    key: "addStatusMessage",
    value: function addStatusMessage(status) {
      var updatedStatuses = this.state.statuses.slice(0);

      updatedStatuses.push(status);

      this.setState({
        statuses: updatedStatuses
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "div",
          { id: "post-status" },
          React.createElement(PostForm, {
            messageTypes: this.messageTypes,
            apiUrl: this.apiUrl,
            addStatusMessage: this.addStatusMessage
          })
        ),
        React.createElement(StatusMessageList, {
          messageTypes: this.messageTypes,
          statuses: this.state.statuses,
          isLoaded: this.state.isLoaded
        })
      );
    }
  }]);

  return StatusMessageManager;
}(React.Component);

ReactDOM.render(React.createElement(StatusMessageManager, null), document.getElementById("react-statusmanager"));
//# sourceMappingURL=hotel-dist.js.map
