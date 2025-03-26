const Pet = require("../models/pet");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.pet_list = asyncHandler(async (req, res, next) => {
  const pets = await Pet.find().exec();
  res.json(pets);
});


exports.pet_detail = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id).exec();
  if (!pet) return res.status(404).json({ error: "Pet não encontrado" });
  res.json(pet);
});


exports.pet_create = [
    body("name", "O nome do pet não pode estar vazio.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const pet = new Pet({
        name: req.body.name,
      });
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const savedPet = await pet.save();
        res.status(201).json(savedPet);
      }
    }),
];


  exports.pet_delete = asyncHandler(async (req, res, next) => {
    const pet = await Pet.findByIdAndDelete(req.params.id);
  
    if (!pet) {
      return res.status(404).json({ error: "Pet não encontrado" });
    }
  
    // Atualizar heróis que possuem esse petId, removendo a associação
    await Hero.updateMany({ petId: req.params.id }, { $unset: { petId: "" } });
  
    res.json({ message: "Pet removido com sucesso e heróis atualizados" });
});
