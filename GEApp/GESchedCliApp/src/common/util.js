export const getDateTimeDisplay = (inDateTime) => {
    //debugger; // Uncomment to trigger breakpoint.

    var curDateTime = inDateTime.replace('Z', '');
    var theDateTime = new Date(curDateTime);
    var dd = theDateTime.getDate();
    var mm = theDateTime.getMonth() + 1; //January is 0!
    var yyyy = theDateTime.getFullYear();
    var hrs = theDateTime.getHours();
    var mins = theDateTime.getMinutes();

    var ampm = "AM";
    if (hrs > 12) {
        hrs -= 12;
        ampm = "PM";
    }

    var ddStr = dd.toString();
    var mmStr = mm.toString();
    var dateDispVal =  mmStr + '/' + ddStr + '/' + yyyy;                       
    
    var hrsStr = hrs.toString();
    var minsStr = mins.toString();
    if (mins < 10) { minsStr = '0'+ minsStr; } 

    var dispValue = dateDispVal + ' ' + hrsStr + ':' + minsStr + ' ' + ampm;

    return dispValue;
}