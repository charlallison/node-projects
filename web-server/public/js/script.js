// console.log('Clientside javascript file is loaded.')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const paragraph = document.querySelector('#message-1')
const paragraphTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value;

    paragraph.textContent = 'loading message...'
    paragraphTwo.textContent = ''

    fetch('/weather?address='+location).then((res) => {
        res.json().then((data) => {
            if(data.error) {
                // console.log(data.error)
                paragraph.textContent = data.error
            } else {
                paragraph.textContent = data.location
                paragraphTwo.textContent = data.forecast
            }
        })
    })
})