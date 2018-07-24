
export const transformMetaTags = (text) => {
    //debugger; // Uncomment to trigger breakpoint.

    var htmlLinkTmpl = '<a href="{0}" target="_blank"><span class="far fa-paper-plane fa-sm"></span></a>';

    var transformedText = text;

    // Uses Regular Expression to get all URLs in [] brackets. e.g. [http://www.ge.com]
    var bracketedLinks = text.match(/\[([^\]]*)\]/g);

    // For each bracketed link, trim the [ and ] to get just the url.
    // And then replace the [url] with: <a href="url" target="_blank">website</a>
    if (bracketedLinks != null) {
        bracketedLinks.forEach((bracketedLink, index) => {
            console.log(`Detected bracketed Link: %{bracketedLink}`);

            if (bracketedLink != null && bracketedLink.toLowerCase().indexOf("[http") > -1) {
                var rawUrl = bracketedLink.replace("[", "").replace("]", "");
                
                var htmlLink = htmlLinkTmpl.replace("{0}", rawUrl);
                transformedText = transformedText.replace(bracketedLink, htmlLink);
                console.log(`The transformed text: ${transformedText}`);
            }
        });
    }

    // Now replace any remaining [] bracked text as bold text:
    transformedText = transformedText.replace('[', '<b>').replace(']', '</b>');

    return transformedText;
}


export const transformAsMailToBodyText = (text) => {
    //debugger; // Uncomment to trigger breakpoint.

    
    var transformedText = text;

    // Replace each space with %20
    //transformedText.replace(/\s/g, "%20"); //This regex doesn't work for some reason.
    var spaces = text.match(/\s/g);

    if (spaces != null) {
        spaces.forEach((space, index) => {
                transformedText = transformedText.replace(space, "%20");
        });
    }

    // Replace each [line-break] with %0D%0A
    // Uses Regular Expression to get all URLs in [] brackets. e.g. [http://www.ge.com]
    var bracketedStrings = text.match(/\[([^\]]*)\]/g);

    // For each bracketed link, trim the [ and ] to get just the string inside.
    if (bracketedStrings != null) {
        bracketedStrings.forEach((bracketedString, index) => {
            console.log(`Detected bracketed String: %{bracketedString}`);

            //if a line break is detected, replace it
            if (bracketedString != null && bracketedString.toLowerCase().indexOf("[line-break") > -1) {
                let lineBreakCode = '%0D%0A';
                transformedText = transformedText.replace(bracketedString, lineBreakCode);
                console.log(`The transformed text: ${transformedText}`);
            } else {
                // Remove any remaining []
                transformedText = transformedText.replace(bracketedString, "");
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
      });

    return caterers;
}


export const transformAppConfig = (appConfig) => {
    //debugger; // Uncomment to trigger breakpoint.


    var appConfigSettings = Object.getOwnPropertyNames(appConfig);

    appConfigSettings.forEach((setting, index) => {
        //ToDo: Uncomment to allow EmailTemplate transformation.
        if (setting.indexOf('EmailTemplate') > -1) {
            let originalText = appConfig[setting];
            var transformedText = transformAsMailToBodyText(originalText);
            appConfig[setting] = transformedText;
        }
    });

    return appConfig;
}
