/*!
 * bca-pw-reset.js v1.0, 11-15-2016
 * By Scott Shefler, http://www.bcacademe.com
 */

$(function () {

	// Content Slide
	$(document).on("click", ".slide-toggle", function (e) {
		e.preventDefault();
		var $this = $(this);
		$this.toggleClass("active");
		$this.parents(".slide-toggle-container").find(".slide-content").slideToggle();
	});

	// Password Reset
	$(document).on("submit", ".js-password-reset", function (e) {
		e.preventDefault();
		var $password_reset = $(this),
			$password_reset_error_message = $password_reset.find(".js-reset-alert");
		// Remove Previous Alert
		$password_reset_error_message.removeClass("alert-danger animate-flicker").html("");
		// Disable Button
		$password_reset.find('button[type="submit"]').attr("disabled", "disabled");
		// Append Loading Animation
		$("body").append('<div class="spinner"></div');
		// Set Loading Animation Variable
		var $spinner = $(".spinner");
		// Get Username/Email Address Value
		// Password Data
		var password_reset_data = {
			Username: $password_reset.find('input[name="Username"]').val()
		};
		// Check to see if Registered User	
		$.ajax({
			url: "/_ajax/member-lookup?username=" + password_reset_data.Username,
		}).done(function (member_lookup_response) {
			if ($(member_lookup_response).filter(".js-user-found").length) {
				$.post("/LostPasswordProcess.aspx", password_reset_data, function () {
					// Alert Successful Password Reset Email Sent
					$password_reset_error_message.addClass("alert-success animate-flicker").html('<p>Please check your email with instructions on resetting your password.</p>');
				});
			} else {
				// Remove Disabled Attribute
				$password_reset.find('button[type="submit"]').removeAttr("disabled");
				// Alert	Not Registered User
				$password_reset_error_message.addClass("alert-danger animate-flicker").html('<p>Sorry, but you are not a registered user or your access has expired. Please sign up or contact us for assistance.</p>');
			}
		}).fail(function () {
			// Remove Disabled Attribute
			$password_reset.find('button[type="submit"]').removeAttr("disabled");
			// Alert	Not Registered User
			$password_reset_error_message.addClass("alert-danger animate-flicker").html('<p>An error occured. Please try again or contact us for assistance.</p>');
		});
		// Remove Loading Indicator
		$spinner.remove();
	});

});
