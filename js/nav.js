"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  // hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $('.nav-left').show();
}
// My Code 
// when a user clicks on the nav Submit link we show ad-story-form
function navSubmitClick(evt){
  $adStoryForm.toggleClass('hidden', 'addOrRemove');
}

$navSubmit.on('click', navSubmitClick);
// My Code when a user clicks the "Favorites" Navigation Filter
// Hides all stories that arent a user favorite
function navFavoritesClick (){
  $('.far.fa-star').closest('li').hide();
}

$navFavorites.on('click', navFavoritesClick)

// My Code 
// When logged in user clicks on th"my Stories" nav link 
// Hide all other stories 
// show the Trash Can delete icon on their filtered stories
function navMyStoriesClick(){
  storyList.stories.forEach((story) =>{
    if(story.username !== currentUser.username) {
      $('#'+story.storyId).hide()
    }
    else {
      $('#'+story.storyId).find('.trash-can').show();
      $('#'+story.storyId).find('#edit-story-button').show()
      
    }
  })
}

$navMyStories.on('click', navMyStoriesClick)


