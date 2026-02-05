function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	const times = tweet_array.map(t => t.time.getTime());
	const first = new Date(math.min(...times));
	const last = new Date(math.max(...times));

	const opts = { year: "numeric", month: "long", day: "numeric" };
	document.getElementById('firstDate').innerText = first.toLocaleDateString(undefined, opts);
	document.getElementById('lastDate').innerText = last.toLocaleDateString(undefined, opts);

	const completed = tweet_array.filter(t => t.source === "completed_event");
	const live = tweet_array.filter(t => t.source === "live_event");
	const achievement = tweet_array.filter(t => t.source === "achievement");
	const misc = tweet_array.filter(t => t.source === "miscellaneous");

	function setAll(className, value) {
		document.querySelectorAll("." + className).forEach(element => {
			element.innerText = value;
		});
	}

	setAll("completedEvents", completed.length);
	setAll("liveEvents", live.length);
	setAll("achievements", achievement.length);
	setAll("miscellaneous", misc.length);

	const total = tweet_array.length;

	function percent(n) {
		return math.format((n / total) * 100, { notation: "fixed", precision: 2}) + "%";
	}

	setAll("completedEventsPct", percent(completed.length));
	setAll("liveEventsPct", percent(live.length));
	setAll("achievementsPct", percent(achievement.length));
	setAll("miscellaneousPct", percent(misc.length));

	const writtenCount = completed.filter(t => t.written).length;
	setAll("written", writtenCount);

	const writtenPct = (completed.length === 0)
		? "0.00%" : math.format((writtenCount / completed.length) * 100, { notation: "fixed", precision: 2}) + "%";

	setAll("writtenPct", writtenPct);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});