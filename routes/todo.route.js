const { Router } = require("express");
const router = Router();

const Todo = require("../models/Todo");

router.get("/list", async (req, res) => {
  //получение всех данных
  try {
    const array = await Todo.find();
    res.status(200).send(array);
  } catch (e) {
    console.log(e);
  }
});

router.post("/add", async (req, res) => {
  //сохранить в базу
  try {
    console.log(req.body);
    const { id, index, message, parentId } = req.body;
    const maybechildren = await Todo.findOne({ id });
    if (maybechildren) {
      return res.status(400).json({ msg: "Такой айди существует" });
    }
    const todo = new Todo({ index, parentId, id, message });
    await todo.save();
    res.status(200).json({ msg: "Записано в базу" });
  } catch (e) {
    res.status(500).json({ msg: `Что то пошло не так ${e.msg}` });
  }
});

router.get("/", async (req, res) => {
  //для получения с бека и отображения
  try {
    const { index, parentId, id, message } = req.query;
    const todo = await Todo.find({ index, parentId, id, message, });
    res.json(todo);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const todo = await Todo.deleteOne({ id });
    res.status(200).json({message: "Delete complite"});
  } catch (error) {
    res.status(500).json({message: `Something wrong ${error.message}`});
  }
});

module.exports = router;
