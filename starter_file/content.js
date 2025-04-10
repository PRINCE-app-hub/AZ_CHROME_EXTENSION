const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png");
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";

const observer = new MutationObserver(() => {
  addBookmarkButton();
});

observer.observe(document.body, { childList: true, subtree: true });
addBookmarkButton();

function onProblemsPage() {
  return window.location.pathname.startsWith('/problems/');
}

function addBookmarkButton() {
  if (!onProblemsPage() || document.getElementById("add-bookmark-button")) return;

  const askDoubtButton = document.querySelector(".coding_ask_doubt_button__FjwXJ");
  if (!askDoubtButton) return;

  const bookmarkButton = document.createElement('img');
  bookmarkButton.id = "add-bookmark-button";
  bookmarkButton.src = bookmarkImgURL;
  bookmarkButton.style.height = "30px";
  bookmarkButton.style.width = "30px";
  bookmarkButton.style.cursor = "pointer";
  bookmarkButton.title = "Bookmark this problem";

  askDoubtButton.parentNode.insertAdjacentElement("afterend", bookmarkButton);

  bookmarkButton.addEventListener("click", addNewBookmarkHandler);
}

async function addNewBookmarkHandler() {
  const azProblemUrl = window.location.href;
  const uniqueId = extractUniqueId(azProblemUrl);

  const nameElement = document.querySelector(".Header_resource_heading__cpRp1");
  if (!nameElement) return alert("⚠️ Could not find problem title.");

  const problemName = nameElement.innerText;

  const problem = {
    id: uniqueId,
    name: problemName,
    url: azProblemUrl
  };

  chrome.runtime.sendMessage(
    {
      action: "save_problem",
      problem
    },
    (response) => {
      if (response.status === "success") {
        alert("✅ Problem bookmarked!");
      } else if (response.status === "exists") {
        alert("⚠️ This problem is already bookmarked.");
      }
    }
  );
}

function extractUniqueId(url) {
  const start = url.indexOf("problems/") + "problems/".length;
  const end = url.indexOf("?", start);
  return end === -1 ? url.substring(start) : url.substring(start, end);
}
