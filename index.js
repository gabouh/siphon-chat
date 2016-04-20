'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Text,
  TextInput,
  ScrollView,
  View
} = React;

var App = React.createClass({
  getInitialState: function() {
    return {
      messages: []
    }
  },
  componentDidMount: function() {
    this.ws = new WebSocket('wss://siphon-chat.herokuapp.com');
    this.ws.onmessage = function(event) {
      if (event.data != 'ping') {
        this.setState({
          messages: [event.data].concat(this.state.messages)
        });
      }
    }.bind(this);
    this.ws.onerror = function() {
      console.log('WebSocket error: ', arguments);
    };
  },
  componentWillUnmount: function() {
    this.ws.close();
  },
  handleSubmit: function(event) {
    console.log('Sending: ' + event.nativeEvent.text);
    this.ws.send(event.nativeEvent.text);
    this.refs.textInput.setNativeProps({text: ''});
  },
  render: function() {
    return (
      <View style={{paddingTop: 20}}>
        <TextInput
          ref='textInput'
          autoCapitalize='none'
          autoCorrect={ false }
          placeholder='Enter a chat message...'
          returnKeyType='send'
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            margin: 10,
            padding: 5
          }}
          onSubmitEditing={this.handleSubmit.bind(this)}
        />
        <ScrollView style={{height: 400}}>
          {
            this.state.messages.map(m => {
              return <Text style={{margin: 10}}>{m}</Text>
            })
          }
        </ScrollView>
      </View>
    );
  }
});

AppRegistry.registerComponent('App', () => App);
