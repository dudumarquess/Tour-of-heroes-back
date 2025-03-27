const Hero = require("../models/hero");
const Pet = require("../models/pet"); 
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

exports.hero_update = asyncHandler(async (req, res) => {
  try {
    const { name, petId } = req.body;
    const heroId = req.params.id;

    // Verifica se o herói existe antes de atualizar
    const hero = await Hero.findById(heroId);
    if (!hero) {
      return res.status(404).json({ error: "Herói não encontrado" });
    }

    // Se houver petId, verifica se o pet existe
    if (petId) {
      const petExists = await Pet.exists({ _id: petId });
      if (!petExists) {
        return res.status(400).json({ error: "Pet não encontrado" });
      }
    }

    // Atualiza os campos necessários
    hero.name = name;
    hero.petId = petId || null; // 🔹 Se petId for undefined, define como null

    const updatedHero = await hero.save(); // 🔹 Salva o herói atualizado
    res.json(updatedHero);
  } catch (error) {
    console.error("Erro ao atualizar herói:", error);
    res.status(500).json({ error: "Erro ao atualizar herói" });
  }
});


