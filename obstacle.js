class Obstacle {
  constructor(x, y, r, img) {
    this.pos = createVector(x, y);
    this.r = r;
    this.img = img;
  }

  show() {
    push();
    const scaleFactor = 2;
    
   
    imageMode(CENTER);
    image(
      this.img,
      this.pos.x,
      this.pos.y,
      this.r * 2 * scaleFactor, // Largeur agrandie
      this.r * 2 * scaleFactor  // Hauteur agrandie
  );
    
   fill(0);
    ellipse(this.pos.x, this.pos.y, 0); 
    
    pop();
}


}