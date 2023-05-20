const ApiError = require('../middlewares/error/ApiError');
const User = require('../models/User');

class MemoCardController {
  // GET api/memoCard/cards
  getCards = async (req, res, next) => {
    try {
      const { packId } = req.query;

      if (!packId) {
        next(ApiError.badRequest('Не передан id набора карточек'));
      }

      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const { cards } = user.memoPacks.id(packId);

      // todo handle cards from db

      res.status(200).json(cards);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при получении карточек'));
    }
  };

  // POST api/memoCard/createCard
  createCard = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      // todo add tags
      const { question, answer, state, createdAt, memoPackId } = req.body;

      const pack = user.memoPacks.id(memoPackId);

      if (!pack) {
        next(ApiError.notFound('Набор карточек по данному id не найден'));
      }

      // todo check on correct values

      const questionToAdd = question ? question.trim() : '';
      const answerToAdd = answer ? answer.trim() : '';

      if (!questionToAdd || !answerToAdd) {
        next(ApiError.badRequest('Поля для вопроса и ответа не могут быть пустыми'));
      }

      if (!createdAt || !memoPackId) {
        next(ApiError.badRequest('Не переданы все обязательные поля'));
      }

      const card = {
        question: questionToAdd,
        answer: answerToAdd,
        state: !!state ? state : 'new',
        createdAt,
        memoPack: memoPackId,
      };

      user.memoPacks.id(memoPackId).cards.push(card);

      await user.save();

      res.status(200).json(card);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при создании карточки'));
    }
  };

  // POST api/memoCard/editCard
  editCard = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const { cardId, question, answer, state } = req.body;

      // todo check on correct values

      const packWithCard = user.memoPacks.find((pack) => pack.cards.id(cardId));
      const toEdit = packWithCard.cards.id(cardId);

      if (!toEdit) {
        return next(ApiError.notFound('Карточка по указанному id не найдена'));
      }

      const questionToAdd = question !== undefined ? question.trim() : toEdit.question;
      const answerToAdd = answer !== undefined ? answer.trim() : toEdit.answer;
      toEdit.state = state !== undefined ? state : toEdit.state;

      if (!questionToAdd || !answerToAdd) {
        next(ApiError.badRequest('Поля для вопроса и ответа не могут быть пустыми'));
      }

      await user.save();

      const editedCard = {
        _id: toEdit._id,
        question: toEdit.question,
        answer: toEdit.answer,
        state: toEdit.state,
        createdAt: toEdit.createdAt,
      };

      res.status(200).json(editedCard);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при редактировании карточки'));
    }
  };

  // DELETE api/memoCard/deleteCard
  deleteCard = async (req, res, next) => {
    try {
      const { toDeleteId } = req.body;

      if (!toDeleteId || typeof toDeleteId !== 'string') {
        return next(ApiError.badRequest('Некорректный id карточки'));
      }

      const user = await User.findOne({ _id: req.userId });

      // todo check if user exist

      const packWithCard = user.memoPacks.find((pack) => pack.cards.id(toDeleteId));

      if (!packWithCard) {
        return next(ApiError.notFound('Карточка по указанному id не найдена'));
      }

      const cardToDelete = packWithCard.cards.id(toDeleteId);
      cardToDelete.deleteOne();

      await user.save();

      res.status(200).json(`Card ${toDeleteId} has been deleted`);
    } catch (error) {
      next(ApiError.badRequest('Ошибка при удалении карточки'));
    }
  };
}

module.exports = new MemoCardController();
