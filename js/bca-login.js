/*!
 * bca-login.js v1.1, 11-15-2016
 * By Scott Shefler, http://www.bcacademe.com
 * 1.1 Changelog: updated some commenting to be more clear, re-arranged js ordering for better grouping clarity,
 	 added overriding and redirecting current page redirect to account page detect if on http or https protocol
 */

var ajax_login = function () {

	// Login form
	var $login_form = $(".js-login-form"),
		$login_error_message = $login_form.find(".js-login-alert");

	// Disable button
	$login_form.find('button[type="submit"]').attr("disabled", "disabled");

	// Append loading animation
	$("body").append('<div class="spinner"></div');

	// Set loading animation variable
	var $spinner = $(".spinner");

	// Remove previous error message
	$login_error_message.removeClass("alert-danger animate-flicker").html("");

	// Get domain data and account url
	var $domain_data = $(".js-domain-data"),
		domain_secure = $domain_data.attr("data-secure-domain"),
		domain_non_secure = $domain_data.attr("data-non-secure-domain"),
		account_url = $domain_data.attr("data-account-url");

	// Ajax post
	$.ajax({
		type: "POST",
		url: "/ZoneProcess.aspx?ZoneID=-1",
		data: $login_form.serialize()
	}).done(function (response) {
		// Make sure secure zone access denied page has suppressed template and "Secure zone access denied" text
		if (response.indexOf("Secure Zone Access Denied") !== -1) {
			$login_form.find('button[type="submit"]').removeAttr("disabled"); // Remove disabled attribute
			$login_form.find('[name="Password"]').val(""); // Clear Password Value
			$login_error_message.addClass("alert-danger animate-flicker").html('<p>Incorrect email address and/or password</p>'); // Alert
			$spinner.remove(); // Remove loading indicator
		} else {
			// Get login data to login over both secure and non secure urls
			$.get("/_ajax/zone-login", function (login_data) {
				var $login_data = $(login_data).filter(".js-login-data"),
					vid = $login_data.attr("data-vid"),
					vsv = $login_data.attr("data-vsv"),
					eid = vid;
				// Add BC secure domain for zone login relay
				var redirectDomain = "https://" + domain_secure;
				// If on secure domain switch to non secure domain for zone login relay
				if (window.location.hostname === domain_secure) {
					redirectDomain = "http://" + domain_non_secure; // make sure domain data is on every page
				}
				// Array of URLs to override login to current page and redirect to my account
				var redirectOverride = ["/", "/tutorials/ajax-login", "/logoutprocess.aspx", "/_System/SystemPages/PasswordReset", "/_System/SystemPages/PasswordResetSuccess"];
				// Current page user is on
				var currentUrl = window.location.pathname;
				// Standard redirect URL to current page
				var redirectUrl = encodeURIComponent(window.location.href);
				// If current page is in string array of overrides redirect to account area										
				if ($.inArray(currentUrl, redirectOverride) !== -1) {
					var redirectProtocol = "http://";
					if (window.location.hostname === domain_secure) {
						redirectProtocol = "https://";
					}
					redirectUrl = redirectProtocol + window.location.hostname + account_url; // Replace with url to account landing page
				}
				// Redirect
				window.location = redirectDomain + "/ZoneLoginRelay.aspx?&VID=" + vid + "&VSV=" + vsv + "&URL=" + redirectUrl + "&KeepLoggedIn=True&EID=" + eid;
			});
		}
	}).fail(function () {
		$login_form.find('button[type="submit"]').removeAttr("disabled");
		$spinner.remove();
		alert("An error occured. Please try again or contact us for assistance");
	});

};

// For Magnific Popup Login Form Usage Only
$(function () {
	$('.js-login-popup').magnificPopup({
		type: 'ajax',
		preloader: false,
		callbacks: {
			parseAjax: function (mfpResponse) {
				mfpResponse.data = $(mfpResponse.data).filter('.popup-login-form'); // Ajax Container Element
			}
		}
	});
});
