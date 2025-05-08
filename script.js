const studentInput = document.getElementById("studentName");
const addBtn = document.getElementById("addBtn");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const studentCount = document.getElementById("studentCount");
const clearAllBtn = document.getElementById("clearAllBtn");

let count = 0;

const updateCount = () => {
  studentCount.textContent = `Total Students: ${count}`;
};

const createListItem = (name) => {
  const li = document.createElement("li");
  li.draggable = true;
  li.innerHTML = `
    <span>${name}</span>
    <button class="editBtn">Edit</button>
    <button class="deleteBtn">Delete</button>
  `;
  return li;
};

addBtn.addEventListener("click", () => {
  const name = studentInput.value.trim();
  if (!name) return alert("Please enter a name!");
  const li = createListItem(name);
  studentList.appendChild(li);
  studentInput.value = "";
  count++;
  updateCount();
});

studentList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    e.target.parentElement.remove();
    count--;
    updateCount();
  }

  if (e.target.classList.contains("editBtn")) {
    const span = e.target.parentElement.querySelector("span");
    const newName = prompt("Edit name:", span.textContent.trim());
    if (newName && newName.trim() !== "") {
      span.textContent = newName.trim();
    }
  }
});

searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();
  [...studentList.children].forEach((li) => {
    const name = li.querySelector("span").textContent.toLowerCase();
    li.style.display = name.includes(search) ? "flex" : "none";
  });
});

clearAllBtn.addEventListener("click", () => {
  studentList.innerHTML = "";
  count = 0;
  updateCount();
});


let draggedItem = null;

studentList.addEventListener("dragstart", (e) => {
  draggedItem = e.target;
  setTimeout(() => e.target.classList.add("dragging"), 0);
});

studentList.addEventListener("dragend", (e) => {
  e.target.classList.remove("dragging");
});

studentList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(studentList, e.clientY);
  if (afterElement == null) {
    studentList.appendChild(draggedItem);
  } else {
    studentList.insertBefore(draggedItem, afterElement);
  }
});

const getDragAfterElement = (container, y) => {
  const elements = [...container.querySelectorAll("li:not(.dragging)")];
  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      return offset < 0 && offset > closest.offset
        ? { offset: offset, element: child }
        : closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
};

updateCount();
