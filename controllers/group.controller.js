const ApiError = require('../middlewares/error/ApiError');
const User = require('../models/User');

class GroupController {
  // GET api/group/groups
  getGroups = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const groups = user.groups;

      // todo handle packs from db

      res.status(200).json(groups);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при получении групп'));
    }
  };

  // POST api/group/creatGroup
  createGroup = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const { name, memoPacks, notes, deadline, createdAt, archived } = req.body;

      if (!createdAt) {
        return next(ApiError.badRequest('Не переданы все обязательные поля'));
      }

      const nameToAdd = name ? name.trim() : '';

      if (!nameToAdd) {
        return next(ApiError.badRequest('Название группы не может быть пустым'));
      }

      // todo check on correct values

      const memoPacksToAdd = !!memoPacks ? memoPacks : [];
      const notesdToAdd = !!notes ? notes : [];

      const group = {
        name: nameToAdd,
        memoPacks: memoPacksToAdd,
        notes: notesdToAdd,
        deadline,
        createdAt,
        archived,
      };

      user.groups.push(group);

      await user.save();

      res.status(200).json(group);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при создании группы'));
    }
  };

  // POST api/group/editGroup
  editGroup = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const { groupId, name, notes, memoPacks, deadline, archived } = req.body;

      if (!groupId || typeof groupId !== 'string') {
        return next(ApiError.badRequest('Некорректный id группы'));
      }

      const nameToAdd = name ? name.trim() : '';

      if (!nameToAdd) {
        return next(ApiError.badRequest('Название группы не может быть пустым'));
      }

      // todo check on correct values

      const toEdit = user.groups.id(groupId);

      if (!toEdit) {
        return next(ApiError.notFound('Группа по указанному id не найдена'));
      }

      toEdit.name = name !== undefined ? nameToAdd : toEdit.name;
      toEdit.notes = notes !== undefined ? notes : toEdit.notes;
      toEdit.archived = archived !== undefined ? archived : toEdit.archived;
      toEdit.memoPacks = memoPacks !== undefined ? memoPacks : toEdit.memoPacks;
      toEdit.deadline = deadline !== undefined ? deadline : toEdit.deadline;

      await user.save();

      const editedGroup = user.groups.id(groupId);

      res.status(200).json(editedGroup);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при редактировании группы'));
    }
  };

  // DELETE api/group/deleteGroup
  deleteGroup = async (req, res, next) => {
    try {
      const { toDeleteId } = req.body;

      if (!toDeleteId || typeof toDeleteId !== 'string') {
        return next(ApiError.badRequest('Некорректный id группы'));
      }

      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const groupToDelete = user.groups.id(toDeleteId);

      if (!groupToDelete) {
        return next(ApiError.notFound('Группа по указанному id не найдена'));
      }

      groupToDelete.deleteOne();

      await user.save();

      res.status(200).json(`Group ${toDeleteId} has been deleted`);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при удалении группы'));
    }
  };
}

module.exports = new GroupController();