import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Options = () => {
    const [apiKey, setApiKey] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        // Restores select box and checkbox state using the preferences
        // stored in chrome.storage.
        chrome.storage.sync.get(
            {
                favoriteColor: "red",
                likesColor: true,
                apiKey: "",
            },
            (items) => {
                setApiKey(items.apiKey);
            }
        );
    }, []);

    const saveOptions = () => {
        // Saves options to chrome.storage.sync.
        chrome.storage.sync.set(
            {
                apiKey: apiKey,
            },
            () => {
                // Update status to let user know options were saved.
                setStatus("Options saved.");
                const id = setTimeout(() => {
                    setStatus("");
                }, 1000);
                return () => clearTimeout(id);
            }
        );
    };

    return (
        <>
            <div>
                <label> Cohere API Key: </label>
                <input
                    type="text"
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                />
            </div>


            <div>{status}</div>
            <button onClick={saveOptions}>Save</button>
        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>
);