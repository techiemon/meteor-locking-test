function randomIntFromInterval(min,max)
{
	return Math.floor(Math.random()*(max-min+1)+min);
}

Meteor.methods({
	resetSeats: function () {
		console.log('on server, resetting seats.');
		resetSeatCollection();
		var target = new Date();
		target.setTime(target.getTime() + 1000 * 10);
		return target;
	},
	randomSelection: function(user, venue_id) {
		var seatsCursor = Seats.find({lock: false, venue: venue_id});
		var seats = seatsCursor.fetch();
// console.log(seats);
		var qty = randomIntFromInterval(1,10);

		var max = (seats.length > qty) ? (seats.length - qty) : 1 ; // minus 1 , minus 1 seat so 2 can be allocated.
		var position = randomIntFromInterval(0, max);

		var multi_seats = [];

		for (q = 0; q < qty; q++) {
			if (typeof seats[position + q] !== 'undefined') {
				seats[position + q].color = '#' + user.color;
				seats[position + q].username = user.username;
				multi_seats.push(seats[position + q]);
			}
		}
		// console.log(multi_seats);
		// this.buySeat(multi_seats);

		Meteor.call('buySeat', multi_seats, function(err,res) {
			// return {err, res};
		});

		if (Seats.find({lock: false, venue: venue_id}).count()) {
			Meteor.call('randomSelection', user, venue_id, function(err,res) {
				// return {err, res};
			});
		};
	},
	buySeat: function (seats) {

		var ids = [];

		for (i=0; i<seats.length; i++ ) {
			if(seats[i]._id===undefined) {
				throw new Meteor.Error(404, "Undefined seat ID");
			}
			ids.push(seats[i]._id);
		};

		// console.log(ids);
		var tcount = Seats.find(
			{
				_id: {$in: ids},
				lock: false
			}
		).count();
// console.log(seats);
		if (tcount == ids.length && seats[0] !== 'undefined') {
			var res = Seats.update(
				{
					_id: {$in: ids},
					lock: false
				},
				{
					$set: {
						lock: true,
						color: seats[0].color,
						username: seats[0].username
					}
				},
				{
					multi: true
				}
			);
			// console.log(res);
			return res;
		}

		 // console.log('skip');
		return 0;

	} // end buySeat
});

resetSeatCollection = function() {
	if (Seats.find().count() > 0) {
		Seats.update(
			{lock: true, venue: 1},
			{$set: {color:'#fffff', username:null, lock: false}},
			{multi: true}
		);
	}
};


Meteor.startup(function() {
	Seats.remove({});
	if (Seats.find().count() === 0) {
		var ns = [];
		for ($x = 1; $x <= 2000; $x++) {
			var result = Seats.insert({color:'#fff', username:null, lock: false, venue: 1});
		}
		// for ($x = 1; $x <= 1000000; $x++) {
		// 	var result = Seats.insert({color:'#fff', username:null, lock: false, venue: 2});
		// }

		return result;
	}
		Seats._ensureIndex({venue: 1, lock: 1});
		console.log(Seats.find().count());	
});

Meteor.publish("Seats", function (venue_id) {
	console.log('venue:' + venue_id);
  	return Seats.find({venue: venue_id}); // everything
});