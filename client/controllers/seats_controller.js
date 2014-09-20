angular.module("app").controller("SeatsCtrl", [
	"$scope", "$collection", function($scope, $collection) {
	
	$scope.client_color = Math.floor(Math.random()*16777215).toString(16);

	$scope.username = 'user';

	$scope.mdebug = function() {
		return console.debug($scope.seats);
	};

	$scope.start = function() {
		// console.debug('BUY BUY BUY !!!!!!!!!!!!!!');

		function randomIntFromInterval(min,max)
		{
			return Math.floor(Math.random()*(max-min+1)+min);
		}
		var seats = [];
		$.each($scope.seats, function(i, seat) {
			if (! seat.lock) seats.push(seat);
		});

		var qty = randomIntFromInterval(1,8);
		var max = (seats.length > qty) ? (seats.length - qty) : 1 ; // minus 1 , minus 1 seat so 2 can be allocated.
		var position = randomIntFromInterval(0, max);

		
		var multi_seats = [];

		for (q = 0; q < qty; q++) {
			multi_seats.push(seats[position + q]);
		}

		$.each(multi_seats, function(i, seat) {
			seat.username = $scope.username;
			seat.color = '#' + $scope.client_color;
			seat.lock = true;
		});
		// console.debug(multi_seats);

		buyMultipleSeats(multi_seats);

		var done = true;
		$.each($scope.seats, function(i,s) {
			if (s.lock == false) {
				done = false;
			}
		});

		// console.debug('done:', done);
		if (! done) {
			$scope.start();
		}
		
	};

	function buyMultipleSeats(seats) {
		return Meteor.call('buySeat', seats, function(err,res) { });
	}

	$scope.buySeat = function(seat) {

		if (! seat.lock) {
			seat.username = $scope.username;
			seat.color = '#' + $scope.client_color;
			seat.lock = true;

			Meteor.call('buySeat', [seat], function(err, response) {
				console.debug(err, response);
			});
		}
	}

	// chatStream.on('message', function(message) {
	//   console.log('user ng: ' + message);
	// });
	chatStream.on('message', function(message) {

		$scope.next_purchase = message.toString();
		starttimer(message);
		console.log('EMIT REC: ' + message);
	});

	$scope.next_purchase = 'Not Set';
	$scope.restart = function() {
		Meteor.call('resetSeats', function(err, message) {
		console.debug(err, message);
		chatStream.emit('message', message);
		starttimer(message);

		});
	};

	var starttimer = function(message) {
		console.log('timer REC: ' + message);
		$scope.next_purchase = message.toString();

		var millisTill10 = Math.abs(new Date() - message);
		ticker = setInterval(countdown(message), 1000);

		setTimeout(function() {
			$scope.start();
			clearInterval(ticker);
		}, millisTill10);
	}

	// sendChat = function(message) {
	//   chatStream.emit('message', message);
	//   console.log('me: ' + message);
	// };

	var countdown = function(target){
		cd = Math.abs(new Date() - target);
		console.debug(cd);
	};


	return $collection(Seats).bind($scope, 'seats');
	}
]);

