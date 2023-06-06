const ApiError = require('../middlewares/error/ApiError');
const User = require('../models/User');

class NoteController {
  // GET api/note/notes
  getNotes = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      const notes = user.notes;

      res.status(200).json(notes);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при получении заметок'));
    }
  };

  // POST api/note/createNote
  createNote = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      const { title, content, nextRepetition, createdAt, updatedAt, groupId } = req.body;

      const titleToAdd = title ? title.trim() : '';
      const contentToAdd = content ? content.trim() : '';

      // true, когда нет ни текста, ни заголовка
      // или когда нет даты создания
      // или когда нет даты обновления
      if ((!contentToAdd && !titleToAdd) || !createdAt || !updatedAt) {
        return next(ApiError.badRequest('Не переданы все обязательные поля'));
      }

      const note = {
        title: titleToAdd,
        content: contentToAdd,
        nextRepetition,
        createdAt,
        updatedAt,
        group: groupId,
      };

      user.notes.push(note);

      await user.save();

      res.status(200).json(user.notes.at(-1));
    } catch (error) {
      next(ApiError.badRequest('Ошибка при создании заметки'));
    }
  };

  // POST api/note/editNote
  editNote = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      const { noteId, title, content, nextRepetition, updatedAt, groupId } = req.body;

      if (!updatedAt) {
        return next(ApiError.badRequest('Не переданы все обязательные поля'));
      }

      const toEdit = user.notes.id(noteId);

      if (!toEdit) {
        return next(ApiError.notFound('Заметка по указанному id не найдена'));
      }

      toEdit.title = title !== undefined ? title.trim() : toEdit.title;
      toEdit.content = content !== undefined ? content.trim() : toEdit.content;
      toEdit.nextRepetition =
        nextRepetition !== undefined
          ? nextRepetition === null
            ? null
            : new Date(nextRepetition)
          : toEdit.nextRepetition;
      toEdit.group = groupId || groupId === null ? groupId : toEdit.group;

      await user.save();

      const editedNote = user.notes.id(noteId);

      res.status(200).json(editedNote);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при редактировании заметки'));
    }
  };

  // DELETE api/note/deleteNote/:toDeleteId
  deleteNote = async (req, res, next) => {
    try {
      const { toDeleteId } = req.params;

      if (!toDeleteId || typeof toDeleteId !== 'string') {
        return next(ApiError.badRequest('Некорректный id заметки'));
      }

      const user = await User.findOne({ _id: req.userId });

      const noteToDelete = user.notes.id(toDeleteId);

      if (!noteToDelete) {
        return next(ApiError.notFound('Заметка по указанному id не найдена'));
      }

      noteToDelete.deleteOne();

      await user.save();

      res.status(200).json(`Note ${toDeleteId} has been deleted`);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при удалении заметки'));
    }
  };
}

module.exports = new NoteController();
