
Meteor.methods({
  resetSeats: function () {
    console.log('on server, resetting seats.');
    resetSeatCollection();
    var target = new Date();
    target.setTime(target.getTime() + 1000 * 20);
    
    return target;
  },

  buySeat: function (seat) {
    // console.log('Seat id: ', seat._id);
    if(seat._id===undefined) {
      throw new Meteor.Error(404, "Undefined seat ID");
    }

    var res = Seats.update(
                        {
                          _id: seat._id,
                          lock: false
                        },
                        {
                          $set: {
                            lock: true,
                            color: seat.color,
                            username: seat.username
                          }
                        }
                      );

  } // end buySeat
});

resetSeatCollection = function() {
  Seats.remove({});
  var result = false;
  if (Seats.find().count() === 0) {
    for ($x = 1; $x <= 2000; $x++) {
        result = Seats.insert({color:'#fff', username:null, lock: false});
    }
    return result;
  }};


    Meteor.startup(function() {
        resetSeatCollection();
    });

