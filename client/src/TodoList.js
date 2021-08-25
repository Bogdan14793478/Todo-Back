import React from "react";
import Form from "./Form";

export default function TodoList({
  tasks,
  createTask,
  deleteTask,
  onUp,
  onDown,
}) {
  console.log(tasks);
  let isFirst = 0; //???
  let isLast = tasks.length - 1; //???
  return (
    <>
      {tasks.map((task, index) => {
        return (
          <div key={index}>
            <p>{task.message}</p>
            <div style={{ paddingLeft: "30px" }}>
              <Form
                task={task}
                onUp={onUp}
                onDown={onDown}
                deleteTask={deleteTask}
                createTask={createTask}
                parentId={task.id}
                isFirst={isFirst}
                isLast={isLast}
                index={index}
              />
              {task.children.length > 0 && (
                <TodoList
                  tasks={task.children}
                  deleteTask={deleteTask}
                  createTask={createTask}
                  onUp={onUp}
                  onDown={onDown}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
