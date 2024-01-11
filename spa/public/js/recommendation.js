async function loadRecommenationsPage(query) {
  const token = JSON.parse(window.localStorage.getItem("token"))

  if (!token){
    
  }
  const response = await fetch('http://localhost:5000/recommendation?'+query,{
    headers: {"Content-Type": "application/json",
              "Authorization": "Bearer "+token
              }
  })
  .then (function(response){
    const result = response.json()
    console.log(result)
    return result

      .then(function(movies){
        const bodyDiv = document.querySelector('.container#entry-page')
        bodyDiv.innerHTML = ""
        const title = document.createElement("h3")
        title.innerText = " Recommenations"
        bodyDiv.appendChild(title)
        if(isLoggedin()){
          loadSearchBar(bodyDiv)

        }

        const table = document.createElement('table')
        bodyDiv.appendChild(table)

        const thead = document.createElement('thead')
        table.appendChild(thead)

        const trh = document.createElement('tr')
        thead.appendChild(trh)

        const tdh1 = document.createElement('th')
        tdh1.innerText = "Title"
        trh.appendChild(tdh1)

        const tdh2 = document.createElement('th')
        tdh2.innerText = "Genres"
        trh.appendChild(tdh2)

        const tbody = document.createElement('tbody')
        table.appendChild(tbody)

        console.log(movies[3])


        for (const movie of movies){
          console.log(movie)

          const tr = document.createElement('tr')
          tbody.appendChild(tr)

          const td1 = document.createElement('td')
          const td1Anchor = document.createElement('a')
          td1Anchor.href = "http://www.imdb.com/title/tt"+movie[2]
          td1Anchor.target = "_blank"
          td1.appendChild(td1Anchor)
          td1Anchor.innerText = movie[1]
          tr.appendChild(td1)

          const td2 = document.createElement('td')
          td2.innerText = movie[0]
          tr.appendChild(td2)

          const td4 = document.createElement("td")
          tr.appendChild(td4)

          const subTr1 = document.createElement("tr")
          td4.appendChild(subTr1)

          const subTd1 = document.createElement('td')
          subTr1.appendChild(subTd1)

        }
      })
      
    }).catch (function(error){
      const bodyDiv = document.querySelector('.container#entry-page')
      const p = document.createElement("p")
      p.innerText=error
      bodyDiv.appendChild(p)
    })
    
}