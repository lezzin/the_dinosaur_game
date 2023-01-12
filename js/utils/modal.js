const myModal = {
    modal: document.querySelector(".modal"),

    open: () => myModal.modal.classList.add("active"),
    close: () => myModal.modal.classList.remove("active"),
    toggle: () => myModal.modal.classList.toggle("active"),
}

export default myModal;