"use strict";
const userFavs = [];
// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
  // getFavorites();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
  // getFavorites();
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
  getFavorites();
}

async function addFavorite(evt){
 const storyId = evt.target.closest('li').id;

 const token = currentUser.loginToken

 const postFavResponse = await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${storyId}`, {token});
 userFavs.length = 0;
 const favsArr = postFavResponse.data.user.favorites;
 favsArr.forEach(fav => userFavs.push(fav));
 console.log(userFavs)

}

async function addFavorite(evt){
 
    console.log(evt.target.className)
    if (evt.target.className === 'fas fa-star'){
     await removeFavorite(evt);
     return;
    }
    
 const storyId = evt.target.closest('li').id;
 evt.target.className = 'fas fa-star';
 
 const token = currentUser.loginToken

 const postFavResponse = await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${storyId}`, {token});
 userFavs.length = 0;
 const favsArr = postFavResponse.data.user.favorites;
 favsArr.forEach(fav => userFavs.push(fav));

}


async function removeFavorite(evt){
  const storyId = evt.target.closest('li').id;
  // console.log(storyId);
   
  const token = {
    token: currentUser.loginToken
  }
  
 evt.target.className = 'far fa-star';

 const deleteFavResponse = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${storyId}`,{data: token});

    userFavs.length = 0;
 const favsArr = deleteFavResponse.data.user.favorites;
 favsArr.forEach(fav => userFavs.push(fav));
//  console.log(userFavs)
}


async function getFavorites(evt){
 await currentUser.favorites;
 currentUser.favorites.forEach((fav) => {
   userFavs.push(fav);
   const id = fav.storyId
   $(`#${id}`).find('i').removeClass().addClass('fas fa-star')
  
 })
  
 
}

$allStoriesList.on('click', '.star', addFavorite);

async function removeStory(evt){
  const storyId = $(evt.target).parent().parent().attr('id');
  // console.log(storyId);
  $(evt.target).parent().parent().remove()
  const token = {
    token: currentUser.loginToken
  }
  const deleteStoryResponse = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`,{data: token});
}

$allStoriesList.on('click', '#can', removeStory)

