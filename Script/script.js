const wordListDiv = document.getElementById('wordList');
const wordInput = document.getElementById('wordInput');
const modifiedSentenceDiv = document.getElementById('modifiedSentence');
let addedWords = [];
downloadBtn.disabled = true;
      

      

function addWord() {
  const word = wordInput.value.trim();
  if (word !== '') {
    const wordDiv = document.createElement('div');
    wordDiv.classList.add('word');

    const wordText = document.createElement('span');
    wordText.textContent = word;
    wordDiv.appendChild(wordText);

    const removeBtn = document.createElement('span');
    removeBtn.textContent = 'x';
    removeBtn.classList.add('remove-btn');
    removeBtn.onclick = () => removeWord(wordDiv);
    wordDiv.appendChild(removeBtn);

    wordListDiv.appendChild(wordDiv);
    wordInput.value = '';

    addedWords.push(word);
    console.log(addedWords);
  }
}

function removeWord(wordDiv) {
  const word = wordDiv.textContent.trim().replace(/x/g, '');
  const index = addedWords.indexOf(word);
  if (index !== -1) {
    addedWords.splice(index, 1);
  }
  wordListDiv.removeChild(wordDiv);
  console.log(index);
  console.log(addedWords);
  console.log(word);
}

function searchAndModify() {
  const modifiedSentence = modifySentence(addedWords);
  displayModifiedSentence(modifiedSentence);

  // Call the ChatGPT API and get the modified sentence
  callChatGPTAPI(modifiedSentence);
}

function modifySentence(words) {
  // Modify the sentence using the added words
  // Replace this with your desired logic for modifying the sentence
  const modifiedSentence = `What can I cook with these ingredients pare? ${words.join(', ')}.`;
  return modifiedSentence;
}

function displayModifiedSentence(sentence) {
  modifiedSentenceDiv.textContent = sentence;
}

function callChatGPTAPI(text) {
  
  const apiKey = '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';
  const model = 'gpt-3.5-turbo'
  // Make an API call to ChatGPT API with the text
  // Replace 'https://api.openai.com/v1/engines/davinci-codex/completions' with the appropriate API endpoint
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
    //   max_tokens: 100,
      model: model, 
      messages: [{"role": "system", "content": text}]
    })
  })
  .then(response => response.json())
  .then(data => {
    const responseText = data.choices[0].message.content;
    const formattedResponse = responseText.replace(/\n/g, '<br>');
    
    displayAPIResponse(formattedResponse); // Call the displayAPIResponse function with the API response
    downloadBtn.disabled = false;
  })
  .catch(error => console.error('Error:', error));
}

function displayAPIResponse(responseText) {
    
    const responseContainer = document.getElementById('apiResponse');
    // const responseDiv = document.createElement('div');
    responseContainer.textContent = `${responseText}`;
    // responseContainer.appendChild(responseDiv);
    responseContainer.innerHTML = responseText;

    console.log(responseText);
}

document.addEventListener('DOMContentLoaded', function () {
  const downloadBtn = document.getElementById('downloadBtn');
  const content = document.getElementById('apiResponse');

  downloadBtn.addEventListener('click', function () {
      // Use html2canvas to capture the content of the div as an image
      html2canvas(content).then(function (canvas) {
          // Convert the canvas to a data URL
          const imgData = canvas.toDataURL('image/png');
          
          // Create a link element to trigger the download
          const link = document.createElement('a');
          link.href = imgData;
          link.download = 'Recipe.png';
          link.click();
      });
  });
});
