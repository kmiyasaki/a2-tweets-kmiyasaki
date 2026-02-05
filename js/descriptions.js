function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	written_tweets = tweet_array.filter(t => t.written);

	// initialize empty search
	document.getElementById("searchText").innerText = "";
	document.getElementById("searchCount").innerText = "0";
	document.getElementById("tweetTable").innerHTML = "";
}

function addEventHandlerForSearch() {
	const input = document.getElementById("textFilter");
	const tableBody = document.getElementById("tweetTable");
	const searchCountSpan = document.getElementById("searchCount");
	const searchTextSpan = document.getElementById("searchText");

	input.addEventListener("input", function () {
		const query = input.value;
		searchTextSpan.innerText = query;

		if (query.trim() === "") {
			searchCountSpan.innerText = "0";
			tableBody.innerHTML = "";
			return;
		}
		
		const q = query.toLowerCase();
		const matches = written_tweets.filter(t =>
			t.writtenText.toLowerCase().includes(q)
		);

		searchCountSpan.innerText = String(matches.length);

		let rows = "";
		for (let i = 0; i < matches.length; i++) {
			rows += matches[i].getHTMLTableRow(i + 1);
		}
		tableBody.innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});