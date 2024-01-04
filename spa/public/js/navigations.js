document.addEventListener('DOMContentLoaded', function(){
    
    const anchors = document.querySelectorAll('.vol-menu')

    for(const anchor of anchors){
        
        anchor.addEventListener('click', function(event){
            event.preventDefault()
            
            const url = anchor.getAttribute('href')
            
            history.pushState(null, "", url)
            
            hideCurrentPage()
            showPage(url)
        })
        
    }
    showPage(location.pathname)
    
})

window.addEventListener('popstate', function(){
    
    hideCurrentPage()
    showPage(location.pathname)
    
})

function hideCurrentPage(){
    document.querySelector('.current-page').classList.remove('current-page')

    
}

function showPage(url){

    updateBarLogStatus()
    let nextPageId
    
    switch(url){
        
        case '/':
            nextPageId = 'home-page'
            loadHomePage()
            break
        case '/entry/logout':
            nextPageId = 'logout-page'
            loadLogoutPage()
            break
        case '/entry':
            nextPageId = 'entry-page'
            loadEntry()
            break
        case '/entry/login':
            nextPageId = 'entry-page'
            loadLoginPage()
            break
        case '/entry/sign-up':
            nextPageId = 'entry-page'
            loadSignupPage()
            break
        
        default:
            if(url.startsWith("/recommendation?")){
                let [empty, query] = url.split("?")
                /*if(!query){
                    query = "userId1=2&userId2=3&type=true"
                }*/
                nextPageId = 'recommendation-page'
                loadRecommenationsPage(query)

            }else if(url.startsWith("/entry/")){
                const [empty, entry, id] = url.split("/")
                nextPageId = 'entry-page'
                loadAcountInfoPage(id)
            }else{
                nextPageId = 'not-found-page'
            }
        
    }
    
    document.getElementById(nextPageId).classList.add('current-page')
    
}
function loadSearchBar(bodyDiv){
    //const bodyDiv = document.querySelector('.container#entry-page')

    const divContainer = document.createElement("div")
    divContainer.classList.add("container")
    bodyDiv.appendChild(divContainer)

    const divNav = document.createElement("div")
    divNav.classList.add("nav-wrapper")
    divNav.classList.add("container")
    divContainer.appendChild(divNav)

    const form = document.createElement("form")
    form.classList.add("browser-default")
    form.classList.add("center")
    divNav.appendChild(form)

    const input = document.createElement("input")
    input.classList.add("browser-default")
    input.classList.add("large")
    input.classList.add("search-field")
    input.id="search-input"
    input.type="text"
    input.name="user2"
    input.value=""
    form.appendChild(input)

    const submitButton = document.createElement("a")
    submitButton.classList.add("btn-floating")
    submitButton.classList.add("btn-medium")
    submitButton.classList.add("waves-effect")
    submitButton.classList.add("waves-light")
    submitButton.classList.add("blacke")
    submitButton.id="search-button"
    form.appendChild(submitButton)

    const checkboxParagraph = document.createElement("p")
    const checkboxlabel = document.createElement("label")
    checkboxParagraph.appendChild(checkboxlabel)
    const checkboxInput = document.createElement("input")
    checkboxInput.type = "checkbox"
    checkboxlabel.appendChild(checkboxInput)
    const checkboxSpan = document.createElement("span")
    checkboxSpan.innerText = "Allow one user watching"
    checkboxlabel.appendChild(checkboxSpan)
    form.appendChild(checkboxParagraph)

    /**    <p>
      <label>
        <input type="checkbox" checked="checked" />
        <span>Yellow</span>
      </label>
    </p> */
    const buttonIcon = document.createElement("i")
    buttonIcon.classList.add("material-icons")
    buttonIcon.classList.add("search-icon")
    buttonIcon.innerText ="search"
    submitButton.appendChild(buttonIcon)
    
    submitButton.addEventListener('click', function(e){
        e.preventDefault()
        const userId2 = input.value.trim()
        const type = !checkboxInput.checked
        const query = "userId2="+userId2+"&type="+type
        const url = "/recommendation?"+query
        history.pushState(null, "", url)
        hideCurrentPage()
        showPage(url)
      })
}
function loadHomePage(){

    const bodyDiv = document.querySelector('.container#entry-page')
    bodyDiv.innerHTML=""

    const title = document.createElement("H3")
    title.innerText ="Home"
    bodyDiv.appendChild(title)
    if(isLoggedin()){
        loadSearchBar(bodyDiv)

    }
    else{
        const paragraph = document.createElement("p")
        paragraph.innerText ="Please login to be able to search for movies recommendations"
        bodyDiv.appendChild(paragraph)
    }

}

function updateBarLogStatus(){

    const logOutbutton = document.querySelector("a#logout-page ")
    const entrybutton = document.querySelector("a#entry-page ")
    const recommendationButton = document.querySelector("a#recommendation-page ")
    const token = window.localStorage.getItem("token")
    if (token){
        if (JSON.parse(token)){
            logOutbutton.classList.remove("vol-menu-hidden")
            entrybutton.classList.add("vol-menu-hidden")
            recommendationButton.classList.remove("vol-menu-hidden")
        }    else{
            entrybutton.classList.remove("vol-menu-hidden")
            logOutbutton.classList.add("vol-menu-hidden")
            recommendationButton.classList.add("vol-menu-hidden")
        }
    }
    else{
        entrybutton.classList.remove("vol-menu-hidden")
        logOutbutton.classList.add("vol-menu-hidden")
    }
}
function handleAnchorOnClick(anchor,url){
    anchor.setAttribute('href', url)
    anchor.addEventListener('click', function(e){
      e.preventDefault()
                  
      history.pushState(null, "", url)
      
      hideCurrentPage()
      showPage(url)
      
    })
  }

 function isLoggedin(){
    const token = JSON.parse(window.localStorage.getItem("token"))
    if(!token){
        return false
    }
    return decode(token).includes("isLoggedin")
 }
const decode = token =>
decodeURIComponent(atob(token.split('.')[1].replace('-', '+').replace('_', '/')).split('').map(c =>
`%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));