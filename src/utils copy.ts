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

export async function getGroupIdsForTabs(tabs: chrome.tabs.Tab[]): Promise<{ [key: number]: number[] }> {

    const tabIds = tabs.map((tab) => tab.id || -1);
    const tabTitles = tabs.map((tab) => tab.title || "");
    const embeddings = await embedTabTitles(tabTitles);
    console.log('2')
    console.log(embeddings)
    const groupDict = clusterEmbeddings(tabIds, embeddings);

    return groupDict;
}



async function embedTabTitles(tabTitles: (string | undefined)[]): Promise<number[][]> {
    // replace undefined with empty string
    tabTitles = tabTitles.map((title) => title || "");
    let embeddings: number[][] = [];

    chrome.storage.sync.get('apiKey', async (key) => {
        // Set up the request to send to the endpoint
        const apikey = key.apiKey;

        const options = {
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

        const response = await fetch('https://api.cohere.ai/v1/embed', options)
        const data = await response.json();
        embeddings = data.embeddings;
        console.log('1')
        console.log(embeddings);

    });
    return embeddings;
}




function clusterEmbeddings(tabIds: number[], embeddings: (number[][])): { [key: number]: number[] } {
    if (!embeddings) {
        return {};
    }
    const kmeans = require('ml-kmeans');
    // a reasonable init of k is sqrt(n/2)
    const k = Math.floor(Math.sqrt(tabIds.length / 2));
    const kmeans_result = kmeans(embeddings, k);
    const clusters = kmeans_result.clusters;

    const clusterDict: { [key: number]: number[] } = {};
    for (let i = 0; i < k; i++) {
        clusterDict[i] = [];
    }

    for (let i = 0; i < clusters.length; i++) {
        clusterDict[clusters[i]].push(tabIds[i]);
    }

    return clusterDict;

}





export function generateGroupNames(tabTitles: (string | undefined)[]): string {
    const groupName = "ALOHAHAHA";
    return groupName;
}