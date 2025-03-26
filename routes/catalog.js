const express = require("express");
const router = express.Router();

const init_controller = require("../controllers/initController");
const hero_controller = require("../controllers/heroController");
const pet_controller = require("../controllers/petController");

router.get("/init", init_controller.init_database);

// GET: Lista todos os heróis
router.get("/heroes", hero_controller.hero_list);

// GET: Detalhes de um herói específico
router.get("/hero/:id", hero_controller.hero_detail);

// DELETE: Remover um herói pelo ID
router.delete("/hero/:id", hero_controller.hero_delete);

// GET: Lista todos os pets
router.get("/pets", pet_controller.pet_list);


// GET: Detalhes de um pet específico
router.get("/pet/:id", pet_controller.pet_detail);

router.delete("/pet/:id", pet_controller.pet_delete);

// POST: Cria um novo hero
router.post("/pet", pet_controller.pet_create);

// POST: Cria um novo hero
router.post("/hero", hero_controller.hero_create);

router.put("/hero/:id", hero_controller.hero_update);

module.exports = router;

