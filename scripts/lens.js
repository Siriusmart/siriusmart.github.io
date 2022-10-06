let r1_slider = document.getElementById("r1");
let h_slider = document.getElementById("h");
let m_slider = document.getElementById("m");
let d_slider = document.getElementById("d");
let r_slider = document.getElementById("r");
let penguin = document.getElementById("penguin");

let r1_display = document.getElementById("r1-display");
let h_display = document.getElementById("h-display");
let m_display = document.getElementById("m-display");
let d_display = document.getElementById("d-display");
let r_display = document.getElementById("r-display");

function refraction(s1, s2, r1, r2) {
  let i1 = Math.PI / 2 + Math.atan(s1) - Math.atan(s2);
  let i2 = -Math.asin((r1 * Math.sin(i1)) / r2);
  return Math.tan(i2 + Math.atan(-1 / s2));
}

function update() {
  if (h_slider.value < r1_slider.value) {
    r1_slider.value = h_slider.value;
  }

  r1_display.innerText = r1_slider.value;
  h_display.innerText = h_slider.value;
  m_display.innerText = m_slider.value;
  d_display.innerText = d_slider.value;
  r_display.innerText = r_slider.value;

  let canvas = document.getElementById("lens");
  let ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#acc5db";
  ctx.lineWidth = 3;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let centerx = canvas.width / 2;
  let centery = canvas.height / 2;

  let m = m_slider.value * 100;
  let h = h_slider.value * m;
  let image_height = h * 1.2;
  let r1 = Number(r1_slider.value) * m;
  let r2 = (Math.pow(h, 2) - 3 * Math.pow(r1, 2)) / (2 * r1);
  let r = r_slider.value;
  let angle = Math.atan(h / (r2 + r1));

  // lens
  ctx.beginPath();
  ctx.arc(
    centerx + (r1 + r2),
    centery,
    2 * r1 + r2,
    Math.PI - angle,
    Math.PI + angle
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerx - (r1 + r2), centery, 2 * r1 + r2, -angle, angle);
  ctx.stroke();

  // image
  let image_distance = d.value * m * 10;
  ctx.drawImage(
    penguin,
    centerx - image_distance - image_height * 1.5,
    centery - image_height / 2,
    image_height,
    image_height
  );

  // rays
  ctx.strokeStyle = "#feffcf";
  let image_top = centery - image_height / 2;
  let image_bottom = centery + image_height / 2;

  // horizontal rays
  let intercept_x =
    r1 +
    r2 -
    Math.sqrt(Math.pow(2 * r1 + r2, 2) - Math.pow(image_height / 2, 2));
  let intercept_x_display = centerx + intercept_x;
  ctx.beginPath();
  ctx.moveTo(0, image_top);
  ctx.lineTo(intercept_x_display, image_top);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, image_bottom);
  ctx.lineTo(intercept_x_display, image_bottom);
  ctx.stroke();

  // refracted 1 rays
  let intercept_slope = (r1 + r2 - intercept_x) / (image_height / 2);
  let refracted_slope = refraction(0, -intercept_slope, 1, r);
  let y_offset = image_height / 2 + refracted_slope * intercept_x;

  let a = Math.pow(-refracted_slope, 2) + 1;
  let b = 2 * -refracted_slope * y_offset + 2 * (r1 + r2);
  let c =
    Math.pow(y_offset, 2) + Math.pow(r1 + r2, 2) - Math.pow(2 * r1 + r2, 2);

  let intercept_x_2 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  let intercept_x_display_2 = intercept_x_2 + centerx;
  let intercept_y_2 = intercept_x_2 * -refracted_slope + y_offset;

  ctx.beginPath();
  ctx.moveTo(intercept_x_display, image_bottom);
  ctx.lineTo(
    intercept_x_display_2,
    centery + intercept_y_2
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(intercept_x_display, image_top);
  ctx.lineTo(
    intercept_x_display_2,
    centery - intercept_y_2
  );
  ctx.stroke();

  // refracted 2 rays


  r = 1 / r;
  intercept_slope = (r1 + r2 + intercept_x_2) / intercept_y_2;
  refracted_slope = -refraction(refracted_slope, intercept_slope, 1, r);

}

update();
