/*
 * Write your client-side JS code in this file.  Don't forget to include your
 * name and @oregonstate.edu email address below.
 *
 * Name:
 * Email:
 */
// Get references to elements
// Get references to elements
var sellSomethingButton = document.getElementById('sell-something-button');
var modalBackdrop = document.getElementById('modal-backdrop');
var sellSomethingModal = document.getElementById('sell-something-modal');

var modalCloseButton = document.getElementById('modal-close');
var modalCancelButton = document.getElementById('modal-cancel');
var modalAcceptButton = document.getElementById('modal-accept');

var postTextInput = document.getElementById('post-text-input');
var postPhotoInput = document.getElementById('post-photo-input');
var postPriceInput = document.getElementById('post-price-input');
var postCityInput = document.getElementById('post-city-input');

// Function to show the modal
function showModal() {
  sellSomethingModal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');
}

// Function to hide the modal and clear inputs
function closeModal() {
  sellSomethingModal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');
  clearModalInputs();
}

// Function to clear all input fields in the modal
function clearModalInputs() {
  postTextInput.value = '';
  postPhotoInput.value = '';
  postPriceInput.value = '';
  postCityInput.value = '';
  // Reset condition radio buttons to default ('new')
  var defaultConditionRadio = document.getElementById('post-condition-new');
  defaultConditionRadio.checked = true;
}

// Event listener to open the modal
sellSomethingButton.addEventListener('click', showModal);

// Event listeners to close the modal
modalCloseButton.addEventListener('click', closeModal);
modalCancelButton.addEventListener('click', closeModal);

// Array to store all posts
var allPosts = [];

// Function to get selected condition
function getPostCondition() {
  var postConditionRadio = document.querySelector('input[name="post-condition"]:checked');
  var postCondition = postConditionRadio ? postConditionRadio.value : '';
  return postCondition;
}

// Function to create a new post element
function createPostElement(description, photoURL, price, city, condition) {
  var postElem = document.createElement('div');
  postElem.classList.add('post');
  postElem.setAttribute('data-price', price);
  postElem.setAttribute('data-city', city.toLowerCase());
  postElem.setAttribute('data-condition', condition);

  var postContents = document.createElement('div');
  postContents.classList.add('post-contents');
  postElem.appendChild(postContents);

  var postImageContainer = document.createElement('div');
  postImageContainer.classList.add('post-image-container');
  postContents.appendChild(postImageContainer);

  var imageElem = document.createElement('img');
  imageElem.setAttribute('src', photoURL);
  imageElem.setAttribute('alt', description);
  postImageContainer.appendChild(imageElem);

  var postInfoContainer = document.createElement('div');
  postInfoContainer.classList.add('post-info-container');
  postContents.appendChild(postInfoContainer);

  var postTitle = document.createElement('a');
  postTitle.setAttribute('href', '#');
  postTitle.classList.add('post-title');
  postTitle.textContent = description;
  postInfoContainer.appendChild(postTitle);

  var space1 = document.createTextNode(' ');
  postInfoContainer.appendChild(space1);

  var postPrice = document.createElement('span');
  postPrice.classList.add('post-price');
  postPrice.textContent = '$' + price;
  postInfoContainer.appendChild(postPrice);

  var space2 = document.createTextNode(' ');
  postInfoContainer.appendChild(space2);

  var postCity = document.createElement('span');
  postCity.classList.add('post-city');
  postCity.textContent = '(' + city + ')';
  postInfoContainer.appendChild(postCity);

  return postElem;
}

// Function to add a new post
function addPost(description, photoURL, price, city, condition) {
  var newPost = createPostElement(description, photoURL, price, city, condition);

  var postsSection = document.getElementById('posts');
  postsSection.appendChild(newPost);

  // Add to allPosts array
  allPosts.push(newPost);
}

// Event listener for the accept button in the modal
modalAcceptButton.addEventListener('click', function() {
  var postText = postTextInput.value.trim();
  var postPhoto = postPhotoInput.value.trim();
  var postPrice = postPriceInput.value.trim();
  var postCity = postCityInput.value.trim();
  var postCondition = getPostCondition();

  if (!postText || !postPhoto || !postPrice || !postCity || !postCondition) {
    alert('Please fill in all of the fields!');
    return;
  }

  addPost(postText, postPhoto, postPrice, postCity, postCondition);

  closeModal();
});

// Function to collect all existing posts on page load
function collectAllPosts() {
  var postElems = document.getElementsByClassName('post');
  for (var i = 0; i < postElems.length; i++) {
    allPosts.push(postElems[i]);
  }
}

// Call collectAllPosts on page load
collectAllPosts();

// Filtering functionality

var filterUpdateButton = document.getElementById('filter-update-button');

filterUpdateButton.addEventListener('click', function() {
  var filterText = document.getElementById('filter-text').value.trim().toLowerCase();
  var filterMinPrice = document.getElementById('filter-min-price').value.trim();
  var filterMaxPrice = document.getElementById('filter-max-price').value.trim();
  var filterCity = document.getElementById('filter-city').value.trim().toLowerCase();

  // Get selected conditions
  var conditionInputs = document.querySelectorAll('#filter-condition input[name="filter-condition"]:checked');
  var filterConditions = [];
  conditionInputs.forEach(function(input) {
    filterConditions.push(input.value);
  });

  // Clear current posts
  var postsSection = document.getElementById('posts');
  while (postsSection.firstChild) {
    postsSection.removeChild(postsSection.firstChild);
  }

  // Re-add posts that match filters
  allPosts.forEach(function(post) {
    var postTitleElem = post.querySelector('.post-title');
    var postTitle = postTitleElem ? postTitleElem.textContent.toLowerCase() : '';

    var postPrice = parseFloat(post.getAttribute('data-price'));
    var postCityAttr = post.getAttribute('data-city').toLowerCase();
    var postCondition = post.getAttribute('data-condition');

    var matchesText = true;
    var matchesMinPrice = true;
    var matchesMaxPrice = true;
    var matchesCity = true;
    var matchesCondition = true;

    // Text filter
    if (filterText) {
      matchesText = postTitle.includes(filterText);
    }

    // Minimum price filter
    if (filterMinPrice) {
      var minPrice = parseFloat(filterMinPrice);
      if (!isNaN(minPrice)) {
        matchesMinPrice = postPrice >= minPrice;
      }
    }

    // Maximum price filter
    if (filterMaxPrice) {
      var maxPrice = parseFloat(filterMaxPrice);
      if (!isNaN(maxPrice)) {
        matchesMaxPrice = postPrice <= maxPrice;
      }
    }

    // City filter
    if (filterCity) {
      matchesCity = postCityAttr === filterCity;
    }

    // Condition filter
    if (filterConditions.length > 0) {
      matchesCondition = filterConditions.includes(postCondition);
    }

    // If matches all filters, append to postsSection
    if (matchesText && matchesMinPrice && matchesMaxPrice && matchesCity && matchesCondition) {
      postsSection.appendChild(post);
    }
  });
});
