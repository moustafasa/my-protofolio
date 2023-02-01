import * as temp from "./tempBuild.js";
import { add as apiAdd, show as apiShow } from "./apiConnect.js";
class add {
  #headNumDiv;
  #addHeadBtn;
  #head;
  #sub;
  #task;
  constructor() {
    // head object
    this.#head = new temp.head();
    // sub object
    this.#sub = new temp.sub();
    // task object
    this.#task = new temp.task();
    // api object
    this.apiObj = new apiAdd();
    // get number of heads from head num div
    this.#headNumDiv = document.querySelector(".headNum");
    this.#addHeadBtn = this.#headNumDiv.nextElementSibling;

    // set head btn event
    this.#addHeadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.addAll(1);
    });
  }
  addAll(numOfHeads) {
    this.numOfHeads = numOfHeads;
    for (let i = 1; i <= this.numOfHeads; i++) {
      this.#head.addTemp(this.#addHeadBtn);
      this.#sub.addTemp(this.#head.subjects);
      this.#task.addTemp(this.#sub.tasks);
    }
  }
}

class show {
  constructor(type, headName = null, subName = null) {
    this.headName = headName;
    this.subName = subName;
    this.type = type;
    this.api = new apiShow();
    if (this.type === "tasks") {
      this.app = new temp.task();
      this.showTasks();
      this.selectValue();
    } else if (this.type === "subjects") {
      this.app = new temp.sub();
      this.showSubjects();
      this.selectValue();
    } else {
      this.app = new temp.head();
      this.showHeads();
    }
  }
  async showTasks() {
    this.data = await this.api.task(this.subName, this.headName);
    this.app.show(this.data, this.type);
  }
  async showHeads() {
    this.data = await this.api.head();
    this.app.show(this.data, this.type);
  }
  async showSubjects() {
    this.data = await this.api.sub(this.headName);
    this.app.show(this.data, this.type);
  }
  async selectValue() {
    if (this.type === "tasks") {
      this.selectData = await this.api.selectValues("task", this.headName);
      this.app.selectValue(
        this.selectData["head"],
        this.selectData["sub"],
        this.headName,
        this.subName
      );
    } else {
      this.selectData = await this.api.selectValues("sub", this.headName);
      this.app.selectValue(this.selectData["head"], this.headName);
    }
  }
}

export { add, show };
