const Hero = require("../models/hero");
const Pet = require("../models/pet");
const asyncHandler = require("express-async-handler");

// Rota de inicialização (reset do banco e inserção de dados iniciais)
exports.init_database = asyncHandler(async (req, res, next) => {
    try {
      // Apagar todos os registros
      await Hero.deleteMany({});
      await Pet.deleteMany({});
  
      // Criar pets iniciais
      const pet1 = await new Pet({ name: "Dara" }).save();
      const pet2 = await new Pet({ name: "Nando" }).save();
      const pet3 = await new Pet({ name: "Pompeu"}).save();
  
      // Criar heróis iniciais com pets associados
      const hero1 = await new Hero({ name: "Batman", petId: pet1._id }).save();
      const hero2 = await new Hero({ name: "Superman", petId: pet2._id }).save();
      const hero3 = await new Hero({ name: "Novocaine", petId: null }).save();
  
      res.json({
        message: "Banco de dados reinicializado com sucesso!",
        heroes: [hero1, hero2, hero3],
        pets: [pet1, pet2, pet3],
      });
    } catch (error) {
      next(error);
    }
  });