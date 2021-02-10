class Task {
  constructor(task) {
    this.task = task;
    this.id = UUID.generate();
    this.complete = false;
  }
}