// Get the image boxes
const galleryBoxes = document.querySelectorAll(".gallery-item")

// Get pagination buttons
const [prev, next] = document.querySelectorAll(".pagination button")

// Get pagination numbers
let [currPage, totalPages] = document.querySelectorAll(".page-num")

prev.addEventListener("click", () => {
  getPrevPage()
})

next.addEventListener("click", () => {
  getNextPage()
})

// Request the data from the api
const PUBLIC_URL =
  "https://api.artic.edu/api/v1/artworks/search?query[term][is_public_domain]=true&fields=id,title,image_id,is_public_domain&page="
let pageNum = 1
let maxPages = 0
const itemsToDisplay = 10
async function getImagePage() {
  currPage.innerText = pageNum
  let builtQuery = `${PUBLIC_URL}${pageNum}&limit=${itemsToDisplay}`

  const res = await fetch(builtQuery)
  const res_json = await res.json()
  const data = res_json.data

  // Set total page count
  if (totalPages.innerText == "?") {
    totalPages.innerText = res_json["pagination"]["total"]
    maxPages = res_json["pagination"]["total"]
  }

  // Generate the gallery
  for (let i = 0; i < data.length; i++) {
    galleryBoxes[i].classList.add("loading")
    galleryBoxes[i].style.backgroundImage = "None"
    regenerateGalleryItem(i, data)
  }
}

function regenerateGalleryItem(i, data) {
  // Set an image as box background
  let boxImageQuery = buildImageQuery(data[i]["image_id"])
  galleryBoxes[i].classList.remove("loading")
  galleryBoxes[i].style.backgroundImage = `url(${boxImageQuery})`

  // Remove old link
  if (galleryBoxes[i].hasChildNodes()) {
    galleryBoxes[i].removeChild(galleryBoxes[i].firstElementChild)
  }

  // Generate a clickable link, add to the gallery item
  let boxImageLink = data[i]["id"]
  let boxImageTitle = data[i]["title"]
  galleryBoxes[i].appendChild(createLinkElement(boxImageLink, boxImageTitle))
}

const PAGE_URL = "https://www.artic.edu/artworks/"
function createLinkElement(elementLink, artTitle) {
  // Generate a link to view image details
  let newElem = document.createElement("a")
  newElem.setAttribute("href", `${PAGE_URL}${elementLink}`)
  newElem.innerText = artTitle
  newElem.setAttribute("target", "_blank")
  return newElem
}

const IMG_URL = "https://www.artic.edu/iiif/2/"
function buildImageQuery(imageID) {
  return `${IMG_URL}${imageID}/full/843,/0/default.jpg`
}

// Pagination
function getNextPage() {
  if (pageNum + 1 == maxPages) {
    next.disabled = true
  }
  pageNum += 1
  getImagePage()
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
  getImagePage()
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

// Loads gallery on page load
document.addEventListener("DOMContentLoaded", getImagePage)
