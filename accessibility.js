const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');

// Aarray of HTML tags that can contain accessibility attributes
const accessibilityTags = ['a', 'button', 'input', 'img', 'video'];

// Common accessibility attributes
const accessibilityAttrs = {
  alt: '',
  title: '',
  ariaLabel: '',
  ariaDescribedby: '',
  ariaHidden: 'false'
};

// Add accessibility attributes to a tag
function addAccessibilityAttrs($tag) {
  for (let attrName in accessibilityAttrs) {
    if (!$tag.attr(attrName)) {
      $tag.attr(attrName, accessibilityAttrs[attrName]);
    }
  }
}

// Read the HTML file and parse it using Cheerio
// Change first argument to file path '../Golf-scorecard/index.html' -> './index.html'
const html = fs.readFileSync('../Golf-scorecard/index.html', 'utf8');
const $ = cheerio.load(html);

// Array to store target tags missing accessibility attributes
const missingAttrs = [];

// This is not working --------------------------------------------
// // Iterate over each line in the HTML file
// $('body').contents().each((i, line) => {
//   if (line.type === 'text') {
//     return;
//   }

//   const $tag = $(el);
//   const tagName = $tag[0].name;

//   // Skip if tag is not a target attribute
//   if (!accessibilityTags.includes(tagName)) {
//     return;
//   }

//   // Skip if tag already has accessibility attributes
//   let hasAccessibilityAttrs = false;
//   for (let attrName in accessibilityAttrs) {
//     if ($tag.attr(attrName)) {
//       hasAccessibilityAttrs = true;
//       break;
//     }
//   }
//   if (hasAccessibilityAttrs) {
//     return;
//   }
// ----------------------------------------------------------------

  // Add tag to the missingAttrs array
  missingAttrs.push($tag);
});

// Prompt the user to confirm change
if (missingAttrs.length > 0) {
  console.log(`${missingAttrs.length} tags missing accessibility attributes:`);
  missingAttrs.forEach($tag => console.log($tag[0].name, $tag.attr('class'), $tag.attr('id')));
  const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readLine.question(`Do you want to add accessibility attributes to these tags? (Y/N) `, (answer) => {
    if (answer.toLowerCase() === 'y') {
      // Add accessibility attributes to the missing tags
      missingAttrs.forEach($tag => addAccessibilityAttrs($tag));
      // Save the modified HTML file
      fs.writeFileSync('path/to/new/html/file.html', $.html());
      console.log(`Accessibility attributes added to ${missingAttrs.length} tags.`);
    } else {
      console.log('No changes were made.');
    }
    readLine.close();
  });
} else {
  console.log('All tags have accessibility attributes.');
}

