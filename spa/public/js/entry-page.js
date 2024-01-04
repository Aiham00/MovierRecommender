
function loadEntry() {
    const bodyDiv = document.querySelector('.container#entry-page')
    bodyDiv.innerHTML=""
    const loginCardDiv = document.createElement("div")
    
    const divHeader = document.createElement("h3")
    divHeader.innerText = "MovieRecommender"
    loginCardDiv.appendChild(divHeader)

    const leadDiv = document.createElement("div")
    leadDiv.innerText = "A way for obtaining a good movie recommendation for two users"
    loginCardDiv.appendChild(leadDiv)

    const anchorLogin = document.createElement("a")
    anchorLogin.innerText = "Login"
    handleAnchorOnClick(anchorLogin,"/entry/login")
    loginCardDiv.appendChild(anchorLogin)

    const p = document.createElement("p")
    p.innerText = "Or"
    loginCardDiv.appendChild(p)

    const signUpanchor = document.createElement("a")
    signUpanchor.innerText ="Sign Up!"
    handleAnchorOnClick(signUpanchor,"/entry/sign-up")
    loginCardDiv.appendChild(signUpanchor)
    bodyDiv.appendChild(loginCardDiv)
}

function creatInlineInputDiv(id,name,type,labelText){
    const div = document.createElement("div")
    div.classList.add("input-field")
    div.classList.add("inline")

    const input = document.createElement("input")
    input.id = id
    input.type = type
    input.classList.add("validate")
    input.name = name
    div.appendChild(input)

    const label = document.createElement("label")
    label.setAttribute("for",id)
    label.innerText = labelText
    div.appendChild(label)

    const span = document.createElement("span")
    span.classList.add("helper-text-"+id)
    span.setAttribute("data-error","wrong")
    span.setAttribute("data-success","right")
    span.id = "helper-text"
    div.appendChild(span)
    return div
}

function loadSignupPage(){
    const bodyDiv = document.querySelector('.container#entry-page')
    bodyDiv.innerHTML=""

    const pageTitle = document.createElement("h3")
    pageTitle.innerText = "Join Us"
    bodyDiv.appendChild(pageTitle)

    const div = document.createElement("div")
    bodyDiv.appendChild(div)

    const inlineDivFirstName = creatInlineInputDiv("first-name","firstName","text","First Name")
    div.appendChild(inlineDivFirstName)

    const inlineDivLastName = creatInlineInputDiv("last-name","lastName","text","Last Name")
    div.appendChild(inlineDivLastName)

    const inlineDivMobile = creatInlineInputDiv("mobile_number","mobileNumber","text","Mobile")
    div.appendChild(inlineDivMobile)

    const inlineDivEmail = creatInlineInputDiv("email","email","email","Email")
    div.appendChild(inlineDivEmail)

    const inlineDivPassword = creatInlineInputDiv("password","password","password","Password")
    div.appendChild(inlineDivPassword)

    const inlineDivPasswordRepeat = creatInlineInputDiv("password-repeat","password-repea","password","Password(repeat)")
    div.appendChild(inlineDivPasswordRepeat)

    const button = document.createElement("button")
    button.innerText = "Submit"
    div.appendChild(button)
    button.addEventListener('click', function(e){
        e.preventDefault()

        const user = {
          firstName: inlineDivFirstName.firstChild.value,
          lastName: inlineDivLastName.firstChild.value,
          mobileNumber: inlineDivMobile.firstChild.value,
          email: inlineDivEmail.firstChild.value,
          password: inlineDivPassword.firstChild.value,
          passwordRepeat: inlineDivPasswordRepeat.firstChild.value
          
        }
                    
        signup(user)
        
        
      })

}


  async function signup(user){
    const bodyDiv = document.querySelector('.container#entry-page')
    const errorDiv = document.createElement("div")
    bodyDiv.appendChild(errorDiv)
      const response = await fetch("http://localhost:5000/account/signup",{
      method: "POST",
      headers: {"Content-Type": "application/json",
                },
      body: JSON.stringify(
        { firstName: user.firstName,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
          email: user.email,
          password: user.password,
          passwordRepeat: user.passwordRepeat
        })
    }).then (function(response){
      return response.json()
    
      .then(function(result){
        showPage("/entry/login")

      })
      
    }).catch (function(error){
      errorDiv.innerHTML = ""
      const p = document.createElement("p")
      p.innerText=error
      errorDiv.appendChild(p)
    })
  }


async function loadLogoutPage(){
  const bodyDiv = document.querySelector('.container#entry-page')
  bodyDiv.innerHTML=""

  const title = document.createElement("h3")
  title.innerText = "Logout"
  bodyDiv.appendChild(title)
  const p = document.createElement("p")
  p.innerText = "Are you sure you want to logout"
  bodyDiv.appendChild(p)

  const noAnchor = document.createElement("a")
  noAnchor.innerText = "No, go to home page!"
  noAnchor.setAttribute("href", "/")
  bodyDiv.appendChild(noAnchor)
  handleAnchorOnClick(noAnchor,"/")

  const yesAnchor = document.createElement("a")
  yesAnchor.innerText = "Yes,Logout"
  yesAnchor.setAttribute("href", "/")
  bodyDiv.appendChild(yesAnchor)
  
    yesAnchor.addEventListener('click', function(e){
    e.preventDefault()
    window.localStorage.setItem("token",false)
    hideCurrentPage()
    showPage("/")

    })

}
async function loadLoginPage(){

  const bodyDiv = document.querySelector('.container#entry-page')
  bodyDiv.innerHTML=""

  const title = document.createElement("h3")
  title.innerText = "Login"
  bodyDiv.appendChild(title)

  const emailInputDiv = creatInlineInputDiv("email","email","email","Email")
  bodyDiv.appendChild(emailInputDiv)
  const passwordInputDiv = creatInlineInputDiv("password","password","password","Password")
  bodyDiv.appendChild(passwordInputDiv)

  const button = document.createElement("button")
  button.innerText = "Submit"
  bodyDiv.appendChild(button)
  button.addEventListener('click', function(e){
      e.preventDefault()
      login(emailInputDiv.firstChild.value,passwordInputDiv.firstChild.value)
        
  })
}

async function login(email,password){
  const bodyDiv = document.querySelector('.container#entry-page')
  const errorDiv = document.createElement("div")
  bodyDiv.appendChild(errorDiv)
  const response = await fetch("http://localhost:5000/account/signin",{
    method: "POST",
    headers: {"Content-Type": "application/json",
              },
    body: JSON.stringify(
      { grant_type: "password",
        email,
        password
      })
  }).then (function(response){
    return response.json()
  
    .then(function(result){
      window.localStorage.setItem("token",JSON.stringify(result.access_token))
      showPage("/")
    })
    
  }).catch (function(error){
console.log(error)
    errorDiv.innerHTML = ""
      const p = document.createElement("p")
      p.innerText=error
      errorDiv.appendChild(p)
  })
}

