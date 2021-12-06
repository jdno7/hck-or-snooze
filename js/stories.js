"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
// My Code (Some) 
//  I added some parameters / hidden elements to this pre built mark-up to fascilitate favorite/delete/edit icont elements
function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="trash-can" id="can" style="display: none">
          <i class="far fa-trash-alt"></i>
        </span>
        <span class="star">
          <i class="far fa-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>

        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        
        <button  style="display: none" id="edit-story-button" value="${story.storyId}">Edit</button>
        
        <form
          action=""
          id="${story.storyId}"
          class="hidden">
          <h4>Edit Story</h4>
          <div class="login-input">
          <label for="title">Title</label>
          <input id="story-title" autocapitalize="words">
          </div>
          <div class="login-input">
          <label for="story-author">Author</label>
          <input id="story-author" autocapitalize="words">
          </div>
          <div class="story-url">
          <label for="story-url">URL</label>
          <input id="story-url">
          </div>
          <button id="edit-story-submit" type="submit" value="${story.storyId}">Submit Changes</button>
        </form>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Ads a new Story to the stories API  from the "Submit" Form and reloads the page to Update UI and hide submit form
 async function addNewUserStory(evt){
  const title = $('#story-title').val();
  const author = $('#story-author').val();
  const url = $('#story-url').val();

  const userStory = {
    title,
    author,
    url
  }

  await storyList.addStory(currentUser, userStory);

  location.reload();

}

$adStoryForm.on('submit', addNewUserStory);

