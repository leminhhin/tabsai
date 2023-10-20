# TabsAI

An AI-based Chrome extension for tab management by clustering tabs based on content similarity and leveraging large language models to generate descriptive names for each tab group.

## Features

- Automatically groups open tabs into categories based on tab content similarity using Cohere Embed API and K-Means clustering
- Generates clear, descriptive names for each tab group using Cohere Generate API

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Open Chrome and navigate to `chrome://extensions`
5. Enable developer mode
6. Click "Load unpacked" and select the `dist` folder from this repository
7. If you do not already have a Cohere API key, sign up for a free account at https://dashboard.cohere.com/welcome/register
8. Copy your API key from the Cohere dashboard and paste it into the "API Key" field in the TabsAI's extension options
9. Click "Save" and you're ready to go!

## Usage

After installing TabsAI, simply browse the web normally opening new tabs as you need them. If you want to group tabs, click the "Group tabs" button in the TabsAI sidebar. This will group your tabs based on content similarity and generate names for each group.
