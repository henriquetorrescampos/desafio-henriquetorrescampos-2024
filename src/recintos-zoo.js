class RecintosZoo {
  constructor() {
    this.recintos = [
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

    this.animais = {
      LEAO: { tamanho: 3, biomas: ["savana"] },
      LEOPARDO: { tamanho: 2, biomas: ["savana"] },
      CROCODILO: { tamanho: 3, biomas: ["rio"] },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"] },
      GAZELA: { tamanho: 2, biomas: ["savana"] },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"] },
    };
  }

  //method se animal válido
  isValid(animal, quantidade) {
    if (!this.animais[animal]) {
      return { erro: "Animal inválido" };
    }
    if (quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }
    return null;
  }

  //method bioma compativel
  biomaCompativel(bioma, biomasAnimal) {
    const biomasRecinto = bioma.split(" e ");
    return biomasRecinto.some((compativel) =>
      biomasAnimal.includes(compativel)
    );
  }

  // Verifica se os animais podem se misturar
  animaisPodemCoexistir(especieExistente, especieNova) {
    // Supondo que macacos e gazelas podem coexistir
    if (
      (especieExistente === "GAZELA" && especieNova === "MACACO") ||
      (especieExistente === "MACACO" && especieNova === "GAZELA")
    ) {
      return true;
    }
    // Evitar coexistência de predadores com presas
    if (
      ["LEAO", "LEOPARDO", "CROCODILO"].includes(especieExistente) ||
      ["LEAO", "LEOPARDO", "CROCODILO"].includes(especieNova)
    ) {
      return false;
    }
    return true;
  }

  analisaRecintos(animal, quantidade) {
    const erro = this.isValid(animal, quantidade);
    if (erro) return erro;

    const tamanhoAdequado = this.animais[animal].tamanho * quantidade;
    const biomasViaveis = this.animais[animal].biomas;
    let recintosDisponveis = [];

    this.recintos.forEach((recinto) => {
      // Verifica se o bioma do recinto é compatível com o bioma do animal
      if (!this.biomaCompativel(recinto.bioma, biomasViaveis)) {
        return;
      }

      // verifica se os animais podem coexistir
      // if (
      //   recinto.animaisExistentes &&
      //   ["LEAO", "LEOPARDO", "CROCODILO"].includes(
      //     recinto.animaisExistentes.especie
      //   ) &&
      //   animal !== recinto.animaisExistentes.especie
      // ) {
      //   return;
      // }

      if (
        recinto.animaisExistentes &&
        !this.animaisPodemCoexistir(recinto.animaisExistentes.especie, animal)
      ) {
        return;
      }

      // espaço ocupado pelos animais existentes
      let espacoOcupado = recinto.animaisExistentes
        ? recinto.animaisExistentes.quantidade *
          this.animais[recinto.animaisExistentes.especie].tamanho
        : 0;

      const espacoDisponivel = recinto.tamanho - espacoOcupado;
      const espacoLivre = espacoDisponivel - tamanhoAdequado;

      // Corrige o espaço livre
      if (espacoDisponivel >= tamanhoAdequado) {
        recintosDisponveis.push(
          `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`
        );
      }
    });

    if (recintosDisponveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    return { recintosViaveis: recintosDisponveis };
  }
}

export { RecintosZoo as RecintosZoo };

const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos("MACACO", 2));
// console.log(zoo.analisaRecintos("ELEFANTE", 2));
// console.log(zoo.analisaRecintos("LEAO", 2));
