/**
 * Scrolls the element specified by the selector into view.
 *
 * @description This function scrolls the page to bring the element matching the given CSS selector into view with the specified scrolling behavior. It also focuses on the element once it's in view.
 *
 * @param {string} selector - The CSS selector of the element to scroll into view.
 * @param {string} [behaviour="smooth"] - The scroll behavior, which can be "auto" or "smooth". Defaults to "smooth".
 */
export function scrollIntoView(selector, behaviour = "smooth") {
  const elem = document.querySelector(selector);
  elem.scrollIntoView({ behaviour });
  elem.focus();
}

/**
 * Toggles a class on an element based on a boolean value.
 *
 * @description This function adds or removes a CSS class from the given element based on the boolean value. If the boolean is `true`, the class is added; if `false`, the class is removed.
 *
 * @param {boolean} bool - The boolean value that determines whether to add or remove the class.
 * @param {Element} elem - The DOM element to which the class will be toggled.
 * @param {string} className - The name of the CSS class to add or remove.
 */
export function toggleClass(bool, elem, className) {
  bool ? elem.classList.add(className) : elem.classList.remove(className);
}

/**
 * Generates a random alphanumeric ID of a specified length.
 *
 * @description This function generates a random string of alphanumeric characters with the specified length using cryptographic randomness. It is useful for creating unique identifiers.
 *
 * @param {number} [length=10] - The length of the generated ID. Defaults to 10 if not provided.
 * @returns {string} The generated random ID.
 */
export function generateRandomId(length = 10) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  const randomValues = new Uint32Array(length);

  crypto.getRandomValues(randomValues);

  let randomId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % charactersLength;
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

/**
 * Formats an array of strings by replacing certain characters with HTML elements.
 *
 * @description This function processes an array of strings and replaces periods with `<br/>` and double newlines with `</p><p>` to create formatted HTML content. It returns a single string containing the formatted HTML.
 *
 * @param {string[]} contentArray - An array of strings to be formatted.
 * @returns {string} The formatted HTML string, or an empty string if the input is not a valid array or is empty.
 */
export const formatDetails = contentArray => {
  // Check if contentArray is an array and not empty
  if (Array.isArray(contentArray) && contentArray.length > 0) {
    // Join the array items into a single string with appropriate HTML tags
    return contentArray
      .map(item => {
        // Replace periods with <br/>
        const formattedItem = item.replace(/\./g, ".<br/><br/>");

        // Replace newlines with paragraph breaks
        return formattedItem.replace(/\n\n/g, "</p><p>");
      })
      .join(""); // Join all formatted strings into a single HTML string
  }
  return ""; // Return an empty string if contentArray is not valid
};

 /**
* Combines and processes multiple data sources into a single array.
*
* @description This method checks each data source to ensure it contains data before mapping over it.
* It then combines all the valid mapped data into a single array. The method supports different types of data,
* including PDF URLs and blog posts from multiple sources, and assigns a unique `type` and `id` to each item.
*
* @param {Object} pdfMetadata - An object containing an array of PDF metadata object.
* @param {Object} minopexData - An object containing an array of blog posts from the Minopex source.
* @param {Object} sayouthData - An object containing an array of blog posts from the SA Youth source.
* @param {Object} propersonnelData - An object containing an array of blog posts from the Pro Personnel source.
* @param {Object} govPagePublicData - An object containing an array of blog posts from the Government Public source.
* @param {Object} govPagePrivateData - An object containing an array of blog posts from the Government Private source.
*
* @returns {Array} A combined array of data objects, each with a `type` and `id` property, 
* representing either a PDF or a blog post from various sources.
*/
export function combineAllData(pdfMetadata, minopexData, sayouthData, propersonnelData, govPagePublicData, govPagePrivateData) {
 return [
   ...(pdfMetadata.length > 0
     ? pdfMetadata.map((metadata, index) => ({
         type: 'pdf',
         id: `pdf-${index}`,
         pdfImages: metadata.images,
       }))
     : []),

   ...(minopexData.blogPosts.length > 0
     ? minopexData.blogPosts.map((post, index) => ({
         ...post,
         type: 'post',
         id: `minopex-${index}`,
       }))
     : []),

   ...(sayouthData.blogPosts.length > 0
     ? sayouthData.blogPosts.map((post, index) => ({
         ...post,
         type: 'post',
         id: `sayouth-${index}`,
       }))
     : []),

   ...(propersonnelData.blogPosts.length > 0
     ? propersonnelData.blogPosts.map((post, index) => ({
         ...post,
         type: 'post',
         id: `propersonnel-${index}`,
       }))
     : []),

   ...(govPagePublicData.blogPosts.length > 0
     ? govPagePublicData.blogPosts.map((post, index) => ({
         ...post,
         type: 'post',
         id: `govpublic-${index}`,
       }))
     : []),

   ...(govPagePrivateData.blogPosts.length > 0
     ? govPagePrivateData.blogPosts.map((post, index) => ({
         ...post,
         type: 'post',
         id: `govprivate-${index}`,
       }))
     : []),
 ];
}
