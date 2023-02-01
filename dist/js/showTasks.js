import { show } from "./classes.js";

// functions
function setSelectValue(select) {
  if (select) {
    let val = select.dataset.value;
    select.removeAttribute("data-value");
    return val;
  } else {
    return undefined;
  }
}
// get data showed
let type = document.querySelector(".show-tasks").dataset.table;

let subSelect = document.querySelector(
  ".table:not(.hidden) .input-box.subjects select"
);
let headSelect = document.querySelector(
  ".table:not(.hidden) .input-box.heads select"
);

// get head val and sub val
let headVal = setSelectValue(headSelect);
let subVal = setSelectValue(subSelect);

// console.log(type);
let obj = new show(type, headVal, subVal);

// set headSelect event
headSelect.addEventListener("change", (ev) => {
  obj.headName = ev.currentTarget.value;
  if (type === "tasks") {
    // clear tbody when change in head select if type is tasks
    document.querySelector(
      '.show-tasks .table[data-showed="tasks"] tbody'
    ).innerHTML = "";
    obj.subName = "choose";
    obj.selectValue();
  } else {
    obj.showSubjects();
  }
});

subSelect.addEventListener("change", (ev) => {
  obj.subName = ev.currentTarget.value;
  obj.showTasks();
});

// delete selected items
let deleteSelected = document.querySelector(".delete-selected");
deleteSelected.addEventListener("click", (ev) => {
  ev.preventDefault();
  let selectedItems = [...document.querySelectorAll(".checked-item:checked")];
  selectedItems.forEach((ele) => {
    document.querySelector("tbody").removeChild(ele.closest("tr"));
  });
});
