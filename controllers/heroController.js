const Hero = require("../models/hero");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.hero_list = asyncHandler(async (req, res, next) => {
    const heroes = await Hero.find().populate("petId").exec();
    res.json(heroes);
});

exports.hero_detail = asyncHandler(async (req, res, next) => {
    const hero = await Hero.findById(req.params.id).populate("petId").exec();
    if(!hero) {
        return res.status(404).json({ error: "Herói não encontrado" });
    }
    res.json(hero);
});

exports.hero_create = [
    body("name", "O nome do herói não pode estar vazio.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("petId").optional().escape(),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const hero = new Hero({
        name: req.body.name,
        petId: req.body.petId || null,
      });
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
          const savedHero = await hero.save();
          res.status(201).json(savedHero);
      }
    }),
];


exports.hero_delete = asyncHandler(async (req, res, next) => {
  const result = await Hero.findByIdAndDelete(req.params.id); // _id no MongoDB
  if (!result) return res.status(404).json({ error: "Herói não encontrado" });
  res.json({ message: "Herói removido com sucesso" });
});

// Controller para atualizar o herói com petId
// Atualizando o herói com o petId no backend
exports.hero_update = asyncHandler(async (req, res, next) => {
  const { name, petId } = req.body;
  const hero = await Hero.findById(req.params.id);

  if (!hero) {
    return res.status(404).json({ error: "Herói não encontrado" });
  }

  hero.name = name;

  // Verifica se o petId foi fornecido
  if (petId) {
    // Verifica se o petId é válido (existe no banco)
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(400).json({ error: "Pet não encontrado" });
    }
    hero.petId = petId; // Atualiza o petId do herói
  }

  try {
    const updatedHero = await hero.save();
    res.json(updatedHero);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar herói" });
  }
});


