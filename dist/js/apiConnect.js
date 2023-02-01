// private prototypes
// subjects calculations
Object.prototype.calcTasksForSub = function () {
  let tasksNum,
    tasksDone = 0,
    progress = 0;
  // loop on all subject objects
  Object.keys(this).forEach((subId) => {
    // first get tasksNum and tasksDone and progress
    let keys = Object.keys(this[subId]["tasks"]);
    // get tasks num
    tasksNum = keys.length;
    let progreSum = 0;
    keys.forEach((task) => {
      let tasObj = this[subId]["tasks"][task];
      // get tasks done
      tasksDone += tasObj.subtasksDone === tasObj.subtasksNum ? 1 : 0;
      // get progress
      progreSum += +tasObj.progress;
      // progreSum += (tasObj.subtasksDone / tasObj.subtasksNum) * 100;
    });
    progress = progreSum / keys.length;

    // second add them to subject obj
    this[subId].tasksNum = tasksNum;
    this[subId].tasksDone = tasksDone;
    this[subId].progress = progress;
    // delete all tasks from subject obj
    delete this[subId]["tasks"];
  });
};

// heads calculations
Object.prototype.calcTasksForHead = function () {
  // loop on heads
  let headKeys = Object.keys(this);
  headKeys.forEach((HK) => {
    let tasksNum = 0,
      tasksDone = 0,
      subjectNum = 0,
      subjectDone = 0,
      progress = 0,
      progreSum = 0;
    // calc tasks done and tasks num and progress
    // for all subjects
    this[HK]["subjects"].calcTasksForSub();
    // loop on subjects of head
    let subKeys = Object.keys(this[HK]["subjects"]);
    subKeys.forEach((SK) => {
      // add tasks num of all sub in heads to get tasks
      // num for heads
      let subObj = this[HK]["subjects"][SK];
      tasksNum += +subObj["tasksNum"];
      // add all tasks done in subs to get tasks done in heads
      tasksDone += +subObj["tasksDone"];
      // get all subject done
      subjectDone += +subObj["progress"] === 100 ? 1 : 0;
      // sum all progress of subjects of head (HK)
      progreSum += +subObj["progress"];
    });
    // get subject Num
    subjectNum = subKeys.length;
    // get progress by divide sum by subNum
    progress = progreSum / subjectNum;

    // set all this values in head object and remove subjects object
    this[HK]["tasksNum"] = tasksNum;
    this[HK]["tasksDone"] = tasksDone;
    this[HK]["subNum"] = subjectNum;
    this[HK]["subDone"] = subjectDone;
    this[HK]["progress"] = progress;
    delete this[HK]["subjects"];
  });
};

class add {
  constructor() {
    this.submitButton = document.querySelector(".submit-button");
    this.submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.addFun();
    });
  }
  async addFun() {
    this.headObj = {};
    this.headForms = [...document.querySelectorAll(".head-cont")];
    this.headForms.forEach(async (head) => {
      // add head to headObj
      this.subObj = {};
      this.headObj[`head-${head.dataset.id}`] = {
        id: head.dataset.id,
        headName: head.headName.value,
        subjects: this.subObj,
      };
      await this.addSub(head);
    });
    await this.sendReq();
  }
  async addSub(head) {
    //add sub to subObj
    this.subForms = [...head.querySelectorAll(".sub:not(.btn)")];
    this.subForms.forEach(async (sub) => {
      this.taskObj = {};
      this.subObj[`sub-${sub.dataset.id}`] = {
        id: sub.dataset.id,
        subName: sub.subName.value,
        tasks: this.taskObj,
      };
      await this.addTask(sub);
    });
  }
  async addTask(sub) {
    this.tasks = [...sub.querySelectorAll(".task")];
    this.tasks.forEach(async (task) => {
      this.taskObj[`task-${task.dataset.id}`] = {
        id: task.dataset.id,
        taskName: task.taskName.value,
        subtasksNum: task.subtasksNum.value,
        subtasksDone: task.subtasksDone.value,
      };
    });
  }
  async sendReq() {
    this.json = JSON.stringify(this.headObj);
    this.httpReq = new XMLHttpRequest();
    this.httpReq.onload = function (ev) {
      console.log(ev.currentTarget.response);
    };
    this.httpReq.open("GET", `test.php?json=${this.json}`, true);
    this.httpReq.send();
  }
}

class show {
  #getData;
  #data;
  constructor() {
    // get all json data including heads and subjects
    // and tasks .... etc
    this.#getData = async () => {
      this.#data = await fetch("../js/tasks.json");
      return this.#data.json();
    };
  }

  async sub(headName) {
    this.#data = await this.#getData();
    // get the object of the subjects of
    // the head that we need to disply it
    this.subjects = this.#data.getByValue(headName, "headName", "subjects");
    // calculation of sub like
    // taskNum, taskDone, progress
    this.subjects.calcTasksForSub();
    return this.subjects;
  }

  async head() {
    this.#data = await this.#getData();
    // calculation of head like
    // subNum, subDone
    // taskNum , taskDone , progress
    this.#data.calcTasksForHead();
    return this.#data;
  }
  async task(subName, headName) {
    this.#data = await this.#getData();
    // get subs obj by headName
    this.SubsObj = this.#data.getByValue(headName, "headName", "subjects");
    // get tasks obj from subs obj by subName
    this.tasksObj = this.SubsObj.getByValue(subName, "subName", "tasks");
    return this.tasksObj;
  }

  async selectValues(type, headName = null) {
    this.values = { head: [], sub: [] };
    this.#data = await this.#getData();
    Object.keys(this.#data).forEach((head) => {
      this.values["head"].push(this.#data[head]["headName"]);
    });
    if (type === "task") {
      this.subsObj = this.#data.getByValue(headName, "headName", "subjects");
      Object.keys(this.subsObj).forEach((sub) => {
        this.values["sub"].push(this.subsObj[sub]["subName"]);
      });
    }
    return this.values;
  }
}

export { add, show };
