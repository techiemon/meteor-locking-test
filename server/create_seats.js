
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

    return Seats.update(
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
    // return res;

  } // end buySeat
});

resetSeatCollection = function() {
  if (Seats.find().count() > 0) {
    Seats.update(
      {},
      {$set: {color:'#fffff', username:null, lock: false}},
      {multi: true}
    );
  }
};


Meteor.startup(function() {
  Seats.remove({});
  if (Seats.find().count() === 0) {
    for ($x = 1; $x <= 1000; $x++) {
        result = Seats.insert({color:'#fff', username:null, lock: false});
    }
    return result;
  }
});

