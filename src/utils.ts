export function getGroupIdsForTabsDummy(tabs: chrome.tabs.Tab[]): { [key: number]: number[] } {
    // alternate between 1 and 2
    // first half is group 1, second half is group 2
    // return a dictionary of group ids to list of tab ids

    const groupIds = [1, 2];
    const groupDict: { [key: number]: number[] } = {};
    groupIds.forEach((groupId) => {
        groupDict[groupId] = [];
    });

    const numTabs = tabs.length;
    const half = Math.floor(numTabs / 2);
    for (let i = 0; i < numTabs; i++) {
        const groupId = groupIds[i < half ? 0 : 1];
        groupDict[groupId].push(tabs[i].id!);
    }

    return groupDict;
}

export function getGroupIdsForTabs(tabs: chrome.tabs.Tab[]) {

//     const tabIds = tabs.map((tab) => tab.id || -1);
//     const tabTitles = tabs.map((tab) => tab.title || "");

//     chrome.storage.sync.get('apiKey', (key) => {
//         // Set up the request to send to the endpoint
//         const apikey = key.apiKey;

//         const options = {
//             "method": "POST",
//             "headers": {
//                 "Accept": "application/json",
//                 "Content-type": "application/json",
//                 "Authorization": "Bearer " + apikey,
//                 "Request-Source": "sandbox-condense"
//             },
//             "body": JSON.stringify({
//                 "model": "embed-english-v2.0",
//                 "texts": tabTitles,
//             })
//         };

//         fetch('https://api.cohere.ai/v1/embed', options)
//             .then((response) => response.json())
//             .then((response) => {
//                 const embeddings = response.embeddings;

//                 const kmeans = require('ml-kmeans');
//                 // a reasonable init of k is sqrt(n/2)
//                 const k = Math.floor(Math.sqrt(tabTitles.length / 2));
//                 const kmeans_result = kmeans(embeddings, k);
//                 const clusters = kmeans_result.clusters;

//                 const clusterDict: { [key: number]: number[] } = {};
//                 for (let i = 0; i < k; i++) {
//                     clusterDict[i] = [];
//                 }

//                 for (let i = 0; i < clusters.length; i++) {
//                     clusterDict[clusters[i]].push(tabIds[i]);
//                 }


                

//             });
//         });

}



export function generateGroupNames(tabTitles: (string | undefined)[]): string {
    const groupName = "ALOHAHAHA";
    return groupName;
}