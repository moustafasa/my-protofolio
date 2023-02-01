/**
 * create input box of tasks and heads and subjects
 * @author moustafa saad <moustafasaad954@gmail.com>
 * @param {string} name - name of input field and its id
 * @param {string} className - class of input field
 * @param {string} type - type of input field
 * @param {string} labelCont text content of label
 * @returns {HTMLElement} input box div
 */
export function createInputBoxes(name, className, type, labelCont) {
  // create input box div and add class to it
  let inputBox = document.createElementWithAttrs("div", { class: "input-box" });

  // create label of input box and set its attrs and append it
  let label = document.createElementWithAttrs("label", { for: "name" });
  label.textContent = labelCont;
  inputBox.append(label);

  // create input field of input box and its attrs and append it
  let input = document.createElementWithAttrs("input", {
    class: className,
    id: name,
    type: type,
    name: name,
  });
  inputBox.append(input);
  return inputBox;
}

/**
 * create add button as add subject and add task
 * @author moustafa saad <moustafasaad954@gmail.com>
 * @param {string} className - class of add button
 * @param {string} title - type of added (sub,task,head)
 * @returns {void} Nothing
 */
export function createAddButtons(className, title) {
  // create add button and set its attrs
  let addButton = document.createElementWithAttrs("button", {
    class: className,
    title: `add new ${title}`,
  });
  // create icon in add button
  addButton.innerHTML = '<i class="fa-solid fa-circle-plus"></i>';
  return addButton;
}

/**
 * create option td in show tasks table
 * @returns {object} object that has btn elements to set events for it
 */
export function setOptionTd() {
  // create option buttons
  let editBtn = document.createElementWithAttrs("button", { class: "edit" });
  let deleteBtn = document.createElementWithAttrs("button", {
    class: "delete",
  });
  let updateBtn = document.createElementWithAttrs("button", {
    class: "update",
  });
  let cancelBtn = document.createElementWithAttrs("button", {
    class: "cancel",
  });
  // set edit btn inner html
  editBtn.innerHTML = "edit";
  // set delete btn inner html
  deleteBtn.innerHTML = "delete";
  // set update btn inner html
  updateBtn.innerHTML = "update";
  // set cancel btn inner html
  cancelBtn.innerHTML = "cancel";
  return {
    edit: editBtn,
    deleteSelected: deleteBtn,
    update: updateBtn,
    cancel: cancelBtn,
  };
}

export function setSelectOptions(arr) {
  arr.forEach((value) => {
    let optEle = document.createElementWithAttrs("option", { value: value });
    optEle.value = value;
    optEle.innerHTML = value;
    arr[arr.indexOf(value)] = optEle;
  });
}
