import { useState, useEffect } from "react";

/**
 * Custom hook to manage the URL of a PDF file for use in an iframe.
 *
 * @description This hook takes a `fileUrl` as an input and provides an `iframeUrl` state that is updated with the given URL. The `iframeUrl` is used to display the PDF in an iframe component. The hook updates the `iframeUrl` whenever the `fileUrl` changes.
 *
 * @param {string} fileUrl - The URL of the PDF file to be displayed in the iframe.
 * 
 * @returns {string} The URL of the PDF file to be used as the `src` attribute of an iframe.
 */
const usePdfIframe = (fileUrl) => {
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    if (fileUrl) {
      setIframeUrl(fileUrl);
    }
  }, [fileUrl]);

  return iframeUrl;
};

export default usePdfIframe;
