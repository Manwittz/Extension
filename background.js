// Updated Background Script for new tasks
chrome.runtime.onInstalled.addListener(() => {
  // Websites and their login button selectors
  const websites = {
    "gmail": {
        "url": "https://mail.google.com/",
        "login_button_selector": "a[jsname='CwaK9']"
    },
    "youtube": {
        "url": "https://www.youtube.com/",
        "login_button_selector": "button[aria-label='Sign in']"
    }
};

  // Check existing tabs
  chrome.tabs.query({}, (tabs) => {
    const openUrls = tabs.map(tab => tab.url);

    for (const site in websites) {
      const siteInfo = websites[site];
      if (!openUrls.includes(siteInfo.url)) {
        // Open the website in a new tab if not already open
        chrome.tabs.create({ url: siteInfo.url });
      }
    }
  });
});

// Listen to tab updates to perform login checks
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Check if the website is in our list
    for (const site in websites) {
      const siteInfo = websites[site];
      if (tab.url.startsWith(siteInfo.url)) {
        // Inject content script to check login status
        chrome.tabs.executeScript(tabId, {
          code: \`
            const loginButton = document.querySelector('${siteInfo['login_button_selector']}');
            if (loginButton) {
              // Perform click action to go to login or sign-up page
              loginButton.click();
            }
          \`
        });
      }
    }
  }
});
