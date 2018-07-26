var game = {

	answer_time : (24 * 1000),
	timer: null,
	time_passed : 0,
	correct_answers: 0,
	wrong_answers: 0,
	current_question: 0,
	congrats_screen_duration: (3 * 1000),
	ended: false,
	started: false,
	"questions" : {
		"Q1":{
			"answers":[
				"Justinian I's Roman Law",
				"Code of Ur-Nammu",
				"Code of Hammurabi",
				"Ancient Greek law"
			],
			"correct_answer":2,
			"title":"The oldest known law code",
			"image":"bg1.jpg"
		},
		"Q2":{
			"answers":[
				"Germany",
				"Inca settlement in South America",
				"Bulgaria",
				"France"
			],
			"correct_answer":3,
			"title":"The oldest processed gold was found in",
			"image":"bg2.jpg"
		},
		"Q3":{
			"answers":[
				"5000 BC",
				"100 AC",
				"1000 BC",
				"Around 3400–3100 BC"
			],
			"correct_answer":4,
			"title":"When was the oldest text ever found written?",
			"image":"bg3.jpg"
		},
		"Q4":{
			"answers":[
				"40,000 BC",
				"2,000 BC",
				"100 AC",
				"7,000 BC"
			],
			"correct_answer":1,
			"title":"The first art ever made dates back to?",
			"image":"bg4.jpg"
		}
	},
	
	start: function() {
		if(this.started == false){
			$(".question:eq("+this.current_question+")").show();
			$("#start_game").hide();
			$(".timer").html((this.answer_time / 1000)+'sec');
			$(".stop_watch").show();
			game.timer = setInterval(function(){
				if(game.time_passed >= (game.answer_time / 1000)){
					game.fail();
					console.log(game.timer);
				}else{
					game.time_passed += 1;
					$(".timer").html(((game.answer_time / 1000) - game.time_passed)+'sec');
				}
			}, 1000);
			this.started = true;			
		}
		console.log(game.questions['Q1'].image);
		$("body").css("background","url('assets/images/"+game.questions['Q1'].image+"')");
	},
	fail: function(ans) {
		clearInterval(game.timer);
		game_timer = null;
		game.time_passed = 0;
		$(".failed_answer .answer").html('Correct answer: '+ans);
		$(".failed_answer").fadeIn();
		this.current_question += 1;

		if(game.current_question <= (Object.keys(game.questions).length - 1)){
			setTimeout(function(){
				game.next();
			}, this.congrats_screen_duration);
		}else{
			setTimeout(function(){
				game.end();
			}, this.congrats_screen_duration);
		}
	},
	correct: function(){
		clearInterval(game.timer);
		game_timer = null;
		game.correct_answers += 1;
		game.time_passed = 0;
		$(".correct_answer").fadeIn();
		this.current_question += 1;
		if(game.current_question <= (Object.keys(game.questions).length - 1)){
			setTimeout(function(){
				game.next();
			}, this.congrats_screen_duration);
		}else{
			setTimeout(function(){
				game.end();
			}, this.congrats_screen_duration);
		}
	},
	next: function(){
		$(".question").hide();
		$(".question:eq("+game.current_question+")").fadeIn();
		$(".correct_answer, .failed_answer").fadeOut();
		game.timer = setInterval(function(){
			if(game.time_passed >= (game.answer_time / 1000)){
				game.fail();
			}else{
				game.time_passed += 1;
				$(".timer").html(((game.answer_time / 1000) - game.time_passed)+'sec');
			}
		}, 1000);
		console.log(game.questions['Q1'].image);
		$("body").css("background","url('assets/images/"+game.questions['Q'+(game.current_question + 1)].image+"')");
		$(".timer").html((this.answer_time / 1000)+'sec');

	},
	end: function(){
		this.ended = true;
		$(".stop_watch").html('You have <span class = "timer">no seconds</span> left');
		$(".correct_answer, .failed_answer").fadeOut();
		$(".end_screen").html('\
			<h3>Correct Answers: '+game.correct_answers+'</h3>\
			<h3>Wrong Answers: '+game.wrong_answers+'</h3>\
			<h3>Unanswered Answers: '+ (Object.keys(game.questions).length - (game.correct_answers + game.wrong_answers))+'</h3>\
			<button id = "restart_game">Restart</button>\
			').fadeIn();
	},
	restart: function(){
		$(".question").hide();
		$(".question, .correct_answer, .failed_answer, .stop_watch, .end_screen").hide();
		this.time_passed  = 0;
		this.correct_answers = 0;
		this.wrong_answers = 0;
		this.current_question = 0;
		this.ended = false;
		this.started = false;
		this.start();
	}
}

answer_time = 24 * 1000;
$(document).ready(function(){
	for(let i = 1; i < Object.keys(game.questions).length + 1; i++){
		$(".questions").append('\
		<div class = "question">\
			<h3>'+game.questions["Q"+i].title+'</h3>\
			<ul data-id = "Q'+ i +'">\
				<li class = "answer">'+game.questions["Q"+i].answers[0]+'</li>\
				<li class = "answer">'+game.questions["Q"+i].answers[1]+'</li>\
				<li class = "answer">'+game.questions["Q"+i].answers[2]+'</li>\
				<li class = "answer">'+game.questions["Q"+i].answers[3]+'</li>\
			</ul>\
		</div>\
		');
	}


	$(document).on('click', '.answer', function(q){
		if(game.ended == false){
			let id = $(q.currentTarget).parent().attr("data-id");
			if(game.questions[id].correct_answer == $(this).index()+1){
				game.correct();
			}else{
				game.wrong_answers += 1;
				game.fail(game.questions[id].answers[game.questions[id].correct_answer - 1]);
			}			
		}
	});

	$(document).on('click', '#restart_game', function(q){
		game.restart();
	});

	$("#start_game").click(function(){
		game.start();
	});
});