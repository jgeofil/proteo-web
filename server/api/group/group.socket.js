/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var GroupEvents = require('./group.events');

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('group:' + event, socket);

    GroupEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, socket) {
  return function(doc) {
    doc.populate('users', function(err, poped){
      if(err){
        console.log(err)
      }else{
        socket.emit(event, poped);
      }
    })
  };
}

function removeListener(event, listener) {
  return function() {
    GroupEvents.removeListener(event, listener);
  };
}
