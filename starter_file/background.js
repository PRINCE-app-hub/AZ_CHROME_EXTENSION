const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY"; // match popup.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save_problem") {
    chrome.storage.sync.get([AZ_PROBLEM_KEY], (result) => {
      const problems = result[AZ_PROBLEM_KEY] || [];

      const exists = problems.some(p => p.url === message.problem.url);

      if (!exists) {
        problems.push(message.problem);

        chrome.storage.sync.set({ [AZ_PROBLEM_KEY]: problems }, () => {
          console.log("✅ Problem saved:", message.problem);
          sendResponse({ status: "success", saved: true });
        });
      } else {
        console.log("⚠️ Problem already exists:", message.problem.url);
        sendResponse({ status: "exists", saved: false });
      }
    });

    return true; // Keeps sendResponse alive
  }
});
