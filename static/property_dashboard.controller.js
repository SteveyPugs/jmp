app.controller("PropertyDashController", function($scope, $http) {
	$scope.date = new Date();
	$http.get("/graph/units").then(function(response){
		new Chart($("#UnitChart")[0].getContext("2d"), {
			type: "doughnut",
			data: {
				labels: ["Filled", "Vacant"],
				datasets: [{
					data: [response.data.Filled, response.data.Vacant],
					backgroundColor: ["#ff7675", "#00b894"],
					hoverBackgroundColor: ["#fab1a0", "#55efc4"],
					borderWidth: 0
				}]
			},
			options: {
				cutoutPercentage: 0
			}
		});
	}, function(err){
		console.log(err);
	});
	$http.get("/graph/grievances").then(function(response){
		new Chart($("#ComplaintChart")[0].getContext("2d"), {
			type: "doughnut",
			data: {
				labels: ["Open", "Closed"],
				datasets: [{
					data: [response.data.Open, response.data.Closed],
					backgroundColor: ["#ff7675", "#00b894"],
					hoverBackgroundColor: ["#fab1a0", "#55efc4"],
					borderWidth: 0
				}]
			},
			options: {
				cutoutPercentage: 0
			}
		});
	}, function(err){
		console.log(err);
	});
	$http.get("/graph/payments").then(function(response){
		new Chart($("#PaymentsChart")[0].getContext("2d"), {
			type: "doughnut",
			data: {
				labels: ["Paid", "Unpaid"],
				datasets: [{
					data: [response.data.Paid, response.data.Unpaid],
					backgroundColor: ["#ff7675", "#00b894"],
					hoverBackgroundColor: ["#fab1a0", "#55efc4"],
					borderWidth: 0
				}]
			},
			options: {
				cutoutPercentage: 0
			}
		});
	}, function(err){
		console.log(err);
	});
});