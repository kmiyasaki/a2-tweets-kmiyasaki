function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const completed = tweet_array.filter(t =>
		t.source === "completed_event" &&
		t.activityType !== "unknown" &&
		t.distance > 0
	);

	const counts = {};
	for (let i = 0; i < completed.length; i++) {
		const type = completed[i].activityType;
		if (counts[type] === undefined) counts[type] = 0;
		counts[type]++;
	}

	const activityCounts = Object.keys(counts).map(type => {
		return { activityType: type, count: counts[type] };
	});

	document.getElementById("numberActivities").innerText = activityCounts.length;

	activityCounts.sort((a, b) => b.count - a.count);

	document.getElementById("firstMost").innerText = activityCounts[0]?.activityType ?? "unknown";
	document.getElementById("secondMost").innerText = activityCounts[1]?.activityType ?? "unknown";
	document.getElementById("thirdMost").innerText = activityCounts[2]?.activityType ?? "unknown";

	// activities table
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": { "values": activityCounts },
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type" },
		"y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const topTypes = [
		activityCounts[0]?.activityType,
		activityCounts[1]?.activityType,
		activityCounts[2]?.activityType
	].filter( x => x !== undefined);

	const distanceData = [];

	for (let i = 0; i < completed.length; i++) {
		const t = completed[i];
		if (!topTypes.includes(t.activityType)) continue;

		const day = t.time.toLocaleDateString(undefined, { weekday: "long" });
		const day_num = t.time.getDay();
		const weekend = (day_num === 0 || day_num == 6) ? "Weekend" : "Weekday";

		distanceData.push({
			activityType: t.activityType,
			distance: t.distance,
			day: day,
			weekend: weekend
		});
	}

	// distances table
	const distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the distances for the 3 most common activities by day of the week.",
		"data": { "values": distanceData },
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				"title": "Day of the Week"
			},
			"y": { "field": "distance", "type": "quantitative", "title": "Distance (miles)" },
			"color": { "field": "activityType", "type": "nominal", "title": "Activity Type" }
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	// mean distances table
	const distance_vis_spec_agg = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the mean distances for the 3 most common activities by day of the week.",
		"data": { "values": distanceData },
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				"title": "Day of the Week"
			},
			"y": { "field": "distance", "type": "quantitative", "aggregate": "mean", "title": "Mean Distance (miles)" },
			"color": { "field": "activityType", "type": "nominal", "title": "Activity Type" }
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_spec_agg, {actions:false});

	// button configuration
	document.getElementById("distanceVisAggregated").style.display = "none";
	document.getElementById("aggregate").addEventListener("click", function () {
		const rawDiv = document.getElementById("distanceVis");
		const meanDiv = document.getElementById("distanceVisAggregated");

		if (meanDiv.style.display === "none") {
			meanDiv.style.display = "block";
			rawDiv.style.display = "none";
			this.innerText = "Show all activities";
		} else {
			meanDiv.style.display = "none";
			rawDiv.style.display = "block";
			this.innerText = "Show means";
		}
	});

	// hardcoded text
	document.getElementById("longestActivityType").innerText = "bike";
	document.getElementById("shortestActivityType").innerText = "walk";
	document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});