class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        const t = this.text;

        if (t.startsWith("Watch my") && t.includes("Runkeeper Live")) {
            return "live_event"
        }

        if (t.startsWith("Achieved a new personal record")) {
            return "achievement"
        }

        if (t.startsWith("Just completed")  || t.startsWith("Just posted")) {
            return "completed_event"
        }

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.text.includes(" - ");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        const twt_split = this.text.split(" - ");
        let twt_text = twt_split[1];
        const tag_index = twt_text.indexOf("#RunKeeper");
        if (tag_index !== -1) {
            twt_text = twt_text.substring(0, tag_index);
        }

        return twt_text.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}