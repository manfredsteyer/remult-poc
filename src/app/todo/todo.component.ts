// src/app/todo/todo.component.ts

import { Component, OnInit } from '@angular/core';
import { remult } from 'remult';
import { Task } from '../../shared/Task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  taskRepo = remult.repo(Task)
  tasks: Task[] = []
  ngOnInit() {
    this.taskRepo.find().then(items => this.tasks = items)
  }
}