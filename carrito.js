let carrito = {};
let productoActual = '';
let necesitaSalsa = false;
let necesitaGuarnicion = false;

// Configuraciones específicas de carta
const productosConGuarnicion = [
  "Milanesa", "Pollo", "Matambre de cerdo", "Matambre napolitana", "Matambre cuatro quesos (cerdo)",
  "Filet de merluza", "Salmón rosado", "Langostinos al ajillo", "Paella", "Entrecotte", "Bife de chorizo",
  "Matambre", "Matambre a la pizza", "Matambre cuatro quesos", "Napolitana especial", "La BOMBA"
];

const productosConSalsa = [
  "Entrecotte", "Bife de chorizo", "Matambre", "Matambre a la pizza", "Matambre cuatro quesos", "Vacio",
  "Ñoquis", "Canelones carne y verdura", "Lasagna vegetariana", "Canelones de verdura y choclo",
  "Ravioles de carne y verdura", "Ravioles de espinaca y queso", "Sorrentinos de jamon y queso",
  "Sorrentinos de calabaza y queso", "Lasagna de carne y verdura"
];

const salsas = [
  "Salsa de puerro", "Salsa de hongos", "Salsa roquefort", "Salsa criolla", "Chimichurri",
  "Salsa bolognesa", "Crema de hongos", "Crema de langostinos", "Parisienne", "Salsa 4 quesos"
];

const guarniciones = [
  "Papas fritas", "Papas Rusticas", "Papas Noisette", "Tortilla",
  "Ensalada Mixta", "Ensalada de Rúcula con queso", "Papas revuelta con huevo"
];

const salsasCarneTernera = [
  "Salsa de puerro", "Salsa de hongos", "Salsa roquefort", "Salsa criolla", "Chimichurri"
];

const salsasPastas = [
  "Salsa bolognesa", "Crema de hongos", "Crema de langostinos", "Parisienne", "Salsa 4 quesos"
];

const carneCerdoItems = ["Matambre de cerdo", "Matambre napolitana", "Matambre cuatro quesos (cerdo)"];
const carneTerneraItems = ["Entrecotte", "Bife de chorizo", "Matambre", "Matambre a la pizza", "Matambre cuatro quesos", "Vacio"];
const pastasItems = [
  "Ñoquis", "Canelones carne y verdura", "Lasagna vegetariana",
  "Canelones de verdura y choclo", "Ravioles de carne y verdura", "Ravioles de espinaca y queso",
  "Sorrentinos de jamon y queso", "Sorrentinos de calabaza y queso", "Lasagna de carne y verdura"
];
const productosGuarnicionReducida = [
  "Milanesa", "Pollo", "Carnes de ternera", "La BOMBA", "Napolitana especial", ...carneCerdoItems
];

// -------- Función principal para agregar productos ------------
function agregarAlCarrito(producto) {
  productoActual = producto;

  necesitaSalsa = productosConSalsa.some(p => producto.includes(p)) && !carneCerdoItems.some(p => producto.includes(p));
  necesitaGuarnicion = productosConGuarnicion.some(p => producto.includes(p));

  const modalOpciones = document.getElementById('modal-opciones');
  if (modalOpciones && (necesitaSalsa || necesitaGuarnicion)) {
    mostrarModalOpciones(producto);
  } else {
    agregarProductoAlCarrito(producto);
    mostrarNotificacion(` ✔️Agregado al carrito.`);
  }
}

// -------- Modal de opciones (solo en carta.html) ------------
function mostrarModalOpciones(producto) {
  document.getElementById('modal-titulo').textContent = `Opciones para: ${producto}`;

  const salsaSelect = document.getElementById('select-salsa');
  const salsaContainer = document.getElementById('contenedor-salsas');
  if (necesitaSalsa) {
    salsaContainer.style.display = 'block';
    let filtradas = [];

    if (carneTerneraItems.some(p => producto.toLowerCase().includes(p.toLowerCase()))) {
      filtradas = salsasCarneTernera;
    } else if (pastasItems.some(p => producto.toLowerCase().includes(p.toLowerCase()))) {
      filtradas = salsasPastas;
    } else {
      filtradas = salsas;
    }

    salsaSelect.innerHTML = '<option value="">Sin salsa</option>';
    filtradas.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      salsaSelect.appendChild(opt);
    });
  } else {
    salsaContainer.style.display = 'none';
    salsaSelect.innerHTML = '';
  }

  const guarnicionSelect = document.getElementById('select-guarnicion');
  const guarnicionContainer = document.getElementById('contenedor-guarniciones');
  if (necesitaGuarnicion) {
    guarnicionContainer.style.display = 'block';
    let filtradas = guarniciones;

    if (productosGuarnicionReducida.some(p => producto.toLowerCase().includes(p.toLowerCase()))) {
      filtradas = guarniciones.filter(g => !["Papas Noisette", "Tortilla", "Papas revuelta con huevo"].includes(g));
    }

    guarnicionSelect.innerHTML = '<option value="">Sin guarnición</option>';
    filtradas.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      guarnicionSelect.appendChild(opt);
    });
  } else {
    guarnicionContainer.style.display = 'none';
    guarnicionSelect.innerHTML = '';
  }

  document.getElementById('modal-opciones').classList.remove('oculto');
}

function confirmarAgregar() {
  let final = productoActual;
  const salsa = document.getElementById('select-salsa').value;
  const guarnicion = document.getElementById('select-guarnicion').value;

  if (salsa) final += ` (con ${salsa})`;
  if (guarnicion) final += ` (con ${guarnicion})`;

  agregarProductoAlCarrito(final);
  cerrarOpciones();
  mostrarNotificacion(`✔️Agregado al carrito.`);
}

// -------- Funciones generales del carrito ------------
function agregarProductoAlCarrito(producto) {
  if (carrito[producto]) {
    carrito[producto]++;
  } else {
    carrito[producto] = 1;
  }
}

function mostrarCarrito() {
  const lista = document.getElementById('lista-carrito');
  lista.innerHTML = '';

  if (Object.keys(carrito).length === 0) {
    lista.innerHTML = '<li class="listovich">El carrito está vacío.</li>';
  } else {
    for (let p in carrito) {
      const li = document.createElement('li');
      li.classList.add('item-carrito');
      li.innerHTML = `
        ${p} x${carrito[p]} 
        <button class="btn-eliminar" onclick="eliminarDelCarrito('${p.replace(/'/g, "\\'")}')">❌</button>
      `;
      lista.appendChild(li);
    }
  }

  document.getElementById('modal-carrito').classList.remove('oculto');
}

function eliminarDelCarrito(producto) {
  if (carrito[producto]) {
    carrito[producto]--;
    if (carrito[producto] <= 0) {
      delete carrito[producto];
    }
  }
  mostrarCarrito(); // Actualiza el modal
}


function cerrarCarrito() {
  document.getElementById('modal-carrito').classList.add('oculto');
}

function cerrarOpciones() {
  document.getElementById('modal-opciones').classList.add('oculto');
}

// -------- Enviar pedido por WhatsApp ------------
function enviarWhatsApp() {
  if (Object.keys(carrito).length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  let mensaje = 'Hola! Quisiera pedir:\n';
  for (let p in carrito) {
    mensaje += `- ${p} x${carrito[p]}\n`;
  }

  const numero = '5493534766302'; // Tu número real
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// -------- Notificación flotante --------
function mostrarNotificacion(texto) {
  const noti = document.getElementById("notificacion");
  if (!noti) return;

  noti.textContent = texto;
  noti.classList.remove("oculto");
  noti.classList.add("visible");

  setTimeout(() => {
    noti.classList.remove("visible");
    setTimeout(() => noti.classList.add("oculto"), 500);
  }, 2000);
}
