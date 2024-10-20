const modal = document.getElementById('modal');
const modalClose = document.getElementById('close-modal');
const modalShow = document.getElementById('show-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');
let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

function closeModal() {
  modal.classList.remove('show-modal');
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', closeModal);
window.addEventListener('click', (e) => (e.target === modal ? closeModal() : false));

// Validate Form
function validate(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields');
    return false;
  } else if (!urlValue.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }
  return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
  // Clear previous bookmarks before rebuilding
  bookmarksContainer.textContent = '';

  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;

    // Create a container for each bookmark item
    const item = document.createElement('div');
    item.classList.add('item');

    // Close icon to delete the bookmark
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

    // Create the link container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    // Favicon image
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');

    // Link element
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    // Append elements to the bookmark container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch Bookmarks from LocalStorage
function fetchBookmarks() {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // Initialize with a default bookmark if none exist
    bookmarks = [
      {
        name: 'Google',
        url: 'https://google.com',
      },
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
  bookmarks = bookmarks.filter((bookmark) => bookmark.url !== url);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks(); // Rebuild the DOM
}

// Handle Data from the Form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;

  // Ensure the URL starts with "https://"
  if (!urlValue.startsWith('https://') && !urlValue.startsWith('http://')) {
    urlValue = `https://${urlValue}`;
  }

  // Validate the input values
  if (!validate(nameValue, urlValue)) {
    return;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks(); // Rebuild the DOM

  // Reset the form and focus on the name input
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Event Listener for the Form Submission
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();
