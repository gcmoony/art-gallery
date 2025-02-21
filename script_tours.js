// Get all the cards
const tourCards = document.querySelectorAll(".tour-card")
// Get all the card images
const cardImgs = document.querySelectorAll(".tour-card img")

// Get all the card links
const cardLinks = document.querySelectorAll(".tour-card a")

// Get all the card Titles
const cardTitles = document.querySelectorAll(".card-details h3")

// Get all the card desc
const cardDesc = document.querySelectorAll(".card-details p")

// Get pagination
const [prev, next] = document.querySelectorAll(".pagination button")
next.addEventListener("click", getNextPage)
prev.addEventListener("click", getPrevPage)

// Get pagination numbers
let [currPage, totalPages] = document.querySelectorAll(".page-num")

// console.log(cardTitles)

// Get tour list from API
const URL =
  "https://api.artic.edu/api/v1/tours?fields=id,title,image,description,intro"
let pageNum = 1
const limit = 12
let maxPages = 0
async function getTourList() {
  let builtUrl = `${URL}&page=${pageNum}&limit=${limit}`

  const res = await fetch(builtUrl)
  const res_json = await res.json()
  const data = await res_json.data

  // Rebuild all the cards
  let i = 0
  for (i = 0; i < data.length; i++) {
    updateCardInfo(i, data[i])
  }
  let remainderCards = limit - i

  // Display necessary cards
  for (let i = 0; i < limit; i++) {
    displayCard(i)
  }

  // Hide unecessary cards
  for (let i = limit - remainderCards; i < limit; i++) {
    hideCard(i)
  }

  // Update page values
  maxPages = await res_json.pagination.total_pages
  currPage.innerText = pageNum
  totalPages.innerText = maxPages
}
function hideCard(cardIndex) {
  tourCards[cardIndex].classList.add("hidden")
}

function displayCard(cardIndex) {
  tourCards[cardIndex].classList.remove("hidden")
}

function updateCardInfo(cardIndex, data) {
  cardImgs[cardIndex].setAttribute("src", data.image)

  cardTitles[cardIndex].innerText = data.title

  cardDesc[cardIndex].innerText = data.description.replace(
    /<[^>]+>|&[^;]+;/g,
    ""
  )
}

function getNextPage() {
  if (pageNum + 1 == maxPages) {
    next.disabled = true
  }
  pageNum += 1
  getTourList()
  prev.disabled = false
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

function getPrevPage() {
  if (pageNum - 1 == 1) {
    prev.disabled = true
  }
  pageNum -= 1
  next.disabled = false
  getTourList()
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

document.addEventListener("DOMContentLoaded", getTourList)
