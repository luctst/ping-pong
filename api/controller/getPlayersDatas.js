const PlayersModel = require("../models/Players");

module.exports = async function () {
  const AllDatas = await PlayersModel.find({}).populate("series").exec();

  const forClient = Object.keys(AllDatas).map((p) => AllDatas[p]);

  return {
    code: 200,
    modifyResponse: forClient,
  };
};
