// ==== IMAGEN DE PERFIL ====
const profileImg = document.getElementById("profile-img");
const uploadInput = document.getElementById("upload-img");
const removeBtn = document.getElementById("remove-img");

// Imagen por defecto
const defaultImg = "https://via.placeholder.com/80?text=User";

// Subir nueva foto
uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      profileImg.src = e.target.result;
      localStorage.setItem("profileImage", e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// Eliminar foto
removeBtn.addEventListener("click", () => {
  profileImg.src = defaultImg;
  localStorage.removeItem("profileImage");
});

// Cargar foto guardada
window.addEventListener("DOMContentLoaded", () => {
  const savedImg = localStorage.getItem("profileImage");
  if (savedImg) {
    profileImg.src = savedImg;
  }
});

// Seleccionar todos los botones "Modify"
const buttons = document.querySelectorAll(".modify");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Seleccionar el input hermano
    const input = btn.parentElement.querySelector("input");

    if (btn.textContent === "Modify") {
      // Activar edición
      input.disabled = false;
      input.focus();
      btn.textContent = "Save";
      btn.style.backgroundColor = "#eab308"; // amarillo para diferenciar
    } else {
      // Guardar cambios y desactivar
      input.disabled = true;
      btn.textContent = "Modify";
      btn.style.backgroundColor = "#2d7b4a"; // verde original
      // Aquí podrías enviar los datos al servidor si fuera real
      console.log(`Nuevo valor guardado: ${input.value}`);
    }
  });
});
