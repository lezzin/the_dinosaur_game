const myLoader = {
    loader: document.querySelector(".loader"),

    open: () => myLoader.loader.classList.remove("inactive"),
    close: () => myLoader.loader.classList.add("inactive"),
}

export default myLoader;