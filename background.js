// Updated Background Script for new tasks, compatible with Manifest V3
const websites = {
    "gmail": {
        "url": "https://mail.google.com/",
        "login_button_selector": "a[jsname='CwaK9']"
    },
    "youtube": {
        "url": "https://www.youtube.com/",
        "login_button_selector": "button[aria-label='Sign in']"
    },
    "facebook": {
        "url": "https://www.facebook.com/",
        "login_button_selector": "button[name='login']"
    },
    "instagram": {
        "url": "https://www.instagram.com/",
        "login_button_selector": "button[type='submit']"
    },
    "twitter": {
        "url": "https://twitter.com/",
        "login_button_selector": "a[href='/login']"
    },
    "tiktok": {
        "url": "https://www.tiktok.com/",
        "login_button_selector": "a[href='/login']"
    },
    "linkedin": {
        "url": "https://www.linkedin.com/",
        "login_button_selector": "a[href='/login/']"
    },
    "reddit": {
        "url": "https://www.reddit.com/",
        "login_button_selector": "a[data-click-id='login']"
    },
    "discord": {
        "url": "https://discord.com/",
        "login_button_selector": "a[href='/login']"
    },
    "twitch": {
        "url": "https://www.twitch.tv/",
        "login_button_selector": "button[data-a-target='login-button']"
    },
    "spotify": {
        "url": "https://www.spotify.com/",
        "login_button_selector": "a[href='/us/login']"
    },
    "trustpilot": {
        "url": "https://www.trustpilot.com/",
        "login_button_selector": "a[href='/users/connect']"
    },
    "github": {
        "url": "https://github.com/",
        "login_button_selector": "a[href='/login']"
    },
    "amazon": {
        "url": "https://www.amazon.com/",
        "login_button_selector": "a[data-nav-role='signin']"
    }
};

// Check existing tabs
chrome.tabs.query({}, (tabs) => {
  const openUrls = tabs.map(tab => tab.url);

  for (const site in websites) {
    const siteInfo = websites[site];
    if (!openUrls.some(url => url && url.startsWith(siteInfo.url))) {
      // Open the website in a new tab if not already open
      chrome.tabs.create({ url: siteInfo.url });
    }
  }
});

// Listen to tab updates to perform login checks
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Check if the website is in our list
    for (const site in websites) {
      const siteInfo = websites[site];
      if (tab.url.startsWith(siteInfo.url)) {
        // Inject content script to check login status
        chrome.scripting.executeScript({
          target: {tabId: tabId},
          function: (siteInfo) => {
            const loginButton = document.querySelector(siteInfo.login_button_selector);
            if (loginButton) {
              // Perform click action to go to login or sign-up page
              loginButton.click();
            }
          },
          args: [siteInfo]
        });
      }
    }
  }
});
