let deckId = "";

let dinero = 1000;
let apuesta = 100;
let pot = 0;

let jugador = [];
let cpu = [];
let mesa = [];

let ronda = 0;
let enJuego = false;

const dineroTxt = document.getElementById("dinero");
const apuestaTxt = document.getElementById("apuesta");
const potTxt = document.getElementById("pot");
const estadoTxt = document.getElementById("estado");

const jugadorDiv = document.getElementById("jugador");
const cpuDiv = document.getElementById("cpu");
const mesaDiv = document.getElementById("mesa");

const pantallaFin = document.getElementById("pantalla-fin");
const mensajeResultado = document.getElementById("mensaje-resultado");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Evento para el botón reiniciar de la pantalla flotante
btnReiniciar.onclick = () => {
    pantallaFin.style.display = "none"; // Oculta el cartel flotante
    enJuego = false;                    // Forzamos el cierre de la ronda anterior
    crearPartida();                     // Genera nuevo mazo, mezcla y reparte todo desde cero
};

document.getElementById("subir50").onclick = () => ajustar(50);
document.getElementById("bajar50").onclick = () => ajustar(-50);
document.getElementById("subir100").onclick = () => ajustar(100);
document.getElementById("bajar100").onclick = () => ajustar(-100);
document.getElementById("pedir").onclick = siguienteRonda;
document.getElementById("quedarse").onclick = resolver;
document.getElementById("retirarse").onclick = fold;
document.getElementById("apostar todo").onclick = () => ajustar(dinero);

async function crearPartida() {
    // Si ya hay un juego real corriendo en medio de las rondas, bloquea el click accidental
    if (enJuego && ronda > 0) return;

    // 1. Llamamos a la API para un mazo NUEVO y MEZCLADO
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    const data = await res.json();

    deckId = data.deck_id;

    // 2. Vaciamos por completo los arrays para que no se acumulen las cartas viejas
    jugador = [];
    cpu = [];
    mesa = [];

    // 3. Limpiamos los contenedores HTML
    jugadorDiv.innerHTML = "";
    cpuDiv.innerHTML = "";
    mesaDiv.innerHTML = "";
    
    ronda = 0;
    enJuego = true;
    apuesta = 100;

    // 4. Descontamos dinero y armamos el bote
    dinero -= apuesta;
    pot = apuesta * 2;
    actualizarUI();

    // 5. Pedimos 9 cartas completamente nuevas del nuevo mazo
    const r = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=9`);
    const d = await r.json();
   
    // 6. Repartimos el nuevo set de cartas
    jugador = d.cards.slice(0, 2);
    cpu = d.cards.slice(2, 4);
    mesa = d.cards.slice(4, 9); // Las 5 nuevas cartas de la mesa listas en memoria

    // 7. Dibujamos la nueva interfaz
    jugador.forEach(c => crear(c.image, jugadorDiv));

    // Cartas de CPU ocultas
    cpu.forEach(() =>
        crear("https://deckofcardsapi.com/static/img/back.png", cpuDiv)
    );
    
    // Cartas de la Mesa ocultas (Pre-Flop)
    for (let i = 0; i < 5; i++) {
        crear("https://deckofcardsapi.com/static/img/back.png", mesaDiv);
    }

    estadoTxt.innerText = "Pre-Flop: Haz tus apuestas y revela la mesa.";
}

function ajustar(v) {
    if (!enJuego) return;

    if (v > 0) {
        if (dinero < v) return;
        dinero -= v;
        apuesta += v;
        pot += v * 2;
    } else {
        if (apuesta + v < 100) return; // Mínimo de apuesta
        dinero += Math.abs(v);
        apuesta += v;
        pot -= Math.abs(v) * 2;
    }

    actualizarUI();
}

function siguienteRonda() {
    if (!enJuego) return;

    // Límite de 3 clicks
    if (ronda >= 3) {
        estadoTxt.innerText = "Ya se revelaron todas las cartas.";
        return;
    }

    mesaDiv.innerHTML = "";

    if (ronda === 0) {
        for (let i = 0; i < 3; i++) {
            crear(mesa[i].image, mesaDiv);
        }

        for (let i = 3; i < 5; i++) {
            crear("https://deckofcardsapi.com/static/img/back.png", mesaDiv);
        }

        estadoTxt.innerText = "Flop";
        ronda++;
    }
    else if (ronda === 1) {
        for (let i = 0; i < 4; i++) {
            crear(mesa[i].image, mesaDiv);
        }

        crear("https://deckofcardsapi.com/static/img/back.png", mesaDiv);

        estadoTxt.innerText = "Turn";
        ronda++;
    }
    else if (ronda === 2) {
        mesa.forEach(c => crear(c.image, mesaDiv));

        estadoTxt.innerText = "River - ¡Ya puedes quedarte para definir la partida!";
        ronda++;
    }
}
function resolver() {
    if (!enJuego) return;

    if (ronda < 3) {
        estadoTxt.innerText = "Debes revelar toda la mesa";
        return;
    }

    cpuDiv.innerHTML = "";
    cpu.forEach(card => crear(card.image, cpuDiv));

    const manoJugador = evaluar(jugador, mesa);
    const manoCPU = evaluar(cpu, mesa);

    let resultado = "";

    if (manoJugador.valor > manoCPU.valor) {
        dinero += pot;
        resultado = `¡GANASTE! \n Tu mano: ${manoJugador.nombre}`;
    } 
    else if (manoJugador.valor < manoCPU.valor) {
        resultado = `PERDISTE \n La CPU ganó con ${manoCPU.nombre}`;
    } 
    else {
        dinero += pot / 2;
        resultado = "¡EMPATE!";
    }

    actualizarUI();

    // --- se muestra la pantalla flotante ---
    setTimeout(() => {
        mensajeResultado.innerText = resultado;
        pantallaFin.style.display = "flex"; // Mostramos el modal
    }, 2000); // Esperamos 2 segundo para que el jugador vea las cartas antes del cartel
}

function fold() {
    if (!enJuego) return;
    
    mensajeResultado.innerText = "Te retiraste de la mesa.";
    pantallaFin.style.display = "flex";
    
    enJuego = false;
    actualizarUI();
}

function crear(img, cont) {
    const el = document.createElement("img");
    el.src = img;
    cont.appendChild(el);
}

function actualizarUI() {
    dineroTxt.innerText = "Dinero: $" + dinero;
    apuestaTxt.innerText = "Apuesta: $" + apuesta;
    potTxt.innerText = "Bote: $" + pot;
}

function reset() {
    enJuego = false;
    apuesta = 100;
    pot = 0;
    actualizarUI();
}

function evaluar(hand, mesa) {
    const all = [...hand, ...mesa];
    const valores = all.map(c => convertir(c.value));
    const palos = all.map(c => c.suit);

    const count = {};
    valores.forEach(v => {
        count[v] = (count[v] || 0) + 1;
    });

    let pares = 0;
    let trio = false;
    let poker = false;

    for (let v in count) {
        if (count[v] === 4) poker = true;
        if (count[v] === 3) trio = true;
        if (count[v] === 2) pares++;
    }

    const suitCount = {};
    palos.forEach(p => {
        suitCount[p] = (suitCount[p] || 0) + 1;
    });

    let color = false;
    for (let s in suitCount) {
        if (suitCount[s] >= 5) color = true;
    }

    const unicos = [...new Set(valores)].sort((a, b) => a - b);
    let consecutivos = 1;
    let escalera = false;

    for (let i = 1; i < unicos.length; i++) {
        if (unicos[i] === unicos[i - 1] + 1) {
            consecutivos++;
            if (consecutivos >= 5) escalera = true;
        } else {
            consecutivos = 1;
        }
    }

//Arreglo para que no tome cartas de mesa
    const valoresJugador = hand.map(c => convertir(c.value));

let paresJugador = 0;

for (let v in count) {
    const valor = Number(v);

    if (
        count[v] >= 2 &&
        valoresJugador.includes(valor)
    ) {
        paresJugador++;
    }
} 
 // Rankings de combinaciones
if (escalera && color) return { valor: 9, nombre: "Escalera de Color" };
if (poker) return { valor: 8, nombre: "Poker" };
if (color) return { valor: 7, nombre: "Color" };
if (trio && pares >= 1) return { valor: 6, nombre: "Full House" };
if (escalera) return { valor: 5, nombre: "Escalera" };
if (trio) return { valor: 4, nombre: "Trío" };
if (paresJugador >= 2) return { valor: 3, nombre: "Doble Pareja" };
if (paresJugador === 1) return { valor: 2, nombre: "Pareja" };
return { valor: 1, nombre: "Carta Alta" };
}

function convertir(v) {
    if (v === "ACE") return 14;
    if (v === "KING") return 13;
    if (v === "QUEEN") return 12;
    if (v === "JACK") return 11;
    return Number(v);
}

// Iniciar automáticamente el primer juego
crearPartida();