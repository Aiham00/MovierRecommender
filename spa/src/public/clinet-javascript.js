document.addEventListener('DOMContentLoaded', function () { 

    const mainListId = "vf-main-list"
    const logoId = "vf-logo"
    const largClass = "hide-on-med-and-down"
    const logoPositionClass = "right"
    const newLogoPositionClass = "center"
    const menuLinkId = "menu-link"
    const menuSymbolId = "menu-symbole"
    const menuSymboleClass = "fa-bars"
    const menuLinkClass = "show-on-small"
    const logo = document.querySelector("#" + logoId)
    const mainUl = document.querySelector("#" + mainListId)
    const menuLink = document.querySelector("#" + menuLinkId)
    const menuSymbole = document.querySelector("#" + menuSymbolId)

    if (logo.classList.contains(logoPositionClass)) {
        logo.classList.remove(logoPositionClass)
    }
    
    logo.classList.add(newLogoPositionClass)
    mainUl.classList.add(largClass)
    menuLink.classList.add(menuLinkClass)
    menuSymbole.classList.add(menuSymboleClass)
    M.Sidenav.init(document.querySelector('.sidenav'))
})
