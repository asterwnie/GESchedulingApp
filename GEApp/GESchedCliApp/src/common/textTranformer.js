
export const tranformMetaTags = (text) => {
    debugger; // Uncomment to trigger breakpoint.

    // for now, return the same string.
    var transformedText = text;

    // Get all URL in []. e.g. [http://www.ge.com]
    var bracketedLinks = text.match(/\[([^\]]*)\]/);

    // for each bracketed link, trim the [ and ] to get just the url.
    // you should be able to replace the [url] with:
    // <a href="url" target="_blank">website</a>

    return transformedText;
}


export const tranformNotes = (notes) => {
    debugger; // Uncomment to trigger breakpoint.

    var transformedNotes = [];

    // Do a for each to process each note. 
    // on each note, get its text and call tranformMetaTags
    // create a new note item with the transformed text and 
    // add it to transformedNotes.

    // For now return the same collection:
    return notes;
    //return transformedNotes;
}
