
export const transformMetaTags = (text) => {
    //debugger; // Uncomment to trigger breakpoint.

    var transformedText = text;

    if (text == null) {
        return transformedText;
    }

    if ((typeof text) != "string") {
        return transformedText;
    }

    var htmlLinkTmpl = '<a href="{0}" target="_blank"><span class="far fa-paper-plane fa-sm"></span></a>';
    var htmlPhoneTmpl = '<a href="tel:{0}">{1}</a>';


    // Uses Regular Expression to get all URLs in [] brackets. e.g. [http://www.ge.com], [LINEBREAK]
    var bracketedStrings = text.match(/\[([^\]]*)\]/g);

    // For each bracketed link, trim the [ and ] to get just the url.
    // And then replace the [url] with: <a href="url" target="_blank">website</a>
    if (bracketedStrings != null) {
        bracketedStrings.forEach((bracketedString, index) => {
            console.log(`Detected bracketed Link: %{bracketedString}`);

            if (bracketedString != null && bracketedString.toLowerCase().indexOf("[http") > -1) {
                var rawUrl = bracketedString.replace("[", "").replace("]", "");
                
                var htmlLink = htmlLinkTmpl.replace("{0}", rawUrl);
                transformedText = transformedText.replace(bracketedString, htmlLink);
                
            } else if (bracketedString != null && bracketedString.indexOf("[LINEBREAK]") > -1) {

                transformedText = transformedText.replace("[LINEBREAK]", "<br>");

            } else if (bracketedString != null && bracketedString.indexOf("[PHONE:") > -1) {

                var rawPhNum = bracketedString.replace("[PHONE:", "").replace("]", "");
                rawPhNum = rawPhNum.trim();
                var htmlPh = htmlPhoneTmpl.replace("{0}", rawPhNum).replace("{1}", rawPhNum);
                transformedText = transformedText.replace(bracketedString, htmlPh);

            }

            console.log(`The transformed text: ${transformedText}`);
        });
    }

    // Now replace any remaining [] bracked text as bold text:
    while (transformedText.indexOf('[') > -1) {
        transformedText = transformedText.replace('[', '<b>').replace(']', '</b>');
    }

    return transformedText;
}


export const transformAsMailToBodyText = (text) => {
    //debugger; // Uncomment to trigger breakpoint.

    var transformedText = text;

    if (text == null) {
        return transformedText;
    }

    if ((typeof inputVal) != "string") {
        return transformedText;
    }

    // Replace each space with %20
    //transformedText.replace(/\s/g, "%20"); //This regex doesn't work for some reason.
    var spaces = text.match(/\s/g);

    if (spaces != null) {
        spaces.forEach((space, index) => {
                transformedText = transformedText.replace(space, "%20");
        });
    }

    // Replace each [LINEBREAK] with %0D%0A
    // Uses Regular Expression to get all URLs in [] brackets. e.g. [http://www.ge.com]
    var bracketedStrings = text.match(/\[([^\]]*)\]/g);

    // For each bracketed link, trim the [ and ] to get just the string inside.
    if (bracketedStrings != null) {
        bracketedStrings.forEach((bracketedString, index) => {
            console.log(`Detected bracketed String: %{bracketedString}`);
            
            //if a line break is detected, replace it
            if (bracketedString != null && bracketedString.indexOf("[LINEBREAK") > -1) {
                let lineBreakCode = '%0D%0A';
                transformedText = transformedText.replace(bracketedString, lineBreakCode);
                console.log(`The transformed text: ${transformedText}`);
            }
        });
    }
   

    return transformedText;
}


export const transformNotes = (notes) => {
    //debugger; // Uncomment to trigger breakpoint.

    notes.forEach((note, index) => {
        var text = note.text;
        var transfromedText = transformMetaTags(text);
        note.text = transfromedText;
      });

    return notes;
}


export const transformCaterers = (caterers) => {
    //debugger; // Uncomment to trigger breakpoint.

    caterers.forEach((caterer, index) => {
        var text = caterer.website;
        var transfromedText = transformMetaTags(text);
        caterer.website = transfromedText;

        var text = caterer.phone;
        var transfromedText = transformMetaTags(text);
        caterer.phone = transfromedText;
      });

    return caterers;
}

export const transformHotels = (hotels) => {
    //debugger; // Uncomment to trigger breakpoint.

    hotels.forEach((hotel, index) => {
        var text = hotel.website;
        var transfromedText = transformMetaTags(text);
        hotel.website = transfromedText;

        var text = hotel.phone;
        var transfromedText = transformMetaTags(text);
        hotel.phone = transfromedText;
      });

    return hotels;
}


export const transformAppConfig = (appConfig) => {
    //debugger; // Uncomment to trigger breakpoint.

    var appConfigSettings = Object.getOwnPropertyNames(appConfig);

    appConfigSettings.forEach((setting, index) => {
        let originalText = appConfig[setting]; 
        var transformedText = null;
        if (setting.indexOf('EmailTemplate') > -1) {    
            transformedText = transformAsMailToBodyText(originalText);
        } else {
            transformedText = transformMetaTags(originalText);
        }
        appConfig[setting] = transformedText;
    });

    return appConfig;
}
