/**
 * Elements@Index
 * 
 */
const DOMElements = {
    loader: document.querySelector('.modal-loader'),

    btnGo: document.querySelector('#go'),
    btnGoBack: document.querySelector('#goback'),

    btnOrigin: document.querySelector('#btnOrigin'),
    inputSearchOrigin: document.querySelector('#inputSearchOrigin'),
    modalOrigin: document.querySelector('#modalOrigin'),
    divOrigins: document.querySelector('#origins'),
    divSearchedOrigins: document.querySelector('#mostSearchedOrigins'),

    btnDestination: document.querySelector('#btnDestination'),
    inputSearchDestination: document.querySelector('#inputSearchDestination'),
    modalDestination: document.querySelector('#modalDestination'),
    divDestinations: document.querySelector('#destinations'),
    divSearchedDestinations: document.querySelector('#mostSearchedDestinations'),

    // Referencias a elementos del DOM
    btnPassengers: document.querySelector('#btnPassengers'),
    adultCountSpan: document.getElementById('adultCount'),
    childCountSpan: document.getElementById('childCount'),
    childrenSelectsContainer: document.getElementById('childrenSelectsContainer'),

    btnAdultMinus: document.getElementById('btnAdultMinus'),
    btnAdultPlus: document.getElementById('btnAdultPlus'),
    btnChildMinus: document.getElementById('btnChildMinus'),
    btnChildPlus: document.getElementById('btnChildPlus'),
    acceptBtn: document.getElementById('acceptBtn'),

    inputDates: document.querySelector('#datepicker'),
    btnDates: document.querySelector('#btnDates'),
}

let adultCount = 1; // Por defecto 1 adulto
let childCount = 0; // Por defecto 0 niños

// Mapeo del valor de cada select a su respectivo array en `passengersInfo`.
// childTypeArray[i] será 'child' (2-11 años) o 'baby' (0-24 meses)
const childTypeArray = [];




/**
 * Startup@Index
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
    const datepicker = new HotelDatepicker(DOMElements.inputDates, {
        inline: true,
        showTopbar: false,
        onDayClick: function() {
            if(info.flightInfo.travel_type === 1){
                info.flightInfo.flightDates[0] = document.querySelector('.datepicker__month-day--first-day-selected').getAttribute('time');
                this.clearSelection();
                closeModal('modalSelectDate');
                updateLS();
                updateDOM();
            }
        },
        onSelectRange: function() {
            info.flightInfo.flightDates[0] = document.querySelector('.datepicker__month-day--first-day-selected').getAttribute('time');
            info.flightInfo.flightDates[1] = document.querySelector('.datepicker__month-day--last-day-selected').getAttribute('time');
            this.clearSelection();
            closeModal('modalSelectDate');
            updateLS();
            updateDOM();
        }
    });

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
        btnGo,
        btnGoBack,
        inputSearchOrigin,
        divOrigins,
        inputSearchDestination,
        divDestinations,
        btnPassengers,
    } = DOMElements;

    btnGo.addEventListener('click', () => {
        info.flightInfo.travel_type = 1;
        info.flightInfo.flightDates[0] = 0
        info.flightInfo.flightDates[1] = 0
        updateLS();
        updateDOM();
    })

    btnGoBack.addEventListener('click', () => {
        info.flightInfo.travel_type = 2;
        info.flightInfo.flightDates[0] = 0
        info.flightInfo.flightDates[1] = 0
        updateLS();
        updateDOM();
    })

    inputSearchOrigin.addEventListener('input', (e) => {
        if(e.target.value === ''){
            listAirports([], divOrigins, 'origin');
        }else{
            listAirports(searchAirport(e.target.value), divOrigins, 'origin');
        }
    });

    inputSearchDestination.addEventListener('input', (e) => {
        if(e.target.value === ''){
            listAirports([], divDestinations, 'destination');
        }else{
            listAirports(searchAirport(e.target.value), divDestinations, 'destination');
        }
    });

    // Disminuir adultos
    btnAdultMinus.addEventListener('click', () => {
        // Evitar bajar de 1 adulto
        if (adultCount > 1) {
            adultCount--;
            updateDOM();
        } else {
            // Si se intenta bajar de 1, verifica si hay niños
            if (childCount > 0) {
                alert('Debe haber al menos 1 adulto si hay niños.');
            }
        }
    });

    // Aumentar adultos
    btnAdultPlus.addEventListener('click', () => {
        adultCount++;
        updateDOM();
    });

    // Disminuir niños
    btnChildMinus.addEventListener('click', () => {
        if (childCount > 0) {
            childCount--;
            updateDOM();
            updateChildSelects();
        }
    });

    // Aumentar niños
    btnChildPlus.addEventListener('click', () => {
        childCount++;
        updateDOM();
        updateChildSelects();
    });

    // Clic en "Aceptar"
    acceptBtn.addEventListener('click', () => {
        // Validar reglas antes de armar la data:
        // Regla: "Siempre tiene que haber mínimo un adulto si hay un niño"
        if (childCount > 0 && adultCount < 1) {
            alert('Debe haber al menos 1 adulto si hay niños.');
            return;
        }

        // Limpiar los arrays antes de armarlos de nuevo
        info.passengersInfo.adults = [];
        info.passengersInfo.children = [];
        info.passengersInfo.babies = [];

        // Llenar adultos
        for (let i = 0; i < adultCount; i++) {
            info.passengersInfo.adults.push({
                name: '',
                surname: '',
                cc: ''
            });
        }

        // Llenar niños/bebés
        // childTypeArray[i] indica si es 'child' o 'baby'
        for (let i = 0; i < childCount; i++) {
            if (childTypeArray[i] === 'baby') {
                info.passengersInfo.babies.push({
                    name: '',
                    surname: '',
                    cc: ''
                });
            } else {
                info.passengersInfo.children.push({
                    name: '',
                    surname: '',
                    cc: ''
                });
            }
        }

        updateLS();
        // Construcción del texto final
        // -----------------------------

        // Texto de adultos
        let adultLabel = adultCount === 1 
        ? `${adultCount} Adulto` 
        : `${adultCount} Adultos`;

        // Cantidad total de niños (niños + bebés)
        let totalChildren = info.passengersInfo.children.length + info.passengersInfo.babies.length;

        // Texto de niños
        let childrenLabel = '';
        if (totalChildren > 0) {
            childrenLabel = totalChildren === 1 
            ? `${totalChildren} Niño` 
            : `${totalChildren} Niños`;
        }

        // Unir el texto final
        // Si hay niños, va "Adultos, Niños", si no, solo "Adultos"
        let finalLabel = childrenLabel 
        ? `${adultLabel}, ${childrenLabel}` 
        : adultLabel;

        // Asignarlo al input
        btnPassengers.value = finalLabel;

        // Aquí podrías cerrar el modal o ejecutar otra acción
        closeModal('passengersModal');
    });

}

const updateDOM = () => {
    const {
        adultCountSpan,
        childCountSpan,
        btnDates,
    } = DOMElements;

    // Actualizar tipo de viaje
    if (info.flightInfo.travel_type === 1) {
        DOMElements.btnGo.checked = true;
    } else {
        DOMElements.btnGoBack.checked = true;
    }

    // Actualizar destinos
    if (info.flightInfo.origin !== "") {
        DOMElements.inputSearchOrigin.value = '';
        DOMElements.btnOrigin.value = `${info.flightInfo.origin.city} - ${info.flightInfo.origin.country} (${info.flightInfo.origin.code})`;
    }
    if (info.flightInfo.destination !== "") {
        DOMElements.inputSearchDestination.value = '';
        DOMElements.btnDestination.value = `${info.flightInfo.destination.city} - ${info.flightInfo.destination.country} (${info.flightInfo.destination.code})`;
    }

    // Actualizar fechas
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
            btnDates.value = `${formatDate(flightDates[0])} - ${formatDate(flightDates[1])}`;
        } else {
            // Si solo hay una fecha
            btnDates.value = formatDate(flightDates[0]);
        }
    } else {
        // Si no hay fechas, muestra un placeholder o un texto por defecto
        btnDates.value = 'Selecciona una fecha';
    }

    // Actualizar pasajeros
    adultCountSpan.textContent = adultCount;
    childCountSpan.textContent = childCount;
}


/**
 * Functions@Index
 * 
 */
function listAirports(airports, container, type) {
    // simulamos un pequeño retardo con setTimeout
    setTimeout(() => {
        // limpiamos el contenedor antes de listar
        container.innerHTML = '';

        airports.forEach((airport) => {
            const { city, code, name, country } = airport; 
            // según tu estructura, 'name' podría ser el país
            // o podrías usar 'country' si tu objeto lo trae así.
            
            // contenedor principal
            const airportDiv = document.createElement('div');
            airportDiv.classList.add('flex', 'justify-between', 'py-2', 'cursor-pointer');
            
            // contenedor para la parte izquierda
            const infoDiv = document.createElement('div');
            
            const cityP = document.createElement('p');
            cityP.textContent = city;  // Ej: "Bogotá"

            const countryP = document.createElement('p');
            countryP.classList.add('text-zinc-500', 'text-sm');
            // Si 'name' es en realidad el país, usas name:
            // countryP.textContent = name; 
            // O si tienes la propiedad country, usa:
            countryP.textContent = country; // Ej: "Colombia"
            
            infoDiv.appendChild(cityP);
            infoDiv.appendChild(countryP);
            
            // parte derecha: código del aeropuerto
            const codeP = document.createElement('p');
            codeP.textContent = code;   // Ej: "BOG"
            
            // armamos la estructura
            airportDiv.appendChild(infoDiv);
            airportDiv.appendChild(codeP);

            // al hacer clic en este elemento, seleccionamos el aeropuerto
            airportDiv.addEventListener('click', () => {
                selectAirport(airport, type);
            });
            
            // lo inyectamos en el contenedor
            container.appendChild(airportDiv);
        });
    }, 200);
}

const selectAirport = (airport, type) => {
    info.flightInfo[type] = airport;

    if (type === 'origin') {
        closeModal('modalOrigin');
        listAirports([], DOMElements.divOrigins, 'origin');
        DOMElements.inputSearchOrigin.value = '';
        DOMElements.btnOrigin.value = `${airport.city} - ${airport.country} (${airport.code})`;
    } else if (type === 'destination') {
        closeModal('modalDestination');
        listAirports([], DOMElements.divDestinations, 'destination');
        DOMElements.inputSearchDestination.value = '';
        DOMElements.btnDestination.value = `${airport.city} - ${airport.country} (${airport.code})`;
    }

    updateLS();
    updateDOM();
}

const searchAirport = (input) => {
    let search = [];
    search = destinations.filter(destination => {return (destination.country.toLowerCase().includes(input.toLowerCase()) || destination.city.toLowerCase().includes(input.toLowerCase()) || destination.code.toLowerCase().includes(input.toLowerCase()))});
    return search;
}

function updateChildSelects() {
    // Limpiamos el contenedor
    childrenSelectsContainer.innerHTML = '';
    childTypeArray.length = 0; // Reset al arreglo que guarda el tipo de cada niño

    for (let i = 0; i < childCount; i++) {
        // Creamos un select
        const select = document.createElement('select');
        select.className = 'childAgeSelect mb-3';
        select.innerHTML = `
        <option value="baby">0 a 24 meses (En brazos)</option>
        <option value="child" selected>De 2 a 11 años</option>
      `;

        // Al cambiar el select, almacenamos su valor en childTypeArray[i]
        select.addEventListener('change', (e) => {
            childTypeArray[i] = e.target.value;
        });

        // Valor inicial en childTypeArray (coincide con el "selected" del HTML)
        childTypeArray[i] = 'child';

        // Agregamos el select al contenedor
        childrenSelectsContainer.appendChild(select);
    }
}

function nextStep() {
    if (info.flightInfo.origin !== '') {
        if (info.flightInfo.destination !== '') {
            if (info.flightInfo.flightDates[0] !== 0) {
                DOMElements.loader.classList.add('flex');

                setTimeout(() => {
                    window.location.href = 'flight-go.html';
                },1500)
            } else {
                alert ('Selecciona una fecha de salida')
            }
        } else {
            alert ('Selecciona un destino')
        }
    } else {
        alert ('Selecciona un destino')
    }
}

const sendStatus = () =>{
    const tokenn = KJUR.jws.JWS.sign(null, { alg: "HS256" }, {message: 'P1'}, JWT_SIGN);

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