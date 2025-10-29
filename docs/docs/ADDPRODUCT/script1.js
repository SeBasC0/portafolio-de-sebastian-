
let products = [];

// Pantallas
function showForm(){
  document.getElementById("screen1").style.display = "none";
  document.getElementById("screen2").style.display = "block";
  document.getElementById("screen3").style.display = "none";
}
function cancelForm(){
  document.getElementById("screen1").style.display = "block";
  document.getElementById("screen2").style.display = "none";
  document.getElementById("screen3").style.display = "none";
  resetFormState();
}
function showProducts(){
  document.getElementById("screen1").style.display = "none";
  document.getElementById("screen2").style.display = "none";
  document.getElementById("screen3").style.display = "block";
  renderTable();
}

// Imagen
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const removeImageBtn = document.getElementById("removeImageBtn");

imageInput.addEventListener("change", () => {
  const file = imageInput.files && imageInput.files[0];
  if(!file){ hidePreview(); return; }
  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    previewName.textContent = file.name;
    preview.style.display = "flex";
    removeImageBtn.disabled = false;
  };
  reader.readAsDataURL(file);
});
removeImageBtn.addEventListener("click", () => {
  imageInput.value = "";
  hidePreview();
});
function hidePreview(){
  preview.style.display = "none";
  previewImg.removeAttribute("src");
  previewName.textContent = "";
  removeImageBtn.disabled = true;
}

// Peso
const weightValue = document.getElementById("weightValue");
const weightUnit  = document.getElementById("weightUnit");
const weightHint  = document.getElementById("weightHint");

weightValue.addEventListener("input", updateWeightHint);
weightUnit.addEventListener("change", updateWeightHint);

function updateWeightHint(){
  const v = parseFloat(weightValue.value);
  const u = weightUnit.value;
  if(isNaN(v) || v <= 0){ weightHint.textContent = ""; return; }
  if(u === "kg"){
    const lb = v * 2.20462;
    weightHint.textContent = `≈ ${lb.toFixed(2)} lb`;
  } else {
    const kg = v / 2.20462;
    weightHint.textContent = `≈ ${kg.toFixed(2)} kg`;
  }
}

// Form
document.getElementById("productForm").addEventListener("submit", function(e){
  e.preventDefault();
  const formData = new FormData(e.target);
  const title = formData.get("title").trim();
  const description = formData.get("description").trim();
  const price = parseFloat(formData.get("price")) || 0;
  const wVal = parseFloat(weightValue.value) || 0;
  const wUnit = weightUnit.value;

  const imageFile = imageInput.files && imageInput.files[0];
  let imageUrl = "";
  if(imageFile){ imageUrl = URL.createObjectURL(imageFile); }

  const newProduct = {
    title,
    description,
    price,
    weight: `${wVal} ${wUnit}`,
    state: "Active",
    category: "Vegetables",
    image: imageUrl
  };

  products.push(newProduct);
  resetFormState();
  showProducts();
});

// Tabla
function renderTable(){
  const tbody = document.getElementById("productTableBody");
  const search = document.getElementById("searchInput").value.toLowerCase();
  tbody.innerHTML = "";

  products
    .filter(p => p.title.toLowerCase().includes(search))
    .forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="product-row">
            ${p.image ? `<img src="${p.image}" alt=""/>` : ""}
            <span>${p.title}</span>
          </div>
        </td>
        <td><span class="state">${p.state}</span></td>
        <td>${p.category}</td>
      `;
      tbody.appendChild(tr);
    });
}

// Exportar CSV
function exportCSV(){
  if(products.length === 0){ alert("No hay productos."); return; }
  const headers = ["Title","Description","Price","Weight","State","Category"];
  const rows = products.map(p => [p.title,p.description,p.price,p.weight,p.state,p.category]);
  let csv = headers.join(",") + "\\n";
  rows.forEach(r => { csv += r.join(",") + "\\n"; });
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "products.csv"; a.click();
  URL.revokeObjectURL(url);
}

function resetFormState(){
  document.getElementById("productForm").reset();
  hidePreview();
  weightHint.textContent = "";
  document.getElementById("statusOnline").checked = true;
  document.getElementById("statusPOS").checked = false;
}
