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
  animaisPodemCoexistir(existingSpecie, newSpecie) {
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
    const error = this.isValidAnimal(animal, quantity);
    if (error) return error;

    const requiredSize = this.animals[animal].tamanho * quantity;
    let viableBiome = this.animals[animal].biomas;
    let availableEnclosures = [];

    this.enclosures.forEach((enclosure) => {
      // Verifica se o bioma do enclosure é compatível com o bioma do animal
      if (!this.isBiomeCompatible(enclosure.bioma, viableBiome)) {
        return;
      }

      if (
        enclosure.animaisExistentes &&
        !this.animaisPodemCoexistir(enclosure.animaisExistentes.especie, animal)
      ) {
        return;
      }

      // espaço ocupado pelos animais existentes
      // fórmula dos espaço ocupado no enclosure
      let occupiedSpace = enclosure.animaisExistentes
        ? enclosure.animaisExistentes.quantidade *
          this.animals[enclosure.animaisExistentes.especie].tamanho
        : 0;

      // calcula o tamanho atual no enclosure - o espaço ocupado pelo animal
      let availableSpace = enclosure.tamanho - occupiedSpace;
      let currentFreeSpace = availableSpace - requiredSize;

      // checagem se existe uma especie no enclosure e se a nova espécie é diferente
      if (
        enclosure.animaisExistentes &&
        enclosure.animaisExistentes.especie !== animal
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

    return { recintosViaveis: availableEnclosures };
  }
}

export { RecintosZoo as RecintosZoo };

// testar outros testes
// const zoo = new RecintosZoo();
// console.log(zoo.analisaRecintos("MACACO", 2));
// console.log(zoo.analisaRecintos("ELEFANTE", 2));
// console.log(zoo.analisaRecintos("LEAO", 2));
