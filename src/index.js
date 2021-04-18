//Step 1 Get the relevant Data
//Step 2 Create components with the data
//Append component to the DOM



const url = "http://localhost:3000/pups"

document.addEventListener("DOMContentLoaded", init)

function getDogs () {
    const url = `http://localhost:3000/pups`
    return fetch(url)
    .then(res => res.json())
   
}

function getSingleDog(id){
    return fetch(url + `/${id}`)
      .then(r => r.json())
  }

  function init(e){
    const filterDogsButton = document.querySelector("#good-dog-filter")
    filterDogsButton.addEventListener("click", toggleFilterDogs)
    getDogs().then(addAllDogsToDogBar)
  }

function addDogSpantoDogBar(dog){
    const dogBar = document.querySelector("#dog-bar")
    const dogSpan = document.createElement("span")
    dogSpan.innerText = dog.name
    dogSpan.dataset.id = dog.id
  
    dogSpan.addEventListener("click", onDogSpanClick)
  
    dogBar.append(dogSpan)
  }

  function onDogSpanClick(e){
    getSingleDog(e.target.dataset.id)
      .then(addDogInfoToPage)
  }
  
  function addDogInfoToPage(dog){
    const dogInfo = document.querySelector("#dog-info")
    dogInfo.innerHTML = ""
    const dogImg = document.createElement("img")
    dogImg.src = dog.image
  
    const dogTitle = document.createElement("h2")
    dogTitle.innerText = dog.name
  
    const dogButton = document.createElement("button")
    dogButton.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
    dogButton.dataset.id = dog.id
    dogButton.addEventListener("click", onGoodDogButtonClick)
  
    dogInfo.append(dogImg, dogTitle, dogButton)
  }

  function addAllDogsToDogBar(dogArray, filter = false){
    const dogBar = document.querySelector("#dog-bar")
    dogBar.innerHTML = ""
    if (filter) {
      dogArray.filter(dog => dog.isGoodDog).forEach(addDogSpantoDogBar)
    } else {
      dogArray.forEach(addDogSpantoDogBar)
    }
  }

  function onGoodDogButtonClick(e){
    let newValue;
    if (e.target.innerText.includes("Good")){
      e.target.innerText = "Bad Dog"
      newValue = false
    } else {
      e.target.innerText = "Good Dog"
      newValue = true
    }
    toggleGoodDog(e.target.dataset.id, newValue).then(updateDogBar)
  }

  function updateDogBar(){
    const filterDogsButton = document.querySelector("#good-dog-filter")
    if (filterDogsButton.innerText.includes("OFF")){
      getDogs().then(dogArray => addAllDogsToDogBar(dogArray))
    } else {
      getDogs().then(dogArray => addAllDogsToDogBar(dogArray, true))
    }
  }

  function toggleFilterDogs(e){
    const filterDogsButton = document.querySelector("#good-dog-filter")
    if (filterDogsButton.innerText.includes("OFF")){
      filterDogsButton.innerText = "Filter good dogs: ON"
      updateDogBar()
    } else {
      filterDogsButton.innerText = "Filter good dogs: OFF"
      updateDogBar()
    }
  }

  function toggleGoodDog(id, newValue){
    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: newValue
      })
    }
    return fetch(url + `/${id}`, options)
      .then(r => r.json())

}