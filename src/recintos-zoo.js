class RecintosZoo {
  constructor() {
    this.enclosures = [
      {
        numero: 1,
        bioma: "savana",
        tamanho: 10,
        animaisExistentes: { especie: "MACACO", quantidade: 3 },
      },
      { numero: 2, bioma: "floresta", tamanho: 5, animaisExistentes: null },
      {
        numero: 3,
        bioma: "savana e rio",
        tamanho: 7,
        animaisExistentes: { especie: "GAZELA", quantidade: 1 },
      },
      { numero: 4, bioma: "rio", tamanho: 8, animaisExistentes: null },
      {
        numero: 5,
        bioma: "savana",
        tamanho: 9,
        animaisExistentes: { especie: "LEAO", quantidade: 1 },
      },
    ];

    this.animals = {
      LEAO: { tamanho: 3, biomas: ["savana"] },
      LEOPARDO: { tamanho: 2, biomas: ["savana"] },
      CROCODILO: { tamanho: 3, biomas: ["rio"] },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"] },
      GAZELA: { tamanho: 2, biomas: ["savana"] },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"] },
    };
  }

  //method se animal válido
  isValidAnimal(animal, quantity) {
    if (!this.animals[animal]) {
      return { erro: "Animal inválido" };
    }
    if (quantity <= 0) {
      return { erro: "Quantidade inválida" };
    }
    return null;
  }

  //method bioma compativel
  isBiomeCompatible(biome, animalBiome) {
    const enclosureBiomes = biome.split(" e ");
    return enclosureBiomes.some((compatible) =>
      animalBiome.includes(compatible)
    );
  }

  // Verifica se os animals podem fazer parte do mesmo bioma
  canAnimalBeTogether(existingSpecie, newSpecie) {
    if (
      (existingSpecie === "GAZELA" && newSpecie === "MACACO") ||
      (existingSpecie === "MACACO" && newSpecie === "GAZELA")
    ) {
      return true;
    }
    // Carnivores devem ficar com carnívoros
    if (
      ["LEAO", "LEOPARDO", "CROCODILO"].includes(existingSpecie) ||
      ["LEAO", "LEOPARDO", "CROCODILO"].includes(newSpecie)
    ) {
      return false;
    }
    return true;
  }

  analisaRecintos(animal, quantity) {
    const animalUpperCase = animal.toUpperCase();

    const error = this.isValidAnimal(animalUpperCase, quantity);
    if (error) return error;

    const requiredSize = this.animals[animalUpperCase].tamanho * quantity;
    let viableBiome = this.animals[animalUpperCase].biomas;
    let availableEnclosures = [];

    this.enclosures.forEach((enclosure) => {
      // Verifica se o bioma do enclosure é compatível com o bioma do animal
      if (!this.isBiomeCompatible(enclosure.bioma, viableBiome)) {
        return;
      }

      if (
        enclosure.animaisExistentes &&
        !this.canAnimalBeTogether(
          enclosure.animaisExistentes.especie,
          animalUpperCase
        )
      ) {
        return;
      }

      // espaço ocupado pelos animais existentes
      // fórmula do espaço ocupado no enclosure/recinto
      let occupiedSpace = enclosure.animaisExistentes
        ? enclosure.animaisExistentes.quantidade *
          this.animals[enclosure.animaisExistentes.especie].tamanho
        : 0;

      // calcula o tamanho atual no enclosure/recinto - o espaço ocupado pelo animal
      let availableSpace = enclosure.tamanho - occupiedSpace;
      let currentFreeSpace = availableSpace - requiredSize;

      // checagem se existe uma especie no enclosure e se a nova espécie é diferente
      if (
        enclosure.animaisExistentes &&
        enclosure.animaisExistentes.especie !== animalUpperCase
      ) {
        currentFreeSpace -= 1;
      }

      // verifica se o recindo é viavel
      if (availableSpace >= requiredSize) {
        availableEnclosures.push(
          `Recinto ${enclosure.numero} (espaço livre: ${currentFreeSpace} total: ${enclosure.tamanho})`
        );
      }
    });

    if (availableEnclosures.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    console.log(animalUpperCase);
    return { recintosViaveis: availableEnclosures };
  }
}

export { RecintosZoo as RecintosZoo };

// testar outros testes
const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos("macaco", 2));
// console.log(zoo.analisaRecintos("ELEFANTE", 2));
// console.log(zoo.analisaRecintos("LEAO", 2));
