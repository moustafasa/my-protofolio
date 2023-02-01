////////////////////////////////////////////////////
////////////////////////////////////////////////////
//////////// reset add tasks page ///////////////////
////////// to make progress and tasks done //////////
////////// //////////////////////////////////////////

import {
  createAddButtons,
  createInputBoxes,
  setOptionTd,
  setSelectOptions,
} from "./helpers.js";

class events {
  constructor(type, ev, action) {
    this.type = type;
    this.ev = ev;
    this.ev.preventDefault();
    this.methods = {
      add: this.add,
      deleteSelected: this.deleteSelected,
      edit: this.edit,
      cancel: this.cancel,
      update: this.update,
      validateOnInput: this.validateOnInput,
    };
    this.method = this.methods[action];
    this.method();
  }
  add() {
    if (this.type === "task") {
      this.taskObj = new task();
      this.taskObj.addTemp(
        this.ev.currentTarget.closest(".tasks"),
        this.ev.currentTarget
      );
    } else if (this.type === "sub") {
      this.taskObj = new task();
      this.subObj = new sub();
      this.subObj.addTemp(
        this.ev.currentTarget.closest(".subjects"),
        this.ev.currentTarget.parentElement
      );
      this.taskObj.addTemp(this.subObj.tasks);
    }
  }
  deleteSelected() {
    document
      .querySelector("tbody")
      .removeChild(this.ev.currentTarget.closest("tr"));
  }
  edit() {
    this.row = this.ev.currentTarget.closest("tr");
    this.row.classList.add("edit-mode");
    this.fields = [...this.row.querySelectorAll("td.editable")];
    this.fields.forEach((ele, index) => {
      this.value = ele.innerHTML;
      ele.dataset.default = this.value;
      this.input = document.createElementWithAttrs("input", {
        type: "text",
        class: "edit-field",
        value: this.value,
        "data-customType": index !== 0 ? "number" : "text",
      });
      ele.innerHTML = "";
      ele.append(this.input);
      this.input.addEventListener(
        "input",
        (ev) =>
          new events(index !== 0 ? "number" : "text", ev, "validateOnInput")
      );
    });
  }
  cancel() {
    this.row = this.ev.currentTarget.closest("tr");
    this.fields = [...this.row.querySelectorAll("td.editable")];
    this.row.classList.remove("edit-mode");
    this.fields.forEach((ele) => {
      ele.innerHTML = ele.dataset.default;
      ele.removeAttribute("data-default");
    });
  }
  update() {
    this.row = this.ev.currentTarget.closest("tr");
    this.fields = [...this.row.querySelectorAll("td.editable input")];
    this.valid = true;
    // validate if empty
    this.fields.forEach((field) => {
      if (field.value.length === 0) {
        this.valid = false;
      }
    });
    if (this.valid) {
      this.row.classList.remove("edit-mode");
      this.fields.forEach((field) => {
        this.td = field.parentElement;
        this.td.innerHTML = field.value;
      });
    }
  }
  validateOnInput() {
    if (this.type === "text") {
      this.newValue = (
        this.ev.currentTarget.value.match(/[a-zA-Z]\d{0,4}\s*/g) || []
      ).join("");
      console.log(this.newValue);
    } else if (this.type === "number") {
      this.newValue = this.ev.currentTarget.value.match(/\d*/g).join("");
      console.log(this.newValue);
    }
    this.ev.currentTarget.value = this.newValue;
  }
}

class all {
  constructor() {
    this.colNames = [];
  }
  show(values, type) {
    this.tbody = document.querySelector(
      `.show-tasks .table[data-showed='${type}'] tbody`
    );
    this.tbody.innerHTML = "";

    values.loop((key, taskObj) => {
      // create row and tds
      this.row = document.createElement("tr");
      this.tds = document.createMoreElement("td", this.colNames.length + 2);

      // add check box for select to first column of all rows
      this.check = document.createElementWithAttrs("input", {
        type: "checkbox",
        name: "selectedItem",
        value: taskObj["id"],
        class: "checked-item",
      });
      this.tds[0].append(this.check);

      // fill columns data
      for (let i = 0; i < this.colNames.length; i++) {
        // add editable class to columns other than id and progress to be edited by edit button
        if (this.colNames[i] !== "id" && this.colNames[i] !== "progress") {
          this.tds[i + 1].classList.add("editable");
        }
        this.tds[i + 1].innerHTML = taskObj[this.colNames[i]];
      }

      // set td with option buttons and destruct them to variables
      this.btns = setOptionTd();

      // set btns Events
      this.btns.loop((action, btn) => {
        btn.addEventListener(
          "click",
          (ev) => new events(undefined, ev, action)
        );
      });
      // append elements
      this.tds[this.tds.length - 1].append(...Object.values(this.btns));
      this.row.append(...this.tds);
      this.tbody.append(this.row);
    });
  }
}

class task extends all {
  form;
  id;
  inputBox;
  subTasksNumInputBox;
  subTasksDoneInputBox;
  addBtn;
  constructor() {
    super();
    this.colNames = [
      "id",
      "taskName",
      "subtasksNum",
      "subtasksDone",
      "progress",
    ];
  }
  addTemp(taskCont, taskBtn = null) {
    if (taskBtn === null) {
      // set task btn
      this.addBtn = createAddButtons("add-task", "task");
      taskCont.append(this.addBtn);

      // set event of task btn
      this.addBtn.addEventListener(
        "click",
        (ev) => new events("task", ev, "add")
      );

      // recall function
      this.addTemp(taskCont, this.addBtn);
    } else {
      // set id of task
      this.id = taskCont.querySelectorAll("form").length + 1;
      // create task form
      this.form = document.createElementWithAttrs("form", {
        "data-id": this.id,
        class: "task",
      });

      // create taskName input box
      this.inputBox = createInputBoxes(
        "taskName",
        "task-name text-input",
        "text",
        "task name"
      );

      // create subTasksNum input box
      this.subTasksNumInputBox = createInputBoxes(
        "subtasksNum",
        "subtasks-num num-input",
        "number",
        "subtasks num"
      );

      // create subTasksDone input box
      this.subTasksDoneInputBox = createInputBoxes(
        "subtasksDone",
        "subtasks-Done num-input",
        "number",
        "subtasks done"
      );

      // append all input boxes
      this.form.append(
        this.inputBox,
        this.subTasksNumInputBox,
        this.subTasksDoneInputBox
      );

      // append task form before task btn
      taskBtn.before(this.form);
    }
  }

  selectValue(headValues, subValues, headVal, subVal) {
    // get select boxes in task table
    this.headSelect = document.querySelector(
      '.table[data-showed="tasks"] .input-box.heads select'
    );
    this.subSelect = document.querySelector(
      '.table[data-showed="tasks"] .input-box.subjects select'
    );
    // reset sub select
    this.oldOpt = [...this.subSelect.children];
    this.oldOpt.shift();
    this.oldOpt.forEach((opt) => opt.remove());
    // not to create head values if it is found
    this.headValues = this.headSelect.children.length > 1 ? [] : headValues;
    // set values in option elements and make them in array
    this.obj = { head: this.headValues, sub: subValues };
    Object.keys(this.obj).forEach((key) => {
      this.arr = this.obj[key];
      setSelectOptions(this.arr);
    });

    // append options
    this.headSelect.append(...this.obj["head"]);
    this.subSelect.append(...this.obj["sub"]);
    // set head select value to equal headval
    this.headSelect.value = headVal;
    // set sub select value to equal subval
    this.subSelect.value = subVal;
  }
}

class sub extends all {
  form;
  id;
  inputBox;
  tasks;
  addBtn;

  constructor() {
    super();
    this.colNames = ["id", "subName", "tasksNum", "tasksDone", "progress"];
  }
  addTemp(subCont, subBtn = null) {
    // create sub form
    this.form = document.createElementWithAttrs("form", { class: "sub" });
    // if subBtn isn't set
    if (subBtn === null) {
      this.form.classList.add("btn");
      // create SubBtn and add it to subForm
      this.addBtn = createAddButtons("add-sub", "subject");
      this.form.append(this.addBtn);

      // add subForm to subjects container
      subCont.append(this.form);

      // add evnt of subBtn
      this.addBtn.addEventListener(
        "click",
        (ev) => new events("sub", ev, "add")
      );
      // create subForm that not contain the button
      // but contain the input boxes and its tasks
      this.addTemp(subCont, this.form);
    } else {
      // set id of sub
      this.id = subCont.querySelectorAll(".sub:not(.btn)").length + 1;
      this.form.dataset.id = this.id;

      // create input box and append it
      this.inputBox = createInputBoxes(
        "subName",
        "sub-name text-input",
        "text",
        "subject name"
      );
      this.form.append(this.inputBox);

      // create tasks cont
      this.tasks = document.createElementWithAttrs("div", { class: "tasks" });
      this.form.append(this.tasks);

      // add subForm before the add button of sub
      subBtn.before(this.form);
    }
  }

  selectValue(headValues, headVal) {
    // get select boxes in task table
    this.headSelect = document.querySelector(
      '.table[data-showed="subjects"] .input-box.heads select'
    );
    // set values in option elements and make them in array
    setSelectOptions(headValues);
    this.headSelect.append(...headValues);
    // set head select value to equal headval
    this.headSelect.value = headVal;
  }
}

class head extends all {
  form;
  id;
  inputBox;
  headNum;
  subjects;
  constructor() {
    super();
    this.colNames = [
      "id",
      "headName",
      "subNum",
      "subDone",
      "tasksNum",
      "tasksDone",
      "progress",
    ];
  }
  addTemp(headAddBtn) {
    // create head-cont form that contain head input box and its subjects and tasks
    this.headNum = document.querySelectorAll(".head-cont");
    this.id = this.headNum ? this.headNum.length + 1 : 1;
    this.form = document.createElementWithAttrs("form", {
      class: "head-cont",
      "data-id": this.id,
    });
    // create input box and prepend it
    this.inputBox = createInputBoxes(
      "headName",
      "sub-name text-input",
      "text",
      "head name"
    );
    this.form.prepend(this.inputBox);
    // create subjects cont and append it
    this.subjects = document.createElementWithAttrs("div", {
      class: "subjects",
    });
    this.form.append(this.subjects);
    headAddBtn.before(this.form);
  }
}

export { head, sub, task };
