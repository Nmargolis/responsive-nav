// Function generates AJAX request for nav items and handles response

function ajaxReq (method, url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          // console.log(JSON.parse(xhttp.responseText));
          callback(xhttp.responseText);
        }
    }
}


// Function takes navbar items as json and adds them to DOM
function addNavItems (navItemsText) {
    // Grab navbar element
    var navbar = document.getElementById('navbar');

    var navJson= JSON.parse(navItemsText);
    var navItems = navJson.items;

    // Iterate through JSON object
    navItems.forEach(function (navItem, i, array){

        // Generate the html as a string for each item in the response
        var toAdd = generatePrimaryNav(navItem.label, navItem.url, navItem.items);

        // Insert the html at the end of the navbar
        navbar.insertAdjacentHTML('beforeend', toAdd);

    });
}


function generatePrimaryNav(label, url, items=false) {
    // Initialize list item for output
    var listItem = '';

    // Generate and add first part of list item
    listItem = '<li class="navitem primary" role="menuitem" tabindex="0" aria-haspopup="true">' +
                '<a href="' + url + '">' + label + '</a>';
    
    // If there are submenu items, generate the html for that and add it to listItem
    if (items) {
        listItem += returnSubNav(items);
    }

    // Close primary li
    listItem += '</li>';

    // console.log(listItem);
    return listItem;
}

function returnSubNav(items) {
    var submenu = '';

    // Double check if items exists. Generate the submenu html if so.
    if (items) {
        items.forEach(generateSubNav);
    }
    
    // Function to generate submenu
    // Defined inside here so it can access submenu variable
    function generateSubNav(item, i, array) {

        // If this is the first item, add the opening ul tag
        if (i === 0) {
            submenu += ' <ul class="navdropdown" role="menu" aria-hidden="true">';
        }
        submenu += '<li class="navitem secondary" role="menuitem" tabindex="-1">' +
                        '<a href="' + item.url + '">' + item.label + '</a>' +
                    '</li>';
        // If this is the last item, add the closing ul tag
        if (i === array.length - 1) {
            submenu += '</ul>';
        }
    }

    return submenu;
}

// Make the ajax request when DOM has loaded
window.onload = ajaxReq('GET', '/api/nav.json', addNavItems);
