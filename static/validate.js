(function(){
	"use strict";
	window.addEventListener("load", function() {
		// Fetch all the forms we want to apply custom Bootstrap validation styles to
		var forms = document.getElementsByClassName("needs-validation");
		// Loop over them and prevent submission
		var validation = Array.prototype.filter.call(forms, function(form) {
			form.addEventListener("submit", function(event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add("was-validated");
		 	}, false);
		});
	}, false);
})();

var substringMatcher = function(strs) {
	return function findMatches(q, cb) {
		var matches, substringRegex;
		matches = [];
		substrRegex = new RegExp(q, "i");
		$.each(strs, function(i, str) {
			if (substrRegex.test(str)) {
				matches.push(str);
			}
		});
		cb(matches);
	};
};
$(".typeahead").typeahead({
	hint: true,
	highlight: true,
	minLength: 0
},{
	name: "states",
	source: substringMatcher(["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"])
});