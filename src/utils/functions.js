export function scrollIntoView(selector, behaviour = "smooth") {
  const elem = document.querySelector(selector);
  elem.scrollIntoView({ behaviour });
  elem.focus();
}

export function toggleClass(bool, elem, className) {
  bool ? elem.classList.add(className) : elem.classList.remove(className);
}

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
 * @description format given array of strings by replacing certain 
 * charecter with desireed HTML elements
 * @param {array} contentArray 
 * @returns string || empty string
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
