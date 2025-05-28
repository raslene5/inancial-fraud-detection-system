import { tokens } from "../theme";

export const mockTransactionData = [
  {
    id: 1,
    type: "TRANSFER",
    amount: 5000.75,
    isFraud: 1,
    day: "Monday",
    part_of_the_day: "Morning",
    type_2: "to_merchant"
  },
  {
    id: 2,
    type: "CASH_OUT",
    amount: 320.00,
    isFraud: 0,
    day: "Tuesday",
    part_of_the_day: "Evening",
    type_2: "to_customer"
  },
  {
    id: 3,
    type: "PAYMENT",
    amount: 1540.10,
    isFraud: 0,
    day: "Wednesday",
    part_of_the_day: "Afternoon",
    type_2: "to_business"
  },
  {
    id: 4,
    type: "DEBIT",
    amount: 7999.99,
    isFraud: 1,
    day: "Friday",
    part_of_the_day: "Night",
    type_2: "to_merchant"
  },
  {
    id: 5,
    type: "TRANSFER",
    amount: 250.00,
    isFraud: 0,
    day: "Saturday",
    part_of_the_day: "Morning",
    type_2: "to_customer"
  },
  {
    id: 6,
    type: "CASH_IN",
    amount: 1050.55,
    isFraud: 0,
    day: "Thursday",
    part_of_the_day: "Afternoon",
    type_2: "to_self"
  },
  {
    id: 7,
    type: "TRANSFER",
    amount: 65000.00,
    isFraud: 1,
    day: "Sunday",
    part_of_the_day: "Evening",
    type_2: "to_merchant"
  },
  {
    id: 8,
    type: "PAYMENT",
    amount: 720.35,
    isFraud: 0,
    day: "Wednesday",
    part_of_the_day: "Morning",
    type_2: "to_business"
  },
  {
    id: 9,
    type: "CASH_OUT",
    amount: 1890.60,
    isFraud: 0,
    day: "Monday",
    part_of_the_day: "Night",
    type_2: "to_customer"
  }
];


export const mockDataContacts = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    age: 35,
    phone: "(665)121-5454",
    address: "0912 Won Street, Alabama, SY 10001",
    city: "New York",
    zipCode: "10001",
    registrarId: 123512,
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    age: 42,
    phone: "(421)314-2288",
    address: "1234 Main Street, New York, NY 10001",
    city: "New York",
    zipCode: "13151",
    registrarId: 123512,
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    age: 45,
    phone: "(422)982-6739",
    address: "3333 Want Blvd, Estanza, NAY 42125",
    city: "New York",
    zipCode: "87281",
    registrarId: 4132513,
  },
  {
    id: 4,
    name: "Anya Stark",
    email: "anyastark@gmail.com",
    age: 16,
    phone: "(921)425-6742",
    address: "1514 Main Street, New York, NY 22298",
    city: "New York",
    zipCode: "15551",
    registrarId: 123512,
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    email: "daenerystargaryen@gmail.com",
    age: 31,
    phone: "(421)445-1189",
    address: "11122 Welping Ave, Tenting, CD 21321",
    city: "Tenting",
    zipCode: "14215",
    registrarId: 123512,
  },
  {
    id: 6,
    name: "Ever Melisandre",
    email: "evermelisandre@gmail.com",
    age: 150,
    phone: "(232)545-6483",
    address: "1234 Canvile Street, Esvazark, NY 10001",
    city: "Esvazark",
    zipCode: "10001",
    registrarId: 123512,
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    email: "ferraraclifford@gmail.com",
    age: 44,
    phone: "(543)124-0123",
    address: "22215 Super Street, Everting, ZO 515234",
    city: "Evertin",
    zipCode: "51523",
    registrarId: 123512,
  },
  {
    id: 8,
    name: "Rossini Frances",
    email: "rossinifrances@gmail.com",
    age: 36,
    phone: "(222)444-5555",
    address: "4123 Ever Blvd, Wentington, AD 142213",
    city: "Esteras",
    zipCode: "44215",
    registrarId: 512315,
  },
  {
    id: 9,
    name: "Harvey Roxie",
    email: "harveyroxie@gmail.com",
    age: 65,
    phone: "(444)555-6239",
    address: "51234 Avery Street, Cantory, ND 212412",
    city: "Colunza",
    zipCode: "111234",
    registrarId: 928397,
  },
  {
    id: 10,
    name: "Enteri Redack",
    email: "enteriredack@gmail.com",
    age: 42,
    phone: "(222)444-5555",
    address: "4123 Easer Blvd, Wentington, AD 142213",
    city: "Esteras",
    zipCode: "44215",
    registrarId: 533215,
  },
  {
    id: 11,
    name: "Steve Goodman",
    email: "stevegoodmane@gmail.com",
    age: 11,
    phone: "(444)555-6239",
    address: "51234 Fiveton Street, CunFory, ND 212412",
    city: "Colunza",
    zipCode: "1234",
    registrarId: 92197,
  },
];

export const mockDataInvoices = [
  {
    id: 1,
    name: "Jon Snow",
    email: "jonsnow@gmail.com",
    cost: "21.24",
    phone: "(665)121-5454",
    date: "03/12/2022",
  },
  {
    id: 2,
    name: "Cersei Lannister",
    email: "cerseilannister@gmail.com",
    cost: "1.24",
    phone: "(421)314-2288",
    date: "06/15/2021",
  },
  {
    id: 3,
    name: "Jaime Lannister",
    email: "jaimelannister@gmail.com",
    cost: "11.24",
    phone: "(422)982-6739",
    date: "05/02/2022",
  },
  {
    id: 4,
    name: "Anya Stark",
    email: "anyastark@gmail.com",
    cost: "80.55",
    phone: "(921)425-6742",
    date: "03/21/2022",
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    email: "daenerystargaryen@gmail.com",
    cost: "1.24",
    phone: "(421)445-1189",
    date: "01/12/2021",
  },
  {
    id: 6,
    name: "Ever Melisandre",
    email: "evermelisandre@gmail.com",
    cost: "63.12",
    phone: "(232)545-6483",
    date: "11/02/2022",
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    email: "ferraraclifford@gmail.com",
    cost: "52.42",
    phone: "(543)124-0123",
    date: "02/11/2022",
  },
  {
    id: 8,
    name: "Rossini Frances",
    email: "rossinifrances@gmail.com",
    cost: "21.24",
    phone: "(222)444-5555",
    date: "05/02/2021",
  },
];

export const mockTransactions = [
  {
    txId: "01e4dsa",
    user: "johndoe",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "51034szv",
    user: "goodmanave",
    date: "2022-11-05",
    cost: "200.95",
  },
  {
    txId: "0a123sb",
    user: "stevebower",
    date: "2022-11-02",
    cost: "13.55",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "120s51a",
    user: "wootzifer",
    date: "2019-04-15",
    cost: "24.20",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
];

export const mockBarData = [
  {
    country: "AD",
    "Legit Transactions": 137,
    "Legit TransactionsColor": "hsl(229, 70%, 50%)",
    "Fraudulent Transactions": 96,
    "Fraudulent TransactionsColor": "hsl(296, 70%, 50%)",
    "Chargebacks": 72,
    "ChargebacksColor": "hsl(97, 70%, 50%)",
    "Alerts Triggered": 140,
    "Alerts TriggeredColor": "hsl(340, 70%, 50%)",
  },
  {
    country: "AE",
    "Legit Transactions": 55,
    "Legit TransactionsColor": "hsl(307, 70%, 50%)",
    "Fraudulent Transactions": 28,
    "Fraudulent TransactionsColor": "hsl(111, 70%, 50%)",
    "Chargebacks": 58,
    "ChargebacksColor": "hsl(273, 70%, 50%)",
    "Alerts Triggered": 29,
    "Alerts TriggeredColor": "hsl(275, 70%, 50%)",
  },
  {
    country: "AF",
    "Legit Transactions": 109,
    "Legit TransactionsColor": "hsl(72, 70%, 50%)",
    "Fraudulent Transactions": 23,
    "Fraudulent TransactionsColor": "hsl(96, 70%, 50%)",
    "Chargebacks": 34,
    "ChargebacksColor": "hsl(106, 70%, 50%)",
    "Alerts Triggered": 152,
    "Alerts TriggeredColor": "hsl(256, 70%, 50%)",
  },
  {
    country: "AG",
    "Legit Transactions": 133,
    "Legit TransactionsColor": "hsl(257, 70%, 50%)",
    "Fraudulent Transactions": 52,
    "Fraudulent TransactionsColor": "hsl(326, 70%, 50%)",
    "Chargebacks": 43,
    "ChargebacksColor": "hsl(110, 70%, 50%)",
    "Alerts Triggered": 83,
    "Alerts TriggeredColor": "hsl(9, 70%, 50%)",
  },
  {
    country: "AI",
    "Legit Transactions": 81,
    "Legit TransactionsColor": "hsl(190, 70%, 50%)",
    "Fraudulent Transactions": 80,
    "Fraudulent TransactionsColor": "hsl(325, 70%, 50%)",
    "Chargebacks": 112,
    "ChargebacksColor": "hsl(54, 70%, 50%)",
    "Alerts Triggered": 35,
    "Alerts TriggeredColor": "hsl(285, 70%, 50%)",
  },
  {
    country: "AL",
    "Legit Transactions": 66,
    "Legit TransactionsColor": "hsl(208, 70%, 50%)",
    "Fraudulent Transactions": 111,
    "Fraudulent TransactionsColor": "hsl(334, 70%, 50%)",
    "Chargebacks": 167,
    "ChargebacksColor": "hsl(182, 70%, 50%)",
    "Alerts Triggered": 18,
    "Alerts TriggeredColor": "hsl(76, 70%, 50%)",
  },
  {
    country: "AM",
    "Legit Transactions": 80,
    "Legit TransactionsColor": "hsl(87, 70%, 50%)",
    "Fraudulent Transactions": 47,
    "Fraudulent TransactionsColor": "hsl(141, 70%, 50%)",
    "Chargebacks": 158,
    "ChargebacksColor": "hsl(224, 70%, 50%)",
    "Alerts Triggered": 49,
    "Alerts TriggeredColor": "hsl(274, 70%, 50%)",
  },
];


export const mockPieData = [
  {
    id: "hack",
    label: "Hack Attempts",
    value: 239,
    color: "#f44336", // red
  },
  {
    id: "make",
    label: "Automated Scripts",
    value: 170,
    color: "#ff9800", // orange
  },
  {
    id: "go",
    label: "Legitimate",
    value: 322,
    color: "#4caf50", // green
  },
  {
    id: "lisp",
    label: "Phishing",
    value: 503,
    color: "#3f51b5", // blue
  },
  {
    id: "scala",
    label: "Anomalies",
    value: 584,
    color: "#9c27b0", // purple
  },
];

export const mockLineData = [
  {
    id: "fraudulent_transactions",
    color: tokens("dark").greenAccent[500],
    data: [
      {
        x: "2024-01-01",  // Date or time period
        y: 5,  // Number of fraudulent transactions in January
      },
      {
        x: "2024-02-01",
        y: 12,
      },
      {
        x: "2024-03-01",
        y: 8,
      },
      {
        x: "2024-04-01",
        y: 15,
      },
      {
        x: "2024-05-01",
        y: 20,
      },
      {
        x: "2024-06-01",
        y: 10,
      },
      {
        x: "2024-07-01",
        y: 18,
      },
      {
        x: "2024-08-01",
        y: 25,
      },
      {
        x: "2024-09-01",
        y: 30,
      },
      {
        x: "2024-10-01",
        y: 22,
      },
      {
        x: "2024-11-01",
        y: 28,
      },
      {
        x: "2024-12-01",
        y: 35,
      },
    ],
  },
  {
    id: "fraud_amount",
    color: tokens("dark").blueAccent[300],
    data: [
      {
        x: "2024-01-01",  // Date or time period
        y: 500,  // Amount in USD of fraud in January
      },
      {
        x: "2024-02-01",
        y: 1200,
      },
      {
        x: "2024-03-01",
        y: 800,
      },
      {
        x: "2024-04-01",
        y: 1500,
      },
      {
        x: "2024-05-01",
        y: 2000,
      },
      {
        x: "2024-06-01",
        y: 1000,
      },
      {
        x: "2024-07-01",
        y: 1800,
      },
      {
        x: "2024-08-01",
        y: 2500,
      },
      {
        x: "2024-09-01",
        y: 3000,
      },
      {
        x: "2024-10-01",
        y: 2200,
      },
      {
        x: "2024-11-01",
        y: 2800,
      },
      {
        x: "2024-12-01",
        y: 3500,
      },
    ],
  },
  {
    id: "fraud_detection_score",
    color: tokens("dark").redAccent[200],
    data: [
      {
        x: "2024-01-01",  // Date or time period
        y: 85,  // Fraud detection score in January
      },
      {
        x: "2024-02-01",
        y: 80,
      },
      {
        x: "2024-03-01",
        y: 75,
      },
      {
        x: "2024-04-01",
        y: 70,
      },
      {
        x: "2024-05-01",
        y: 65,
      },
      {
        x: "2024-06-01",
        y: 60,
      },
      {
        x: "2024-07-01",
        y: 55,
      },
      {
        x: "2024-08-01",
        y: 50,
      },
      {
        x: "2024-09-01",
        y: 45,
      },
      {
        x: "2024-10-01",
        y: 40,
      },
      {
        x: "2024-11-01",
        y: 35,
      },
      {
        x: "2024-12-01",
        y: 30,
      },
    ],
  },
];

export const mockGeographyData = [
  {
    id: "AFG",
    value: 520600,
  },
  {
    id: "AGO",
    value: 949905,
  },
  {
    id: "ALB",
    value: 329910,
  },
  {
    id: "ARE",
    value: 675484,
  },
  {
    id: "ARG",
    value: 432239,
  },
  {
    id: "ARM",
    value: 288305,
  },
  {
    id: "ATA",
    value: 415648,
  },
  {
    id: "ATF",
    value: 665159,
  },
  {
    id: "AUT",
    value: 798526,
  },
  {
    id: "AZE",
    value: 481678,
  },
  {
    id: "BDI",
    value: 496457,
  },
  {
    id: "BEL",
    value: 252276,
  },
  {
    id: "BEN",
    value: 440315,
  },
  {
    id: "BFA",
    value: 343752,
  },
  {
    id: "BGD",
    value: 920203,
  },
  {
    id: "BGR",
    value: 261196,
  },
  {
    id: "BHS",
    value: 421551,
  },
  {
    id: "BIH",
    value: 974745,
  },
  {
    id: "BLR",
    value: 349288,
  },
  {
    id: "BLZ",
    value: 305983,
  },
  {
    id: "BOL",
    value: 430840,
  },
  {
    id: "BRN",
    value: 345666,
  },
  {
    id: "BTN",
    value: 649678,
  },
  {
    id: "BWA",
    value: 319392,
  },
  {
    id: "CAF",
    value: 722549,
  },
  {
    id: "CAN",
    value: 332843,
  },
  {
    id: "CHE",
    value: 122159,
  },
  {
    id: "CHL",
    value: 811736,
  },
  {
    id: "CHN",
    value: 593604,
  },
  {
    id: "CIV",
    value: 143219,
  },
  {
    id: "CMR",
    value: 630627,
  },
  {
    id: "COG",
    value: 498556,
  },
  {
    id: "COL",
    value: 660527,
  },
  {
    id: "CRI",
    value: 60262,
  },
  {
    id: "CUB",
    value: 177870,
  },
  {
    id: "-99",
    value: 463208,
  },
  {
    id: "CYP",
    value: 945909,
  },
  {
    id: "CZE",
    value: 500109,
  },
  {
    id: "DEU",
    value: 63345,
  },
  {
    id: "DJI",
    value: 634523,
  },
  {
    id: "DNK",
    value: 731068,
  },
  {
    id: "DOM",
    value: 262538,
  },
  {
    id: "DZA",
    value: 760695,
  },
  {
    id: "ECU",
    value: 301263,
  },
  {
    id: "EGY",
    value: 148475,
  },
  {
    id: "ERI",
    value: 939504,
  },
  {
    id: "ESP",
    value: 706050,
  },
  {
    id: "EST",
    value: 977015,
  },
  {
    id: "ETH",
    value: 461734,
  },
  {
    id: "FIN",
    value: 22800,
  },
  {
    id: "FJI",
    value: 18985,
  },
  {
    id: "FLK",
    value: 64986,
  },
  {
    id: "FRA",
    value: 447457,
  },
  {
    id: "GAB",
    value: 669675,
  },
  {
    id: "GBR",
    value: 757120,
  },
  {
    id: "GEO",
    value: 158702,
  },
  {
    id: "GHA",
    value: 893180,
  },
  {
    id: "GIN",
    value: 877288,
  },
  {
    id: "GMB",
    value: 724530,
  },
  {
    id: "GNB",
    value: 387753,
  },
  {
    id: "GNQ",
    value: 706118,
  },
  {
    id: "GRC",
    value: 377796,
  },
  {
    id: "GTM",
    value: 66890,
  },
  {
    id: "GUY",
    value: 719300,
  },
  {
    id: "HND",
    value: 739590,
  },
  {
    id: "HRV",
    value: 929467,
  },
  {
    id: "HTI",
    value: 538961,
  },
  {
    id: "HUN",
    value: 146095,
  },
  {
    id: "IDN",
    value: 490681,
  },
  {
    id: "IND",
    value: 549818,
  },
  {
    id: "IRL",
    value: 630163,
  },
  {
    id: "IRN",
    value: 596921,
  },
  {
    id: "IRQ",
    value: 767023,
  },
  {
    id: "ISL",
    value: 478682,
  },
  {
    id: "ISR",
    value: 963688,
  },
  {
    id: "ITA",
    value: 393089,
  },
  {
    id: "JAM",
    value: 83173,
  },
  {
    id: "JOR",
    value: 52005,
  },
  {
    id: "JPN",
    value: 199174,
  },
  {
    id: "KAZ",
    value: 181424,
  },
  {
    id: "KEN",
    value: 60946,
  },
  {
    id: "KGZ",
    value: 432478,
  },
  {
    id: "KHM",
    value: 254461,
  },
  {
    id: "OSA",
    value: 942447,
  },
  {
    id: "KWT",
    value: 414413,
  },
  {
    id: "LAO",
    value: 448339,
  },
  {
    id: "LBN",
    value: 620090,
  },
  {
    id: "LBR",
    value: 435950,
  },
  {
    id: "LBY",
    value: 75091,
  },
  {
    id: "LKA",
    value: 595124,
  },
  {
    id: "LSO",
    value: 483524,
  },
  {
    id: "LTU",
    value: 867357,
  },
  {
    id: "LUX",
    value: 689172,
  },
  {
    id: "LVA",
    value: 742980,
  },
  {
    id: "MAR",
    value: 236538,
  },
  {
    id: "MDA",
    value: 926836,
  },
  {
    id: "MDG",
    value: 840840,
  },
  {
    id: "MEX",
    value: 353910,
  },
  {
    id: "MKD",
    value: 505842,
  },
  {
    id: "MLI",
    value: 286082,
  },
  {
    id: "MMR",
    value: 915544,
  },
  {
    id: "MNE",
    value: 609500,
  },
  {
    id: "MNG",
    value: 410428,
  },
  {
    id: "MOZ",
    value: 32868,
  },
  {
    id: "MRT",
    value: 375671,
  },
  {
    id: "MWI",
    value: 591935,
  },
  {
    id: "MYS",
    value: 991644,
  },
  {
    id: "NAM",
    value: 701897,
  },
  {
    id: "NCL",
    value: 144098,
  },
  {
    id: "NER",
    value: 312944,
  },
  {
    id: "NGA",
    value: 862877,
  },
  {
    id: "NIC",
    value: 90831,
  },
  {
    id: "NLD",
    value: 281879,
  },
  {
    id: "NOR",
    value: 224537,
  },
  {
    id: "NPL",
    value: 322331,
  },
  {
    id: "NZL",
    value: 86615,
  },
  {
    id: "OMN",
    value: 707881,
  },
  {
    id: "PAK",
    value: 158577,
  },
  {
    id: "PAN",
    value: 738579,
  },
  {
    id: "PER",
    value: 248751,
  },
  {
    id: "PHL",
    value: 557292,
  },
  {
    id: "PNG",
    value: 516874,
  },
  {
    id: "POL",
    value: 682137,
  },
  {
    id: "PRI",
    value: 957399,
  },
  {
    id: "PRT",
    value: 846430,
  },
  {
    id: "PRY",
    value: 720555,
  },
  {
    id: "QAT",
    value: 478726,
  },
  {
    id: "ROU",
    value: 259318,
  },
  {
    id: "RUS",
    value: 268735,
  },
  {
    id: "RWA",
    value: 136781,
  },
  {
    id: "ESH",
    value: 151957,
  },
  {
    id: "SAU",
    value: 111821,
  },
  {
    id: "SDN",
    value: 927112,
  },
  {
    id: "SDS",
    value: 966473,
  },
  {
    id: "SEN",
    value: 158085,
  },
  {
    id: "SLB",
    value: 178389,
  },
  {
    id: "SLE",
    value: 528433,
  },
  {
    id: "SLV",
    value: 353467,
  },
  {
    id: "ABV",
    value: 251,
  },
  {
    id: "SOM",
    value: 445243,
  },
  {
    id: "SRB",
    value: 202402,
  },
  {
    id: "SUR",
    value: 972121,
  },
  {
    id: "SVK",
    value: 319923,
  },
  {
    id: "SVN",
    value: 728766,
  },
  {
    id: "SWZ",
    value: 379669,
  },
  {
    id: "SYR",
    value: 16221,
  },
  {
    id: "TCD",
    value: 101273,
  },
  {
    id: "TGO",
    value: 498411,
  },
  {
    id: "THA",
    value: 506906,
  },
  {
    id: "TJK",
    value: 613093,
  },
  {
    id: "TKM",
    value: 327016,
  },
  {
    id: "TLS",
    value: 607972,
  },
  {
    id: "TTO",
    value: 936365,
  },
  {
    id: "TUN",
    value: 898416,
  },
  {
    id: "TUR",
    value: 237783,
  },
  {
    id: "TWN",
    value: 878213,
  },
  {
    id: "TZA",
    value: 442174,
  },
  {
    id: "UGA",
    value: 720710,
  },
  {
    id: "UKR",
    value: 74172,
  },
  {
    id: "URY",
    value: 753177,
  },
  {
    id: "USA",
    value: 658725,
  },
  {
    id: "UZB",
    value: 550313,
  },
  {
    id: "VEN",
    value: 707492,
  },
  {
    id: "VNM",
    value: 538907,
  },
  {
    id: "VUT",
    value: 650646,
  },
  {
    id: "PSE",
    value: 476078,
  },
  {
    id: "YEM",
    value: 957751,
  },
  {
    id: "ZAF",
    value: 836949,
  },
  {
    id: "ZMB",
    value: 714503,
  },
  {
    id: "ZWE",
    value: 405217,
  },
  {
    id: "KOR",
    value: 171135,
  },
];