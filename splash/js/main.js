$(function () {

	var ww = window.innerWidth,
		wh = window.innerHeight;

	$(window).on('load resize', function () {

		ww = window.innerWidth;
		wh = window.innerHeight;

		//$('#content .wrp').css({ height: wh });

		$('.about').css({ top: -(wh + 500) });

	});


	$('.main-nav ul .li-about').click(function (e) {
		e.preventDefault();
		$('.about').addClass('show');
	});

	$('.about').find('.back').on('click', function () {
		$('.about').removeClass('show').css({ top: -(wh + 500) });
	});	


});