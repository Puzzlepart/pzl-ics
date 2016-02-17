var organizer = {
    Name: "Roger Waterhouse",
    Email: "roger@waterhouse.com"
};
var attendees = [
    {
        Name: "Roger Waterhouse",
        Email: "roger@waterhouse.com"
    },
    {
        Name: "Roger Waterhouse",
        Email: "roger@waterhouse.com"
    },
    {
        Name: "Roger Waterhouse",
        Email: "roger@waterhouse.com"
    }
];
var subject = "Meeting about a duck";
var description = "We need to discuss this";
var location = "Oslo";
var begin = "20190806T110000+01";
var stop = "20190806T130000+01";

var cal_single = ics();
cal_single.addEvent(subject, description, location, begin, stop, organizer, attendees);
cal_single.download(subject, ".ics");