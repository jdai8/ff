function score(input, tab) {

    function scoreTitle(key, title) {

        title = title.toLowerCase();

        if (title.match(new RegExp('(\\W|^)' + key)))
            return key.length;

        if (title.match(new RegExp(key)))
            return 1;

        return 0;
    }

    function scoreUrl(key, url) {

        url = url.toLowerCase();

        if (url.match(new RegExp('#*' + key)))
            return key.length;

        if (url.match(new RegExp(key)))
            return 1;

        return 0; 
    }

    var oldScore = Math.floor(tab.score / 2);

    var newScore = input//.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        .split(/\s/)
        .reduce(function(a, key) {
            return a + scoreTitle(key, tab.title) + scoreUrl(key, tab.url) 
        }, 0);

    return Math.max(oldScore, newScore);
}

function stableSort(tabs) {

    var buckets = [];
    for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];

        if (buckets[tab.score])
            buckets[tab.score].push(tab);
        else
            buckets[tab.score] = [tab];
    } 

    var sorted = [];
    for (var i = buckets.length - 1; i >= 0; i--) {
        if (buckets[i])
            sorted = sorted.concat(buckets[i]);
    }

    return sorted;
}
