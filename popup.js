var tabs = [];

chrome.tabs.query({}, function(t) {

    for (var i = 0; i < t.length; i++) {
        tabs[i] = t[i];
        tabs[i].score = 1;
    }
});

window.onload = function(){

    const input = document.getElementById('input');
    var selected = -1;
    var numMatches;

    input.oninput = function() {

        if (tabs) {

            sortTabs(input.value.trim().toLowerCase());
            updateView();
        }
    };

    input.onkeydown = function(event) {

        if (selected !== -1) { 
            var key = event.key;

            if (key === 'Enter')
                chrome.tabs.update(tabs[selected].id, { active: true });
            else if ((key === 'ArrowUp' || (event.ctrlKey && key === 'k' )) 
                && selected > 0)
                setSelected(selected - 1);
            else if ((key === 'ArrowDown' || (event.ctrlKey && key === 'j'))  
                && selected < numMatches - 1)
                setSelected(selected + 1);
        }
    };

    function updateView() {

        var l = Math.min(tabs.length, 5);
        numMatches = 0;

        for (var i = 0; i < l ; i++) {

            var row = document.getElementById(i.toString());
            row.innerHTML = '';

            if (tabs[i].score > 0) {
                row.appendChild(document.createTextNode(tabs[i].title));
                numMatches++;
            }
        }

        if (numMatches)
            setSelected(0);

        else {
            setSelected(-1);
            document.getElementById('0')
                .appendChild(document.createTextNode('No matches'));
        }
    }

    function setSelected(i) {

        if (selected !== -1) {
            document.getElementById(selected.toString())
                .classList.remove('selected')
        }
        selected = i;
        if (selected !== -1) {
            document.getElementById(selected.toString())
                .classList.add('selected');
        }
    }
};

function sortTabs(key) {

    for (var i = 0; i < tabs.length; i++)
        tabs[i].score = score(key, tabs[i]);

    tabs.sort(function(a, b){ return b.score - a.score; });
}

function score(input, tab) {

    var oldScore = Math.floor(tab.score / 2);

    var newScore = input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        .split(/\s/)
        .reduce(function(a, key) {
            return a + scoreTitle(key, tab.title) + scoreUrl(key, tab.url) 
        }, 0);

    return Math.max(oldScore, newScore);
}

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
