import React, { useState } from "react";

export default function Form({
  task,
  createTask,
  deleteTask,
  parentId,
  onUp,
  onDown,
  isFirst,
  isLast,
  index
}) {
  const [message, setMessage] = useState("");
  return (
    <>
      <input
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          createTask(message, parentId, index);
          setMessage("");
        }}
      >
        Create task
      </button>
      {task && (
        <>
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => deleteTask(task.id, task.parentId)}
          >
            Delete task
          </button>
          {!isFirst && (
            <button
              style={{ backgroundColor: "aqua" }}
              onClick={() => onUp(task.id, task.parentId)}
            >
              Up
            </button>
          )}
          {!isLast && (
            <button
              style={{ backgroundColor: "pink" }}
              onClick={() => onDown(task.id, task.parentId)}
            >
              Down
            </button>
          )}
        </>
      )}
    </>
  );
}
