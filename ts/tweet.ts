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
            return "live_event";
        }

        if (t.startsWith("Achieved a new personal record")) {
            return "achievement";
        }

        if (t.startsWith("Just completed")  || t.startsWith("Just posted")) {
            return "completed_event";
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
        
        const mi_index = this.text.indexOf(" mi ");
        const km_index = this.text.indexOf(" km ");
        let unit_index = -1;
        let unit_length = 0;

        if (mi_index !== -1) {
            unit_index = mi_index;
            unit_length = " mi ".length;
        } else if (km_index !== -1) {
            unit_index = km_index;
            unit_length = " km ".length;
        } else {
            return "unknown";
        }

        const activityType = this.text.substring(unit_index + unit_length);
        const activity_end = activityType.indexOf(" ");
        
        if (activity_end === -1) {
            return activityType.trim().toLowerCase();
        }

        return activityType.substring(0, activity_end).trim().toLowerCase();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        
        const twt_templates = ["Just completed a ", "Just completed an ", "Just posted a ", "Just posted an "];
        let start = -1;
        for (let i = 0; i < twt_templates.length; i++) {
            const index = this.text.indexOf(twt_templates[i]);
            if (index !== -1) {
                start = index + twt_templates[i].length;
                break;
            }
        }

        if (start === -1) return 0;

        const twt_text = this.text.substring(start);
        const space_index = twt_text.indexOf(" ");
        const distStr = twt_text.substring(0, space_index);
        const dist = parseFloat(distStr);

        const unit = twt_text.substring(space_index + 1);
        if (unit.startsWith("mi")) {
            return dist;
        }
        if (unit.startsWith("km")) {
            return dist / 1.609;
        }

        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        const get_url = this.text.match(/https?:\/\/\S+/);
        const url = get_url ? get_url[0] : "";
        const displayText = this.written ? this.writtenText : this.text;
        const tweet_cell = (url !== "") 
            ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${displayText}</a>`
            : `${displayText}`
        
        return `<tr><th score="row">${rowNumber}</th>
        <td>${this.activityType}</td>
        <td>${tweet_cell}</td>
        </tr>`;
    }
}