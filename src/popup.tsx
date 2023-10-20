import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getGroupIdsForTabs, generateGroupNames } from "./utils";
import { kmeans } from "ml-kmeans";
// const kmeans = require('ml-kmeans');


const Popup = () => {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>();

  useEffect(() => {
    chrome.tabs.query({
      currentWindow: true,
    }, function (tabs) {
      setTabs(tabs);
    });
  }, []);


  // const groupTabs = () => {
  //   // if no api key is set, alert the user
  //   chrome.storage.sync.get('apiKey', key => {
  //     if (key.apiKey === "" || key.apiKey === undefined) {
  //       alert("Please set your Cohere API key in the options page");
  //     }
  //   });

  //   // if has api key, and tabs are available, group them
  //   if (tabs) {
  //     const groupDict = getGroupIdsForTabs(tabs);

  //     ((Object.keys(groupDict) as unknown) as number[]).forEach(async (groupId) => {
  //       const tabIds = groupDict[groupId];
  //       if (tabIds.length > 1) {
  //         const group = await chrome.tabs.group({ tabIds: tabIds });
  //         const tabTitlesInGroup = tabs.filter((tab) => tab.groupId === groupId).map((tab) => tab.title);
  //         const groupName = generateGroupNames(tabTitlesInGroup);

  //         chrome.tabGroups.update(group, { title: groupName });
  //       }
  //     });

  //   }
  // };


  const groupTabs = () => {
    // if no api key is set, alert the user
    chrome.storage.sync.get('apiKey', key => {
      if (key.apiKey === "" || key.apiKey === undefined) {
        alert("Please set your Cohere API key in the options page");
      }
    });

    // if has api key, and tabs are available, group them
    if (tabs) {

      const tabIds = tabs.map((tab) => tab.id || -1);
      const tabTitles = tabs.map((tab) => tab.title || "");

      chrome.storage.sync.get('apiKey', (key) => {
        // Set up the request to send to the endpoint
        const apikey = key.apiKey;

        const embeddingOptions = {
          "method": "POST",
          "headers": {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + apikey,
            "Request-Source": "sandbox-condense"
          },
          "body": JSON.stringify({
            "model": "embed-english-v2.0",
            "texts": tabTitles,
          })
        };

        

        fetch('https://api.cohere.ai/v1/embed', embeddingOptions)
          .then((response) => response.json())
          .then((response) => {

            ////////////// TAB CLUSTERING //////////////
            const embeddings = response.embeddings;
            // a reasonable init of k is sqrt(n)/2
            const k = Math.floor(Math.sqrt(tabTitles.length) / 2);
            const kmeans_result = kmeans(embeddings, k, {});
            const clusters = kmeans_result.clusters;

            const clusterDict: { [key: number]: number[] } = {};
            for (let i = 0; i < k; i++) {
              clusterDict[i] = [];
            }

            for (let i = 0; i < clusters.length; i++) {
              clusterDict[clusters[i]].push(tabIds[i]);
            }

            ((Object.keys(clusterDict) as unknown) as number[]).forEach(async (clusterId) => {
              const tabIdsInGroup = clusterDict[clusterId];
              if (tabIdsInGroup.length > 1) {
                const group = await chrome.tabs.group({ tabIds: tabIdsInGroup });
                // get tab titles for each in tabIdsInGroup
                const tabTitlesInGroup = tabIdsInGroup.map((tabId) => tabs.filter((tab) => tab.id === tabId)[0].title || "");

                ////////////// GENERATE GROUP NAME //////////////
                const generateOptions = {
                  "method": "POST",
                  "headers": {
                    "Accept": "application/json",
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + apikey,
                    "Request-Source": "sandbox-condense"
                  },
                  "body": JSON.stringify({
                    "model": "command",
                    "prompt": `Given a list of browsing tab titles:
                    [${tabTitlesInGroup.join(", ")}]
                    If there is a common theme or topic that connects multiple tab titles, generate a 1-3 word name that represents that common theme/topic.
                    If there is no clear common theme, generate "Others" as the name.
                    The name should be descriptive yet simple. Do not just repeat one of the exact tab titles as the name.
                    Some examples:
                    Input:
                    [Python Tutorial, Python Strings, Python Lists, Python Dictionary]
                    Output:
                    Python
                    Input:
                    [Yosemite Camping, California Wildflowers, Yosemite Hikes, Yosemite Weather]
                    Output:
                    Yosemite
                    Input:
                    [Amazon, YouTube, Facebook, Google]
                    Output:
                    Major Websites
                    Input:
                    [Recipe - Chicken Salad, Weather - Tampa FL, News - Politics, Facebook]
                    Output:
                    Others`,
                    "max_tokens": 12,
                  })
                };
                fetch('https://api.cohere.ai/v1/generate', generateOptions)
                .then((response) => response.json())
                .then((response) => {
                  const groupName = response.generations[0].text;
                  chrome.tabGroups.update(group, { title: groupName });
                });

              }
            });


            


            // log type of embeddings
          });
      });
    }
  }


  // return a button that groups the tabs if api key is set, else return a input field to set the api key
  return (
    <div>
      <button onClick={groupTabs}>Group tabs</button>
    </div>
  )


};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
