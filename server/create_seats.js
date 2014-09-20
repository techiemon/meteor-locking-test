
Meteor.methods({
	resetSeats: function () {
		console.log('on server, resetting seats.');
		resetSeatCollection();
		var target = new Date();
		target.setTime(target.getTime() + 1000 * 10);
		return target;
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
			{},
			{$set: {color:'#fffff', username:null, lock: false}},
			{multi: true}
		);
	}
};


Meteor.startup(function() {
	Seats.remove({});
	if (Seats.find().count() === 0) {
		for ($x = 1; $x <= 2000; $x++) {
			var result = Seats.insert({color:'#fff', username:null, lock: false});
		}
		return result;
	}
});

