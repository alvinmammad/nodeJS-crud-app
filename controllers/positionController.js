const Position = require("../models/positionModel");

exports.getAllPositions = async (req, res) => {
  const sort = {}
  if(req.query.sortBy && req.query.orderBy){
    sort[req.query.sortBy] = req.query.orderBy==='desc' ? -1 : 1;
  }
  Position.find((err, positions) => {
    if (positions) {
      res.send(positions);
    } else {
      return res.status(201).json({err})
    }
  }).populate({path:"department"}).sort(sort);
};

exports.getPosition = async (req, res) => {
  try{
  const position = await Position.findById(req.params.id).populate('department');
  res.status(200).json({position})
  }
  catch(err){
    res.status(404).json({err})
  }

};

exports.createPosition = async (req, res) => {
  try{
    const newPosition = await Position.create(req.body);
    const result = await Position.populate(newPosition,{path:"department"})
    res.status(201).json({
      result,
    });
  }
  catch (err){
    res.status(400).json({
      err
    })
  }
 
};
exports.updatePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const result = await Position.populate(position , {path:"department"})
    res.status(200).json({
      result,
    });
  } catch (err) {
    res.status(404).json({
      err,
    });
  }
};
exports.deletePosition = async (req, res) => {
  try {
    await Position.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "deleted",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      
       err
    });
  }
};
