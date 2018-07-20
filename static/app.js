var app = angular.module("jmp", ["ngRoute", "ngFileUpload", "ui.bootstrap"]);
app.config(function($routeProvider, $locationProvider){
	$routeProvider.when("/", {
		templateUrl: "views/home.html"
	}).when("/register", {
		templateUrl: "views/register.html",
		controller: "registerCtrl"
	}).when("/register/complete", {
		templateUrl: "views/register_complete.html"
	}).when("/register/sorry", {
		templateUrl: "views/register_sorry.html"
	}).when("/login", {
		templateUrl: "views/login.html",
		controller: "loginCtrl"
	}).when("/forgot", {
		templateUrl: "views/forgot.html",
		controller: "forgotCtrl"
	}).when("/reset", {
		templateUrl: "views/reset.html"
	}).when("/dashboard/landlord", {
		templateUrl: "views/landlord_dash.html",
		controller: "landlordDashCtrl"
	}).when("/dashboard/landlord/graphs", {
		templateUrl: "views/landlord_graph.html",
		controller: "landlordGraphCtrl"
	}).when("/dashboard/tenant", {
		templateUrl: "views/tenant_dash.html",
		controller: "tenantDashCtrl"
	}).when("/support", {
		templateUrl: "views/support.html"
	});
	$locationProvider.html5Mode(true);
});

String.prototype.toProperCase = function(){
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};