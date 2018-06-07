
exports.getSite = function (req) {
    var siteCode = null;
    if (req.query.site != null) {
        siteCode = req.query.site;
    }
    else if (req.cookies.site != null) {
        siteCode = req.cookies.site;
    }
    return siteCode;
}