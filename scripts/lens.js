let r1_slider = document.getElementById("r1");
let h_slider = document.getElementById("h");
let m_slider = document.getElementById("m");
let d_slider = document.getElementById("d");
let r_slider = document.getElementById("r");
let fd_slider = document.getElementById("fd");
let mode = document.getElementById("mode");
let penguin = document.getElementById("penguin");

let r1_container = document.getElementById("r1-container");
let h_container = document.getElementById("h-container");
let d_container = document.getElementById("d-container");
let m_container = document.getElementById("m-container");
let r_container = document.getElementById("r-container");
let fd_container = document.getElementById("fd-container");

let r1_display = document.getElementById("r1-display");
let h_display = document.getElementById("h-display");
let m_display = document.getElementById("m-display");
let d_display = document.getElementById("d-display");
let r_display = document.getElementById("r-display");
let fd_display = document.getElementById("fd-display");
let focused = document.getElementById("focused");

let stored_value_r1;
let stored_value_h;
let stored_value_m;
let stored_value_d;
let stored_value_r;
let stored_value_fd;

const default_value_r1 = r1_slider.value;
const default_value_h = h_slider.value;
const default_value_m = m_slider.value;
const default_value_d = d_slider.value;
const default_value_r = r_slider.value;
const default_value_fd = fd_slider.value;

let previous_mode = mode.value;

function refraction(s1, s2, r1, r2, isup) {
  let i1 = Math.PI / 2 + Math.atan(s1) - Math.atan(s2);
  let i2 = (isup ? 1 : -1) * Math.asin((r1 * Math.sin(i1)) / r2);
  return Math.tan(i2 - Math.atan(1 / s2));
}

function update() {
  if (h_slider.value < r1_slider.value) {
    r1_slider.value = h_slider.value;
  }

  switch (mode.value) {
    case "full":
      r1_container.style.display = "block";
      h_container.style.display = "block";
      m_container.style.display = "block";
      d_container.style.display = "block";
      r_container.style.display = "block";
      fd_container.style.display = "block";
      break;
    case "eyes":
      r1_container.style.display = "block";
      h_container.style.display = "block";
      m_container.style.display = "block";
      d_container.style.display = "block";
      r_container.style.display = "block";
      fd_container.style.display = "none";
      break;
    case "camera":
      r1_container.style.display = "none";
      h_container.style.display = "none";
      m_container.style.display = "block";
      d_container.style.display = "block";
      r_container.style.display = "block";
      fd_container.style.display = "block";
      break;
  }

  r1_display.innerText = r1_slider.value;
  h_display.innerText = h_slider.value;
  m_display.innerText = m_slider.value;
  d_display.innerText = d_slider.value;
  r_display.innerText = r_slider.value;
  fd_display.innerText = fd_slider.value;

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
  ctx.moveTo(centerx - image_distance - 0.7 * image_height, image_top);
  ctx.lineTo(intercept_x_display, image_top);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerx - image_distance - 0.7 * image_height, image_bottom);
  ctx.lineTo(intercept_x_display, image_bottom);
  ctx.stroke();

  // refracted 1 rays
  let intercept_slope = (r1 + r2 - intercept_x) / (image_height / 2);
  let refracted_slope = refraction(0, -intercept_slope, 1, r);
  let y_offset = image_height / 2 + refracted_slope * intercept_x;

  let a = Math.pow(refracted_slope, 2) + 1;
  let b = 2 * -refracted_slope * y_offset + 2 * (r1 + r2);
  let c =
    Math.pow(y_offset, 2) + Math.pow(r1 + r2, 2) - Math.pow(2 * r1 + r2, 2);

  let intercept_x_2 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  let intercept_x_display_2 = intercept_x_2 + centerx;
  let intercept_y_2 = intercept_x_2 * -refracted_slope + y_offset;

  ctx.beginPath();
  ctx.moveTo(intercept_x_display, image_bottom);
  ctx.lineTo(intercept_x_display_2, centery + intercept_y_2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(intercept_x_display, image_top);
  ctx.lineTo(intercept_x_display_2, centery - intercept_y_2);
  ctx.stroke();

  // refracted 2 rays

  r = 1 / r;
  intercept_slope = (r1 + r2 + intercept_x_2) / intercept_y_2;
  let refracted_slope_2 = refraction(-refracted_slope, -intercept_slope, 1, r);

  let y_offset_2 = intercept_y_2 - refracted_slope_2 * intercept_x_2;

  ctx.beginPath();
  ctx.moveTo(centerx + intercept_x_2, centery + intercept_y_2);
  ctx.lineTo(canvas.width, refracted_slope_2 * centerx + y_offset_2 + centery);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerx + intercept_x_2, centery - intercept_y_2);
  ctx.lineTo(canvas.width, -refracted_slope_2 * centerx - y_offset_2 + centery);
  ctx.stroke();

  // focal point
  let focal_x = intercept_x_2 + intercept_y_2 / -refracted_slope_2;

  if (focal_x > 0) {
    ctx.fillStyle = "#0099ff";
    ctx.strokeStyle = "#0099ff";
  } else {
    ctx.fillStyle = "#990000";
    ctx.strokeStyle = "#990000";
  }

  ctx.beginPath();
  ctx.arc(focal_x + centerx, centery, 10 * m_slider.value, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#feffcf";

  // sensors
  ctx.strokeStyle = "#0099ff";
  let sensor_x = fd_slider.value * m;
  let sensor_x_display = sensor_x + centerx;

  ctx.beginPath();
  ctx.moveTo(sensor_x_display, centery - h);
  ctx.lineTo(sensor_x_display, centery + h);
  ctx.stroke();
  ctx.strokeStyle = "#feffcf";

  // through middle
  let s1 = 0;
  let graph_slope = 1000;

  let startx = -image_distance - 0.7 * image_height;
  let starty = -image_height / 2;

  let max_iterations = 500;
  let current_iteration = 0;
  let end = false;
  let previous_m;
  let previous_slope;

  while (true) {
    current_iteration++;
    let m1 = starty - s1 * startx;

    let a = Math.pow(s1, 2) + 1;
    let b = 2 * s1 * m1 - 2 * (r1 + r2);
    let c = Math.pow(m1, 2) - Math.pow(2 * r1 + r2, 2) + Math.pow(r1 + r2, 2);
    let intercept_x = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
    let intercept_x_display = intercept_x + centerx;
    let intercept_y = s1 * intercept_x + m1;
    let intercept_slope = (r1 + r2 - intercept_x) / intercept_y;

    let refracted_slope = refraction(
      s1,
      intercept_slope,
      1,
      r_slider.value,
      intercept_y > 0
    );
    let m2 = intercept_y - refracted_slope * intercept_x;

    if (current_iteration !== 1) {
      if (isNaN(graph_slope) || Math.abs(m2) < 0.5) {
        end = true;
      } else if (max_iterations <= current_iteration) {
        console.log(`Given up after ${current_iteration} iterations.`);
        penguin.style.opacity = 0;
        focused.innerText = "???";
        focused.style.color = "#ff5555";
        return;
      } else {
        previous_m = m2;
        previous_slope = s1;
        s1 -= m2 / graph_slope;
      }
    }

    if (end) {
      if (isNaN(s1)) {
        console.log("Could not find a ray that goes through centre.");
        return;
      }
      console.log(
        `Found ray that goes through center after ${current_iteration} iterations. (Offset ${m2})`
      );
      let y_at_edge = -m1 - centerx * s1;

      ctx.beginPath();
      ctx.moveTo(centerx + startx, centery - starty);
      ctx.lineTo(intercept_x_display, centery - intercept_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerx + startx, centery + starty);
      ctx.lineTo(intercept_x_display, centery + intercept_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(intercept_x_display, centery - intercept_y);
      ctx.lineTo(-intercept_x + centerx, centery + intercept_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(intercept_x_display, centery + intercept_y);
      ctx.lineTo(-intercept_x + centerx, centery - intercept_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-intercept_x + centerx, centery + intercept_y);
      ctx.lineTo(canvas.width, centery + y_at_edge);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-intercept_x + centerx, centery - intercept_y);
      ctx.lineTo(canvas.width, centery - y_at_edge);
      ctx.stroke();

      // output image
      let intercept_y_horizontal = refracted_slope_2 * sensor_x + y_offset_2;
      let intercept_y_center = s1 * sensor_x + m1;

      let blur_amount =
        (Math.abs(intercept_y_center - intercept_y_horizontal) /
          m_slider.value -
          30) *
        0.1;
      penguin.style.opacity = 1;
      penguin.style.filter = `blur(${blur_amount < 0 ? 0 : blur_amount}px)`;
      if (blur_amount <= 0) {
        focused.innerText = "In focus";
        focused.style.color = "#55ff55";
      } else {
        focused.innerText = "Out of focus";
        focused.style.color = "#ff5555";
      }
      break;
    }
  }
}

let interval_handler = setInterval(() => {
  if (penguin.complete && penguin.naturalHeight !== 0) {
    update();
    clearInterval(interval_handler);
  }
});
