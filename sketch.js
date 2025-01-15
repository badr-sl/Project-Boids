// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

// Equivalent du tableau de véhicules dans les autres exemples
const flock = [];
let fishImage;
let requinImage;
let obstacles = [];
let img;
let obstacleImage;
let fishsImage;
let Mode = "Normal";

let alignSlider, cohesionSlider, separationSlider;
let labelNbBoids;

let target;
let requin = [];
let fish = [];

function preload() {
  // On charge une image de poisson
  fishImage = loadImage('assets/Blue.png');
  requinImage = loadImage('assets/requin.png');
  img = loadImage('assets/image.png');
  obstacleImage = loadImage('assets/obstacleImage.png');
  fishsImage = loadImage('assets/fish.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Quelques sliders pour régler les "poids" des trois comportements de flocking
  // flocking en anglais c'est "se rassembler"
  // rappel : tableauDesVehicules, min max val step posX posY propriété
  const posYSliderDeDepart = 10;
  creerUnSlider("Poids alignment", flock, 0, 2, 1.5, 0.1, 10, posYSliderDeDepart, "alignWeight");
  creerUnSlider("Poids cohesion", flock, 0, 2, 1, 0.1, 10, posYSliderDeDepart + 30, "cohesionWeight");
  creerUnSlider("Poids séparation", flock, 0, 15, 3, 0.1, 10, posYSliderDeDepart + 60, "separationWeight");
  creerUnSlider("Poids boundaries", flock, 0, 15, 10, 1, 10, posYSliderDeDepart + 90, "boundariesWeight");
  creerUnSlider("Rayon des boids", flock, 4, 40, 6, 1, 10, posYSliderDeDepart + 120, "r");
  creerUnSlider("Perception radius", flock, 15, 60, 25, 1, 10, posYSliderDeDepart + 150, "perceptionRadius");
  obstacles.push(new Obstacle(width / 2, height / 2, 40, obstacleImage));

  // On créer les "boids". Un boid en anglais signifie "un oiseau" ou "un poisson"
  // Dans cet exemple c'est l'équivalent d'un véhicule dans les autres exemples
  for (let i = 0; i < 50; i++) {
    const b = new Boid(random(width), random(height), fishImage);
    b.r = random(8, 40);
    flock.push(b);
  }
  for (let i = 0; i < 10; i++) {
    const b = new Boid(random(width), random(height), fishsImage);
    b.r = random(8, 40);
    fish.push(b);
  }

  // Créer un label avec le nombre de boids présents à l'écran
  labelNbBoids = createP("Nombre de boids : " + flock.length);
  // couleur blanche
  labelNbBoids.style('color', 'white');
  labelNbBoids.position(10, posYSliderDeDepart + 180);

  // target qui suit la souris
  target = createVector(mouseX, mouseY);
  target.r = 50;

  // requin prédateur
  requin.push(new Boid(width / 2, height / 2, requinImage))
  requin[0].r = 50;
  requin[0].maxSpeed = 7;
  requin[0].maxForce = 0.5;



 // Création du bouton avec des instructions
 let button = createButton('');
 button.position(10, height - 50);
 button.size(100, 50);
 button.style('background-color', 'red');
 button.html("Instructions du jeux...");
 
 button.mousePressed(() => {
   alert("\n\n" +
     "- d - Activer/Désactiver le mode Debug\n" +
     "- r - Donner une taille aléatoire aux Boids\n" +
     "- c - Créer un Requin\n" +
     "- s - Activer le mode Snake\n" +
     "- n - Activer le mode Normal\n" +
     "- o - ajouter des fish on mode Snake \n" +
     "Concept du jeu :\n\n" +
     "Ce jeu est une simulation interactive de bancs de poissons utilisant un algorithme de flocking,\n" +
     "où les poissons se déplacent en groupe pour éviter un requin prédateur.\n" +
     "Le joueur peut interagir en ajoutant des obstacles, des requins,\n" +
     "ou en modifiant le comportement des poissons à travers différents modes,\n" +
     "comme le mode Normal ou le mode Snake, où les poissons suivent la souris.\n" +
     "Le but est de protéger les poissons du requin en utilisant des stratégies d'évasion\n" +
     "et en plaçant des obstacles pour ralentir les prédateurs."
   );
 });
 
}

function creerUnSlider(label, tabVehicules, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);

  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY + 17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    tabVehicules.forEach(vehicle => {
      vehicle[propriete] = slider.value();
    });
  });

  return slider;
}

function draw() {
  background(0);
  // une image de fond
  imageMode(CORNER);
  image(img, 0, 0, width, height);

  // mettre à jour le nombre de boids
  labelNbBoids.html("Nombre de boids : " + flock.length);

  // on dessine la cible qui suit la souris
  target.x = mouseX;
  target.y = mouseY;

  push();
  fill("lightgreen");
  noStroke();
  ellipse(target.x, target.y, target.r, target.r);

  obstacles.forEach(o => {
    o.show();
  })
  pop();

  for (let boid of flock) {
    requin.forEach(function (r) {
      boid.fleeWithTargetRadius(r);
    });
    // équivalent de applyBehaviors, cohesion + separation + alignenement + confinement
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  if(Mode === "Snake"){

    fish.forEach(function (f, index) {

      if (index === 0) {
        let seekForce = f.seek(createVector(mouseX, mouseY));
        seekForce.mult(1);
        f.applyForce(seekForce);
      } else {
        let previousFish = fish[index - 1];
        let seekForce = f.seek(previousFish.pos);
        seekForce.mult(1);
        f.applyForce(seekForce);
      }
      f.flock(flock, false);
      f.edges();
      f.update();
      f.show();
  
  
    });
  }

  // REQUIN
  requin.forEach(function (r) {

    let wanderForce = r.wander();
    wanderForce.mult(1);
    r.applyForce(wanderForce);
    let avoidForce = r.avoid(obstacles, false);
    avoidForce.mult(r.avoidWeight);
    r.applyForce(avoidForce);


  });


  // calcul du poisson le plus proche du requin
  let seekForce;
  let rayonDeDetection = 70;
  // dessin du cercle en fil de fer jaune
  noFill();
  stroke("yellow");
  requin.forEach(function (r) {
    ellipse(r.pos.x, r.pos.y, rayonDeDetection * 2, rayonDeDetection * 2);
    let closest = r.getVehiculeLePlusProche(flock);
    if (closest) {
      // distance entre le requin et le poisson le plus proche
      let d = p5.Vector.dist(r.pos, closest.pos);
      if (d < rayonDeDetection) {
        // on fonce vers le poisson !!!
        seekForce = r.seek(closest.pos);
        seekForce.mult(7);
        r.applyForce(seekForce);
      }
      if (d < 5) {
        // on mange !!!!
        // on retire le poisson du tableau flock
        let index = flock.indexOf(closest);
        flock.splice(index, 1);
      }
    }

    r.edges();
    r.update();
    r.show();
  });

}

function mouseDragged() {
  const b = new Boid(mouseX, mouseY, fishImage);

  b.r = random(8, 40);

  flock.push(b);


}
function mousePressed() {
  obstacles.push(new Obstacle(mouseX, mouseY, 40, obstacleImage));
}

function keyPressed() {
  if (key === 'd') {
    Boid.debug = !Boid.debug;
  } else if (key === 'r') {
    // On donne une taille différente à chaque boid
    flock.forEach(b => {
      b.r = random(8, 40);
    });
  } else if (key === 'c') { // On créer un requin
    let NewR = new Boid(width / 2, height / 2, requinImage)
    NewR.r = 50;
    NewR.maxSpeed = 7;
    NewR.maxForce = 0.5;
    requin.push(NewR);
    //
  }else if (key === 's') { // On active le mode snake 
    Mode = "Snake";
  }else if (key === 'n') { // On active le mode Normal
    Mode = "Normal";
  }else if (key === 'o') { 
    let News = new Boid(width / 2, height / 2, fishsImage)
    News.r = random(8, 40);
    News.maxSpeed = 4;
    News.maxForce = 0.5;
    fish.push(News);
  }

}