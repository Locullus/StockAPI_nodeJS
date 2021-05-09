/*
On fait un appel à une API pour récupérer les données d'une action puis on les restructure
avant de les envoyer dans une base de données.
La restructuration consiste à passer d'objets de la forme {date: {open, high, low, close, volume}}
à une liste d'éléments [date, open, high, low, close]
*/

const fetch = require("node-fetch");

const url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=0657TVCCX6VXQTCX";

// on crée une fonction asynchrone pour gérer les promesses renvoyéées par fetch()
const getData = async url => {
  try {
    const promise = await fetch(url);
    const response = await promise.json();

    // on récupère un objet qui a la structure suivante : {date: {open, high, low, close, volume}}
    let data = response['Time Series (Daily)'];
    
    // la méthode slice() ne s'appliquant pas à un objet, il faut le convertir en liste de paires {clé, valeurs}
    data = Object.entries(data);

    // ensuite on découpe l'array avec la méthode slice()
    data = data.slice(0, 5);

    // puis on recrée un objet à partir des paires de {clé, valeurs} avec la méthode Object.fromEntries()
    data = Object.fromEntries(data);

    // la même chose mais avec une seule ligne de code
    data2 = Object.fromEntries(Object.entries(data).slice(0, 5))

    // on crée une liste des clés avec la méthode Object.key()
    let keys = Object.keys(data);

    // on crée une liste des valeurs avec la méthode Object.values()
    let content = Object.values(data);

    // ces valeurs étant elles-mêmes des {clé, valeur} on itère la liste pour récupérer les seules valeurs dans une nouvelle liste
    let values = [];
    for (let element of content) {
      values.push(Object.values(element));
    };

    // on utilise la méthode map() pour zipper les listes keys et values (la méthode zip() n'existe pas en javascript)
    let zippedList = keys.map((element, i) => [element, values[i]]);

    // on crée la liste finale de la forme [date, open, high, low, close, volume]
    let flatList = [];
    for (element of zippedList) {
      let item = [];
      item.push(element[0]);
      for (eachElement of element[1]) {
        item.push(eachElement);
      }
      flatList.push(item);
    }

    // pour réordonner enfin la liste sous la forme [date, open, high, low, close] on utilise les méthode splice() et pop()
    for (let x of flatList) {
      x.pop();                // supprime le dernier indice (volume)
      let close = x.pop();    // on copie le nouveau dernier indice (close) avant de le supprimer
      x.splice(1, 0, close);  // on ajoute la copie de close à l'indice 1
    }
    console.log("Et voici le résultat réarrangé :");   
    for (let x of flatList) {
      console.log(`le ${x[0]} : close ${x[1]}, open ${x[2]}, high ${x[3]}, low ${x[4]}`);
    }

  } catch (error) {
    console.log(error);
  }
};

getData(url);
