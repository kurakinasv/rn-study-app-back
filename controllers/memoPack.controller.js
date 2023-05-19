const ApiError = require('../middlewares/error/ApiError');
const User = require('../models/User');

class MemoPackController {
  // GET api/memoPack/memoPacks
  getMemoPacks = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const packs = user.memoPacks;

      // todo handle packs from db

      res.status(200).json(packs);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при получении наборов'));
    }
  };

  // POST api/memoPack/createMemoPack
  createMemoPack = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const { name, cards, lastRepetition, nextRepetition, createdAt, archived, groupId } =
        req.body;

      const nameToAdd = name ? name.trim() : '';

      if (!nameToAdd || !createdAt) {
        next(ApiError.badRequest('Не переданы все обязательные поля'));
      }

      const isExist = user.memoPacks.findIndex(({ name }) => name === nameToAdd);

      if (isExist !== -1) {
        next(ApiError.badRequest('Набор с таким именем уже существует'));
      }

      // todo check on correct values
      // todo add to group

      const memoPack = {
        name: nameToAdd,
        nextRepetition,
        createdAt,
        cards,
        lastRepetition,
        archived,
        group: groupId,
      };

      user.memoPacks.push(memoPack);

      await user.save();

      res.status(200).json(memoPack);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при создании набора'));
    }
  };

  // POST api/memoPack/editMemoPack
  editMemoPack = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const { packId, name, cards, lastRepetition, nextRepetition, archived, groupId } = req.body;

      // todo check on correct values

      const toEdit = user.memoPacks.id(packId);

      if (!toEdit) {
        return next(ApiError.notFound('Набор по указанному id не найден'));
      }

      // todo add to group

      const trimmedName = name.trim();

      if (name !== undefined && !trimmedName) {
        return next(ApiError.badRequest('Имя набора не должно быть пустым'));
      }

      toEdit.name = name !== undefined ? trimmedName : toEdit.name;
      toEdit.nextRepetition =
        nextRepetition !== undefined
          ? nextRepetition === null
            ? null
            : new Date(nextRepetition)
          : toEdit.nextRepetition;
      toEdit.group = groupId || groupId === null ? groupId : toEdit.group;
      //   toEdit.cards = cards === null ? [] : toEdit.cards
      toEdit.lastRepetition = !!lastRepetition ? lastRepetition : toEdit.lastRepetition;
      toEdit.archived = archived !== undefined ? archived : toEdit.archived;

      await user.save();

      const editedPack = user.memoPacks.id(packId);

      res.status(200).json(editedPack);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при редактировании набора'));
    }
  };

  // DELETE api/memoPack/deleteMemoPack
  deleteMemoPack = async (req, res, next) => {
    try {
      const { toDeleteId } = req.body;

      if (!toDeleteId || typeof toDeleteId !== 'string') {
        return next(ApiError.badRequest('Некорректный id набора'));
      }

      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const packToDelete = user.memoPacks.id(toDeleteId);

      if (!packToDelete) {
        return next(ApiError.notFound('Набор по указанному id не найден'));
      }

      packToDelete.deleteOne();

      await user.save();

      res.status(200).json(`Memo pack ${toDeleteId} has been deleted`);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при удалении заметки'));
    }
  };
}

module.exports = new MemoPackController();
