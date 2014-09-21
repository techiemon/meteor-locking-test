Seats = new Meteor.Collection("seats");



chatStream = new Meteor.Stream('chat');
if(Meteor.isClient) {
  sendChat = function(message) {
	chatStream.emit('message', message);
	console.log('me: ' + message);
  };
}

