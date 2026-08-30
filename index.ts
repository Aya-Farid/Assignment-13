(function () {
  //ts code
  var tasks: Task[] = [];

  var storageData = localStorage.getItem("tasksList");

  if (storageData) {
    tasks = JSON.parse(storageData);
  }

  // Save Tasks in LocalStorage
  function saveTasks(): void {
    localStorage.setItem("tasksList", JSON.stringify(tasks));
  }

  //interface Data Type to add task as Ob

  //custom type
  type Priority = "low" | "medium" | "high";
  type TaskStatus = "todo" | "in-progress" | "complete";

  interface Task {
    id: string;
    title: string;
    priority: Priority;
    dueDate: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
  }



  //HTML Elements

  var saveTasksBtn = document.getElementById("submit-btn") as HTMLButtonElement;

  var addTaskButton = document.getElementById(
    "add-task-btn",
  ) as HTMLButtonElement;

  var taskModal = document.getElementById("task-modal") as HTMLDivElement;

  var closeModalButton = document.getElementById(
    "close-modal-btn",
  ) as HTMLButtonElement;

  var cancelModalButton = document.getElementById(
    "cancel-modal-btn",
  ) as HTMLButtonElement;

  //ount Vars

  var todoCount = document.getElementById("todo-count") as HTMLParagraphElement;
  var inprogressCount = document.getElementById(
    "inprogress-Count",
  ) as HTMLParagraphElement;
  var completedCount = document.getElementById(
    "Completed-Count",
  ) as HTMLParagraphElement;

  //--------------- Done
  var taskForm = document.getElementById("task-form") as HTMLFormElement;

  var taskTitle = document.getElementById("task-title") as HTMLInputElement;

  var taskPriority = document.getElementById("task-priority",) as HTMLSelectElement;

  var dueDateTask = document.getElementById("task-due-date",) as HTMLInputElement;

  var taskDescription = document.getElementById("task-description",) as HTMLTextAreaElement;
  //

  var descriptionCounter = document.getElementById("description-counter",) as HTMLSpanElement;

  // Task Containers

  var todoCol = document.getElementById("tasks-todo") as HTMLDivElement;
  var inprogressCol = document.getElementById("tasks-in-progress",) as HTMLDivElement;
  var completedCol = document.getElementById("tasks-completed",) as HTMLDivElement;

  //  MODAL 

  function openModal(): void {
    taskModal.classList.remove("hidden");

    taskModal.classList.add("flex");
  }

  //closeModal Function (done)
  function closeModal(): void {
    taskModal.classList.add("hidden");

    taskModal.classList.remove("flex");

    taskForm.reset();

    taskPriority.value = "medium";

    descriptionCounter.textContent = "0/500";
  }

  // BUTTONS (done)
  //Add task
  addTaskButton.addEventListener("click", function (): void {
  editingTaskId = null;
  saveTasksBtn.textContent = "Add Task";
  openModal();
});

  //Close (done) 3 Ways to close it
  closeModalButton.addEventListener("click", function () {
    //Call Close Function
    closeModal();
  });

  cancelModalButton.addEventListener("click", function () {
    closeModal();
  });

  // Close when clicking outside modal (done)

  taskModal.addEventListener("click", function (event) {
    //e.stopPropagation()
    if (event.target === taskModal) {
      closeModal();
    }
  });

  //DESCRIPTION COUNTER (Done)

  taskDescription.addEventListener("input", function (): void {
    descriptionCounter.textContent = taskDescription.value.length + "/500";
  });

  // Add Task Or Edit (Arr Obj)

saveTasksBtn.addEventListener("click", function (): void {

  // Edit
  if (editingTaskId !== null) {

    var task = tasks.find(function (task: Task): boolean {
      return task.id === editingTaskId;
    });

    if (task) {
      task.title = taskTitle.value;
      task.priority = taskPriority.value as Priority;
      task.dueDate = dueDateTask.value;
      task.description = taskDescription.value;
    }

    editingTaskId = null;

  }

  // ADD
  else {

    var newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle.value,
      priority: taskPriority.value as Priority,
      dueDate: dueDateTask.value,
      description: taskDescription.value,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
  }

  saveTasks();
  closeModal();
  displayTasks(tasks);
});

  //DISPLAY Tasks

  function displayTasks(arr: Task[]): void {
    var todoContainer = "";
    var inprogressContainer = "";
    var completedContainer = "";
    //Filter Count
    var todoTasks = arr.filter((task) => task.status == "todo");
    var inprogressTasks = arr.filter((task) => task.status == "in-progress");
    var completedTasks = arr.filter((task) => task.status == "complete");

    todoCount.innerHTML = `${todoTasks.length} Tasks`;
    inprogressCount.innerHTML = `${inprogressTasks.length} Tasks`;
    completedCount.innerHTML = `${completedTasks.length} Tasks`;

    //IF Empty
    const EmptyArea = `
                                        <div class="flex flex-1 flex-col items-center justify-center">

                        <i class="fa-solid fa-folder-open text-2xl mb-3 text-slate-400"></i>

                        <p class="text-[15px] font-medium text-slate-400">
                        No tasks yet
                        </p>

                        <p class="mt-1 text-[12px] text-slate-400">
                        Click + to add one
                        </p>

                    </div>`;

    // Add every task to its column

    for (var i = 0; i < arr.length; i++) {
      var task = arr[i];
      var taskCard = `


        <div class="group relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-slate-200 hover:shadow-md">

                    <!-- Top Bar -->
                    <div class="mb-3 flex items-center justify-between">
                        <!-- Task ID -->
                        <div class="flex items-center gap-2">
                            <span class="h-2 w-2 rounded-full ${task.status == "todo" ? "bg-slate-400" : task.status == "in-progress" ? "bg-amber-400" : "bg-emerald-400"}"></span>
                            <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
                                #${getTaskNumber(task.id)}
                            </span>
                        </div>

                        <!-- Action Buttons (Edit / Delete) -->
                        <div class="flex items-center gap-1.5 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
                            <button
                                type="button"
                                class="edit-btn flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-500"
                                aria-label="Edit task" data-task-id="${task.id}"
                            >
                                <i class="fa-solid fa-pen pointer-events-none text-xs"></i>
                            </button>

                            <button
                                type="button"
                                class="delete-btn flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                aria-label="Delete task" data-task-id="${task.id}"
                            >
                                <i class="fa-solid fa-trash-can pointer-events-none text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="mb-1 text-base font-semibold leading-snug text-slate-800 ${
                      task.status == "complete"
                        ? "line-through text-slate-400"
                        : ""
                    }">
                        ${task.title}
                    </h3>

                    <!-- Description -->
                    <p class="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-400">
                        ${task.description}
                    </p>

                    <!-- Badges Row (Priority, Overdue, Due .....) -->
                    <div class="mb-4 flex flex-wrap items-center gap-2">
                        
                        <!-- Priority Badge -->
                        <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider 
                            ${task.priority == "low" ? " text-blue-500 bg-blue-50" : task.priority == "medium" ? " text-amber-500 bg-amber-50" : " text-red-500 bg-red-100/70"}
                        ">
                            ${task.priority}
                        </span>



                        ${getDateBadge(task.dueDate)}

                        


                    </div>

                    <!-- Date & Time Row -->
                    <div class="mb-5 flex items-center gap-4 text-xs font-medium">
                        <!-- Due Date -->
                        <div class="flex items-center gap-1.5 text-red-400">
                            <i class="fa-regular fa-calendar text-xs"></i>
                            <span>${formatDate(task.dueDate)}</span>
                        </div>

                        <!-- Created time -->
                        <div class="flex items-center gap-1.5 text-slate-400">
                            <i class="fa-regular fa-clock text-xs"></i>
                            <span>${createdDate(task.createdAt)}</span>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="mb-4 border-t border-slate-100"></div>

                    <!-- Bottom Action Buttons -->
                    <div class="flex items-center gap-2">

                    <!-- To Do Button -->
                        ${
                          task.status !== "todo"
                            ? `
                            <button
                            type="button"
                            class="status-btn inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200" data-task-id="${task.id}" data-status="todo"
                        >
                            <i class="fa-solid fa-rotate-left text-[10px]"></i>
                            To Do
                        </button>`
                            : ""
                        }

                        <!-- Start Button -->
                        ${
                          task.status !== "in-progress"
                            ? `
                            <button
                            type="button"
                            class="status-btn inline-flex items-center gap-2 rounded-xl bg-amber-100/70 px-4 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-200/80" data-task-id="${task.id}" data-status="in-progress"
                        >
                            <i class="fa-solid fa-play text-[10px]"></i>
                            Start
                        </button>
                            `
                            : ""
                        }

                        <!-- Complete Button -->
                        ${
                          task.status !== "complete"
                            ? `<button
                            type="button"
                            class="status-btn inline-flex items-center gap-2 rounded-xl bg-emerald-100/70 px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-200/80" data-task-id="${task.id}" data-status="complete"
                        >
                            <i class="fa-solid fa-check text-[10px]"></i>
                            Complete
                        </button>`
                            : ""
                        }

                        
                    </div>

                </div>
        
        `;

      if (task.status == "todo") {
        todoContainer += taskCard;
      }

      if (task.status == "in-progress") {
        inprogressContainer += taskCard;
      }
      if (task.status == "complete") {
        completedContainer += taskCard;
      }
    }

    todoCol.innerHTML = todoContainer || EmptyArea;
    inprogressCol.innerHTML = inprogressContainer || EmptyArea;
    completedCol.innerHTML = completedContainer || EmptyArea;
    setupStatusBtn();
    setupDeleteBtn();
    setupEditBtn();

  }

  function getTaskNumber(id: string) {
    //Call Task By id
    var index = tasks.findIndex((task) => task.id == id);
    return String(index + 1).padStart(3, "0");
  }

  //Due Badge  

  function getDateBadge(date: string) {
    //today's date
    const today = new Date();
    const taskDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    const diff = taskDate.getTime() - today.getTime();
    //from ms to day
    var days = diff / (1000 * 60 * 60 * 24);

    if (days == 0) {
      return `
        <!-- Overdue Badge -->
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-red-100/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-500">
                            <i class="fa-solid fa-triangle-exclamation text-[10px]"></i>
                            OVERDUE
                        </span>
        `;
    }

    if (days > 0 && days < 2) {
      return `
            
                        <!-- Due Soon Badge -->
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-orange-100/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-500">
                            DUE SOON
                        </span>
        `;
    }

    return ``;
  }

  //Date Function

  function formatDate(taskDate: string) {
    const dueDate = new Date(taskDate).toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
    });
    return dueDate;
  }

  //Create Dunction
  function createdDate(date: string): string {
    const createdTime = new Date(date);
    const now = new Date();

    //To days, mins, sec
    const diff = now.getTime() - createdTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    return createdTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // =========== Change Status

  function changeStatus(taskId: string, newStatus: TaskStatus): void {
    var index = tasks.findIndex((task) => task.id == taskId);
    if (index == -1) return;
    tasks[index].status = newStatus;

    saveTasks();
    displayTasks(tasks);
  }

  function setupStatusBtn(): void {
    const statusBtn = document.querySelectorAll(".status-btn",) as NodeListOf<HTMLButtonElement>;

    statusBtn.forEach((btn: HTMLButtonElement) => {btn.addEventListener("click", () => {
        var taskId = btn.dataset.taskId;
        var newStatus = btn.dataset.status as TaskStatus;

        if (!taskId || !newStatus) return;

        changeStatus(taskId, newStatus);
      });
    });
  }

  // Delete Task
  function deleteTask(id: string): void {
    tasks = tasks.filter(function (task: Task): boolean {
      return task.id !== id;
    });

    saveTasks();
    displayTasks(tasks);
  }
// DELETE Btn
  function setupDeleteBtn(): void {
    const deleteButtons = document.querySelectorAll(".delete-btn",) as NodeListOf<HTMLButtonElement>;

    deleteButtons.forEach((btn: HTMLButtonElement) => {btn.addEventListener("click", () => {
        var taskId = btn.dataset.taskId;

        if (!taskId) return;

        deleteTask(taskId);
      });
    });
  }


  // EDIT Btn
  function setupEditBtn(): void {
  const editButtons = document.querySelectorAll(
    ".edit-btn"
  ) as NodeListOf<HTMLButtonElement>;

  editButtons.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener("click", () => {
      var taskId = btn.dataset.taskId;

      if (!taskId) return;

      editTask(taskId);
    });
  });
}


  // EDIT Task
  var editingTaskId: string | null = null;

function editTask(id: string): void {
  var task = tasks.find(function (task: Task): boolean {
    return task.id === id;
  });

  if (!task) return;

  editingTaskId = id;

  saveTasksBtn.textContent = "Save Changes";

  taskTitle.value = task.title;
  taskPriority.value = task.priority;
  dueDateTask.value = task.dueDate;
  taskDescription.value = task.description;

  descriptionCounter.textContent =
    task.description.length + "/500";

  openModal();
}

  displayTasks(tasks);
})();
