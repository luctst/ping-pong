const SeriesModel = require("../models/Series");

/**
 * Add a new game in a session
 * @param {Object} data -
 */
module.exports = async function (data) {
  try {
    const session = await SeriesModel.findOne(
      { date: data.session },
      "games date"
    ).exec();

    delete data.session;

    if (!session) {
      const newSession = new SeriesModel({
        games: [{ ...data }],
      });

      await newSession.save();
      return {
        code: 201,
        modifyResponse: newSession._doc,
      };
    }

    session.games.push(data);
    await session.save();

    return {
      code: 201,
      modifyResponse: session._doc,
    };
  } catch (error) {
    return {
      code: 500,
    };
  }
};
