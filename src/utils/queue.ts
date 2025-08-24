class Queue<T> {
  private queue: T[];
  constructor() {
    this.queue = [];
  }

  push(el: T) {
    this.queue.push(el);
  }

  front() {
    return this.queue[0] as T;
  }

  pop() {
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue[i] = this.queue[i + 1];
    }
    this.queue.pop();
  }

  clear() {
    this.queue = [];
    return this;
  }

  empty() {
    return this.queue.length === 0;
  }
}

export default Queue;
