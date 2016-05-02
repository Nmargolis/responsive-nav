// Use strict mode
'use strict';


// Function generates AJAX request for nav items and handles response

function ajaxReq(method, url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.open(method, url, true);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      // console.log(JSON.parse(xhttp.responseText));
      callback(xhttp.responseText);
    }
  };
}

//Function to generate html for each submenu
function returnSubNav(items) {
  var subMenu = '';

  // Function to generate submenu html
  // Defined inside here so it can access submenu variable
  function generateSubNav(item, i, array) {

    // Create new list item
    var subItem = document.createElement('Li');

    // Set the new list items attributes
    subItem.setAttribute('class', 'navitem secondary');
    subItem.setAttribute('role', 'menuitem');
    subItem.setAttribute('tabindex', '-1');

    // Create new link element with item url
    var a = document.createElement('a');
    a.setAttribute('href', item.url);

    // Add item label as the text
    a.appendChild(document.createTextNode(item.label));

    // Add event listener to a to hide menu card when clicked and navigating to new page
    a.onclick = function() {
      if (isMobile()) {
        console.log('is mobile');
        toggleNavbar();
      }
    };

    // Add the link to the new list item
    subItem.appendChild(a);

    // Append subItem to subMenu
    subMenu.appendChild(subItem);
  }

  // Double check if items exists. Generate the submenu html if so.
  if (items) {
    // Create the ul element
    subMenu = document.createElement('Ul');
    subMenu.setAttribute('class', 'navdropdown');
    subMenu.setAttribute('role', 'menu');
    subMenu.setAttribute('aria-hidden', 'true');

    // Populate that ul element with list items
    items.forEach(generateSubNav);
  }

  return subMenu;
}


// Function to generate html for each primary nav item
function generatePrimaryNav(label, url, items = false) {
  // Create listItem element
  var listItem = document.createElement('Li');

  // console.log(items);

  // TODO: do this in for loop? Maybe have function that takes properties object and adds all of them.
  // Could then be used for primary and submenu items
  listItem.setAttribute('class', 'navitem primary');
  listItem.setAttribute('role', 'menuitem');
  listItem.setAttribute('tabindex', '0');

  var a = document.createElement('a');
  a.setAttribute('href', url);
  a.appendChild(document.createTextNode(label));

  listItem.appendChild(a);


  // console.log('new listItem: ' + listItem);

  // If there are submenu items, generate the html for that and add it to listItem
  if (items && items.length > 0) {

    // Add the aria-haspopup class to the primary listItem
    listItem.setAttribute('aria-haspopup', true);

    // Generate image element for chevron
    var chevron = document.createElement('img');
    chevron.setAttribute('src', '../images/chevron.svg');
    chevron.setAttribute('class', 'chevron');
    chevron.setAttribute('alt', 'chevron');

    // Add chevron to list item
    listItem.appendChild(chevron);

    // Generate the submenu ul element and append it to the primary listItem
    listItem.appendChild(returnSubNav(items));
  }

  // console.log(listItem);
  return listItem;
}

function generateCopyright() {
  var copyright = document.createElement('Li');
  copyright.setAttribute('id', 'copyright');
  var innerdiv = document.createElement('div');
  innerdiv.appendChild(document.createTextNode('© 2014 Huge. All Rights Reserved'));
  copyright.appendChild(innerdiv);
  console.log(copyright);
  return copyright;
}

// Function to show drowpdown
function showDropdown(dropdown) {
  dropdown.classList.add('expanded');
  dropdown.removeAttribute('aria-hidden');
  dropdown.parentElement.classList.add('open');
}


// Function to change dropdown state back to hidden
function hideDropdown(dropdown) {
  dropdown.classList.remove('expanded');
  dropdown.setAttribute('aria-hidden', true);
  dropdown.parentElement.classList.remove('open');
}

// Function to return true if screen is < 768px
function isMobile() {
  if (window.innerWidth <= 768) {
    // console.log(true);
    return true;
  } else {
    // console.log(false);
    return false;
  }
}

// Function to attach click events to all primary items with submenus
function addOpenDropdownActions() {

  // Grab all primary elements
  var primaries = document.querySelectorAll('.primary');

  // Construct array of all primary elements from NodeList object
  primaries = [].slice.call(primaries);

  // console.log('primaries: ' + primaries);

  primaries.forEach(function(item, i, array) {
    item.onclick = function() {
      // console.log(this.childNodes);

      // Grab overlay to toggle its visibility
      var overlay = document.getElementById('overlay');

      // Find open dropdown if there is one that's open already
      var openDropdown = document.querySelector('.expanded');

      // If this item has a submenu
      if (this.childNodes.length > 1) {

        // Grab the dropdown, which is the 3rd child node
        var thisDropdown = this.childNodes[2];

        // If this element's dropdown is open, close the dropdown and remove the overlay on desktop
        if (openDropdown && thisDropdown.classList.contains('expanded')) {
          console.log('this elements dropdown is open');
          hideDropdown(thisDropdown);
          // Remove overlay if in Desktop mode
          if (!isMobile()) {
            overlay.classList.remove('visible');
          }
        }

        // Otherwise if there is an open dropdown, close it and open this one
        else if (openDropdown) {
          console.log('another elements dropdown is open');
          hideDropdown(openDropdown);
          showDropdown(thisDropdown);
        }
        // Otherwise, open this dropdown and make overlay visible
        else {
          showDropdown(thisDropdown);
          // Add overlay if in Desktop mode
          if (!isMobile()) {
            overlay.classList.add('visible');
          }
        }
      }
      // If this item doesn't have a submenu and there's an open dropdown
      else if (openDropdown) {
        // Close any open dropdowns and remove overlay if it's visible if on desktop
        hideDropdown(openDropdown);
        // Remove overlay if in Desktop mode
        if (isMobile() === false) {
          console.log(!isMobile());
          overlay.classList.remove('visible');
        }
      }
    };
  });
}


// Function takes navbar items as json and adds them to DOM
// This is the callback function fired when AJAX request responds
function addNavItems(navItemsText) {
  // Grab navbar element
  var navbar = document.getElementById('navbar');

  var navJson = JSON.parse(navItemsText);
  var navItems = navJson.items;

  // Iterate through JSON object
  navItems.forEach(function(navItem, i, array) {

    // Generate the html as a string for each item in the response
    var toAdd = generatePrimaryNav(navItem.label, navItem.url, navItem.items);

    // Insert the html at the end of the navbar
    navbar.appendChild(toAdd);
  });

  // Add copyright as last item
  navbar.appendChild(generateCopyright());

  // Attach click events to primary nav items with submenus
  addOpenDropdownActions();
}


// Function to hide and show navbar on mobile when toggle button clicked
function toggleNavbar() {

  // Grab toggle button
  var toggleButton = document.getElementById('toggle-open-close');

  // Grab the navbar element
  var navbar = document.getElementById('navbar');

  // Grab the overlay element
  var overlay = document.getElementById('overlay');

  // Grab content element
  var content = document.getElementById('content-wrapper');

  // If the navbar is opened
  if (toggleButton.classList.contains('opened')) {
    toggleButton.classList.remove('opened');
    toggleButton.setAttribute('aria-pressed', 'false');
    navbar.classList.remove('visible');
    overlay.classList.remove('visible');
    content.classList.remove('pushed');
  } else {
    toggleButton.classList.add('opened');
    toggleButton.setAttribute('aria-pressed', 'true');
    navbar.classList.add('visible');
    overlay.classList.add('visible');
    content.classList.add('pushed');
  }

}

// Function to hide dropdown and hide overlay.
// Will be fired if user clicks anywhere other than nav
function hideOnOverlayClick() {

  // Grab open dropdown and overlay elements
  var openDropdown = document.querySelector('.expanded');
  var overlay = document.getElementById('overlay');

  // Hide open dropdown and overlay elements
  hideDropdown(openDropdown);
  overlay.classList.remove('visible');
}


// When DOM has loaded
window.onload = function() {
  // Make Ajax request for nav items
  ajaxReq('GET', '/api/nav.json', addNavItems);

  // Grab overlay element
  var overlay = document.getElementById('overlay');

  // Add event listener to overlay to hide dropdown and hide overlay 
  // if user clicks anywhere other than nav, since overlay covers everything else
  overlay.onclick = hideOnOverlayClick;

  // Add event listener to togglebutton
  var toggleButton = document.getElementById('toggle-open-close');

  toggleButton.onclick = toggleNavbar;



};