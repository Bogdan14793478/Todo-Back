import "./App.css";
import React, { useState, useEffect } from "react";
import Form from "./Form";
import TodoList from "./TodoList";
import axios from "axios";
import { convertToTree } from "./helpers/helper";

function Todo({ index }) {
  // const [uniqueId, setUniqueId] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [tasksTree, setTasksTree] = useState([]);

  useEffect(() => {
    setTasksTree(() => convertToTree(tasks));
    console.log(tasksTree);
  }, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      // const result = await fetch('/api/todo/list')
      fetch("/api/todo/list")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("ttt", data);
          setTasks(data);
        });
    };
    fetchTasks();
  }, []);

  const findById = (data, id) => {
    for (let element of data) {
      if (element.id === id) {
        return element;
      }

      if (element.children) {
        let desiredElement = findById(element.children, id);
        if (desiredElement) {
          return desiredElement;
        }
      }
    }
    return false;
  };

  const createTask = async (message, parentId, index) => {
    let clonededTasks = [...tasks];
    let newTask = {
      id: Date.now(),
      parentId: null,
      message: message,
      // children: [],
    };
    await axios.post("/api/todo/add", { ...newTask, parentId });
    axios.get("/api/todo/list").then((data) => {
      console.log("ttt", data);
      setTasks(data.data);
    });
  };
 

  const deleteTask = async (id, parentId) => {
    let clonededTasks = [...tasks];
    if (parentId) {
      let parentTask = findById(clonededTasks, parentId);
      parentTask = parentTask.filter(
        (child) => child.id !== id
      );
    } else {
      clonededTasks = clonededTasks.filter((task) => task.id !== id);
    }
    await axios.delete("/api/todo/delete/:id");
    
    setTasks(clonededTasks);
  };

  const onUp = (id, parentId) => {
    let clonededTasks = [...tasks];

    if (parentId) {
      let parentTask = findById(clonededTasks, parentId);
      let index = parentTask.children.findIndex((task) => task.id === id);

      let temporaryTask = parentTask.children[index];

      parentTask.children[index] = parentTask.children[index - 1];
      parentTask.children[index - 1] = temporaryTask;
    } else {
      let index = clonededTasks.findIndex((task) => task.id === id);
      let temporaryTask = clonededTasks[index];

      clonededTasks[index] = clonededTasks[index - 1];
      clonededTasks[index - 1] = temporaryTask;
    }

    setTasks(clonededTasks);
  };

  const onDown = (id, parentId) => {
    let clonededTasks = [...tasks];

    if (parentId) {
      let parentTask = findById(clonededTasks, parentId);
      let index = parentTask.children.findIndex((task) => task.id === id);

      let temporaryTask = parentTask.children[index];

      parentTask.children[index] = parentTask.children[index + 1];
      parentTask.children[index + 1] = temporaryTask;
    } else {
      let index = clonededTasks.findIndex((task) => task.id === id);
      let temporaryTask = clonededTasks[index];

      clonededTasks[index] = clonededTasks[index + 1];
      clonededTasks[index + 1] = temporaryTask;
    }

    setTasks(clonededTasks);
  };

  return (
    <div className="App">
      <div style={{ paddingLeft: "50px" }}>
        <Form createTask={createTask} />
      </div>

      <hr />
      <div style={{ paddingLeft: "50px" }}>
        <TodoList
          tasks={tasksTree}
          deleteTask={deleteTask}
          createTask={createTask}
          onUp={onUp}
          onDown={onDown}
        />
      </div>
    </div>
  );
}

export default Todo;
