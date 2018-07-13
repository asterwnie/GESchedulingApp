
export const tranformMetaTags = (text) => {
    //debugger; // Uncomment to trigger breakpoint.

    var htmlLinkTmpl = '<a href="{0}" target="_blank"><span class="far fa-paper-plane fa-sm"></span></a>';

    var transformedText = text;

    // Uses Regular Expression to get all URLs in [] brackets. e.g. [http://www.ge.com]
    var bracketedLinks = text.match(/\[([^\]]*)\]/);

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


export const tranformNotes = (notes) => {
    //debugger; // Uncomment to trigger breakpoint.

    notes.forEach((note, index) => {
        var text = note.text;
        var transfromedText = tranformMetaTags(text);
        note.text = transfromedText;
      });

    return notes;
}


export const tranformCaterers = (caterers) => {
    //debugger; // Uncomment to trigger breakpoint.

    caterers.forEach((caterer, index) => {
        var text = caterer.website;
        var transfromedText = tranformMetaTags(text);
        caterer.website = transfromedText;
      });

    return caterers;
}
