const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";

const tamu = prompt("Siapakah Anda ?");
alert("Selamat Datang di Bookshelf Apps," + "" + "" + tamu + "!");

document.addEventListener("DOMContentLoaded", () => {
  const simpanForm = document.getElementById("formDataBuku");
  simpanForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    alert("Buku Ditambahkan");
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const resetBtn = document.querySelector(".reset-btn");
  resetBtn.addEventListener("click", function (event) {
    document.getElementById("pencarian").value = "";
    event.preventDefault();
    searchBook();
  });

  const searchForm = document.getElementById("formSearch");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });
});

const searchBook = () => {
  const searchInput = document.getElementById("pencarian").value.toLowerCase();
  const bookItems = document.getElementsByClassName("item");

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector(".item-title");
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].classList.remove("hidden");
    } else {
      bookItems[i].classList.add("hidden");
    }
  }
};

const addBook = () => {
  const bookTitle = document.getElementById("judul");
  const bookAuthor = document.getElementById("penulis");
  const bookYear = document.getElementById("tahun");
  const bookHasFinished = document.getElementById("isRead");
  let bookStatus;

  if (bookHasFinished.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  books.push({
    id: +new Date(),
    title: bookTitle.value,
    author: bookAuthor.value,
    year: Number(bookYear.value),
    isComplete: bookStatus,
  });

  bookTitle.value = null;
  bookAuthor.value = null;
  bookYear.value = null;
  bookHasFinished.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

document.addEventListener(SAVED_EVENT, function () {
  localStorage.getItem(STORAGE_KEY);
});

const makeBookElement = (bookObject) => {
  const elementBookTitle = document.createElement("p");
  elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;
  elementBookTitle.classList.add("item-title");

  const elementBookAuthor = document.createElement("p");
  elementBookAuthor.innerText = bookObject.author;
  elementBookAuthor.classList.add("item-writer");

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("item-action");

  const descContainer = document.createElement("div");
  descContainer.append(elementBookTitle, elementBookAuthor);
  descContainer.classList.add("item-desc");

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(descContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  // -----------BUTTON---------- \\
  if (bookObject.isComplete) {
    const returnBtn = document.createElement("button");
    returnBtn.innerHTML = `Belum Selesai di Baca`;
    returnBtn.classList.add("kembalikan-btn");

    returnBtn.addEventListener("click", function () {
      if (confirm("Anda Yakin Mengembalikan Buku ke Rak Belum DiBaca?")) {
        returnBookFromFinished(bookObject.id);
        alert("Buku Dikembalikan ke Rak Belum Dibaca");
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `Hapus Buku `;
    deleteBtn.classList.add("hapus-btn");

    deleteBtn.addEventListener("click", function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        deleteBook(bookObject.id);
        alert("Buku Dihapus Dari Bookshelf");
      } else {
      }
    });

    container.append(actionContainer);
    actionContainer.append(deleteBtn, returnBtn);
  } else {
    const finishBtn = document.createElement("button");
    finishBtn.innerHTML = `Selesai di Baca`;
    finishBtn.classList.add("selesai-btn");

    finishBtn.addEventListener("click", function () {
      if (confirm("Anda Yakin Buku Telah Dibaca ?")) {
        addBookToFinished(bookObject.id);
        alert("Buku Dipindahkan ke Rak sudah Dibaca");
      } else {
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `Hapus Buku`;
    deleteBtn.classList.add("hapus-btn");

    deleteBtn.addEventListener("click", function () {
      if (confirm("Anda Yakin Menghapus Buku? ")) {
        deleteBook(bookObject.id);
        alert("Buku telah dihapus");
      } else {
      }
    });

    container.append(actionContainer);
    actionContainer.append(deleteBtn, finishBtn);
  }

  return container;
};

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById("belumDibaca");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("sudahDibaca");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
  totalOfBooks();
});

document.addEventListener(SAVED_EVENT, function () {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Disimpan";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(MOVED_EVENT, function () {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Dipindahkan!";
  elementCustomAlert.setAttribute("style", "background-color:black;");

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(DELETED_EVENT, function () {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Berhasil Dihapus";
  elementCustomAlert.setAttribute("style", "background-color:red;");

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

function findBook(bookId) {
  for (const todoItem of books) {
    if (todoItem.id === bookId) {
      return todoItem;
    }
  }
  return null;
}

function addBookToFinished(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteData();
}

function returnBookFromFinished(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function moveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
  }
}

function deleteData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETED_EVENT));
  }
}

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

document.addEventListener(SAVED_EVENT, function () {
  localStorage.getItem(STORAGE_KEY);
});

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

function totalOfBooks() {
  const totalBooks = document.getElementById("total-books");
  totalBooks.innerHTML = books.length;
}
