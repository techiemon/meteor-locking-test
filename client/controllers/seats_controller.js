angular.module("app").controller("SeatsCtrl", [
	"$scope", "$collection", function($scope, $collection) {

	$scope.qty = [];
	$scope.total = 0;
	$scope.client_color = 'fff';
	$scope.desired = 0;
	$scope.confirmed = 0;

	$scope.changeColor = function() {
		$scope.client_color = Math.floor(Math.random()*16777215).toString(16);
	};
	$scope.changeColor();

	$scope.username = 'user ' + $scope.client_color;

	$scope.mdebug = function() {
		return console.debug($scope.seats);
	};

	var total = 0;
	$scope.start = function() {
		// console.debug('BUY BUY BUY !!!!!!!!!!!!!!');
		// $scope.getTotal();

		function randomIntFromInterval(min,max)
		{
			return Math.floor(Math.random()*(max-min+1)+min);
		}

		var seats = [];
		$.each($scope.seats, function(i, seat) {
			if (! seat.lock) seats.push(seat);
		});

		var qty = randomIntFromInterval(1,10);
		
		// console.debug('qty', qty);

		var max = (seats.length > qty) ? (seats.length - qty) : 1 ; // minus 1 , minus 1 seat so 2 can be allocated.
		var position = randomIntFromInterval(0, max);

		var multi_seats = [];

		for (q = 0; q < qty; q++) {
			if (typeof seats[position + q] !== 'undefined') {
				multi_seats.push(seats[position + q]);
			}
		}

		$.each(multi_seats, function(i, seat) {
			// if (seat.lock) $scope.start();
			seat.username = $scope.username;
			seat.color = '#' + $scope.client_color;
			seat.lock = true;
		});

		buyMultipleSeats(multi_seats);

		$scope.qty.push({qty: qty});

		var done = true;
		var total = 0;
		$.each($scope.seats, function(i,s) {
			if (s.lock == false) {
				done = false;
			}
		});

		var dt = 0;
		var ct = 0;
		$.each($scope.qty, function(i, v) {
			// console.debug('qty', v.qty);
			dt = dt + parseInt(v.qty);
		});
		// console.debug('desired', dt);
		$scope.desired = dt;
		$scope.confirmed = ct;

		$scope.getTotal();
		// console.debug('done:', done);
		if (! done) {
			$scope.start();
		}
	};

	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function buyMultipleSeats(seats) {
		Meteor.call('buySeat', seats, function(err,res) {
			if (isNumber(res)) {
				$scope.confirmed = $scope.confirmed + parseInt(res);
			}
		});
	}

	$scope.ggg = function() {
		Meteor.call('randomSelection', {username: $scope.username, color: $scope.client_color}, 1, function(err, res) {
			console.debug(err, res);
		});
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

	chatStream.on('message', function(message) {
		$scope.next_purchase = message.toString();
		starttimer(message);
		// console.log('EMIT REC: ' + message);
	});

	$scope.getTotal = function() {
		var total = 0;
		$.each($scope.seats, function(i,s) {
			// console.debug('s', s);
			if (s.username == $scope.username) {
				total++;
			}
		});

		// console.debug('total', total);
		$scope.total = total;
	}

	$scope.next_purchase = 'Not Set';
	$scope.restart = function() {
		$scope.total = 0;
		$scope.confirmed = 0;
		$scope.qty = [];
		Meteor.call('resetSeats', function(err, message) {
			// console.debug(err, message);
			chatStream.emit('message', message);
			starttimer(message);
		});
	};

	var starttimer = function(message) {
		// alert('Starting at: ' + message);
		$scope.next_purchase = message.toString();

		var millisTill10 = Math.abs(new Date() - message);
		ticker = setInterval(countdown(message), 1000);

		setTimeout(function() {
			// $scope.start();
			$scope.ggg();
			clearInterval(ticker);
		}, millisTill10);
	}

	var countdown = function(target){
		cd = Math.abs(new Date() - target);
		console.debug(cd);
	};

	var wtf = Meteor.subscribe("NSeats", 1);//.bind($scope, 'seats');;
	// console.debug(wtf, NSeats);

	return $collection(Seats).bind($scope, 'seats');
	}
]);

