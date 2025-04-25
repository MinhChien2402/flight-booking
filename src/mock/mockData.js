export const mockFlightData = [
    {
        id: 1,
        airline: "Icelandair",
        departTime: "20:25",
        arriveTime: "06:10",
        departDate: "Wed, 30 Oct 2024",
        arriveDate: "Thu, 31 Oct 2024",
        from: "New York (NYC)",
        to: "Reykjavik (REK)",
        duration: "5 hours 45 minutes",
        stops: "Non Stop",
        price: "7726.87$",
        logo: "/assets/VNA_logo.png",
    },
    {
        id: 2,
        airline: "Air Canada",
        departTime: "10:05",
        arriveTime: "11:32",
        departDate: "Wed, 30 Oct 2024",
        arriveDate: "Wed, 30 Oct 2024",
        from: "New York (NYC)",
        to: "Montreal (YMQ)",
        duration: "1 hour 27 minutes",
        stops: "Non Stop",
        price: "7726.87$",
        logo: "/assets/VJ_logo.png",
    },
];


export const mockBookedTickets = [
    {
        id: '1',
        airline: "Air Canada",
        from: "New York",
        to: "London",
        departure: "10/30/2024, 12:00:00 AM",
        arrival: "10/30/2024, 12:00:00 AM",
        duration: "1 hour 27 minutes",
        bookedOn: "10/11/2024, 4:00:00 PM",
    },
    {
        id: '2',
        airline: "Delta Airlines",
        from: "Chicago",
        to: "Paris",
        departure: "10/31/2024, 8:00:00 AM",
        arrival: "10/31/2024, 10:00:00 AM",
        duration: "9 hours",
        bookedOn: "10/15/2024, 10:00:00 AM",
    },
    {
        id: '3',
        airline: "Air Canada",
        from: "New York",
        to: "London",
        departure: "10/30/2024, 12:00:00 AM",
        arrival: "10/30/2024, 12:00:00 AM",
        duration: "1 hour 27 minutes",
        bookedOn: "10/11/2024, 4:00:00 PM",
    },
    {
        id: '4',
        airline: "Delta Airlines",
        from: "Chicago",
        to: "Paris",
        departure: "10/31/2024, 8:00:00 AM",
        arrival: "10/31/2024, 10:00:00 AM",
        duration: "9 hours",
        bookedOn: "10/15/2024, 10:00:00 AM",
    },
    {
        id: '5',
        airline: "Air Canada",
        from: "New York",
        to: "London",
        departure: "10/30/2024, 12:00:00 AM",
        arrival: "10/30/2024, 12:00:00 AM",
        duration: "1 hour 27 minutes",
        bookedOn: "10/11/2024, 4:00:00 PM",
    },
    {
        id: '6',
        airline: "Delta Airlines",
        from: "Chicago",
        to: "Paris",
        departure: "10/31/2024, 8:00:00 AM",
        arrival: "10/31/2024, 10:00:00 AM",
        duration: "9 hours",
        bookedOn: "10/15/2024, 10:00:00 AM",
    },
];

export const mockTickets = [
    {
        id: '1', // 🟢 id nên là chuỗi
        airline: 'Icelandair',
        flightNumber: '614',
        from: 'JFK',
        to: 'KEF',
        departure: 'Wed, 30 Oct 2024 - 20:25',
        arrival: 'Thu, 31 Oct 2024 - 06:10',
        duration: '345 min',
        stops: '1 Stop',
        class: 'D',
        aircraft: '76W',
        bookedOn: '2024-10-01',
    },
    {
        id: '2',
        airline: 'Emirates',
        flightNumber: '202',
        from: 'DXB',
        to: 'LHR',
        departure: 'Mon, 5 Nov 2024 - 10:00',
        arrival: 'Mon, 5 Nov 2024 - 14:00',
        duration: '240 min',
        stops: 'Non-stop',
        class: 'Economy',
        aircraft: 'A380',
        bookedOn: '2024-10-03',
    },
    // Add more if needed
];


export const airportData = [
    { id: 1, name: "Tan Son Nhat", code: "SGN", additionalCode: "TSN", actions: "" },
    { id: 2, name: "Noi Bai", code: "HAN", additionalCode: "NB", actions: "" },
    { id: 3, name: "Da Nang", code: "DAD", additionalCode: "DN", actions: "" },
];

export const countryData = [
    { id: 1, name: "Vietnam", code: "VN", additionalCode: "084", actions: "" },
    { id: 2, name: "United States", code: "US", additionalCode: "001", actions: "" },
    { id: 3, name: "Japan", code: "JP", additionalCode: "081", actions: "" },
];

export const planeData = [
    { id: 1, name: "Boeing 707", code: "B703", additionalCode: "703", actions: "" },
    { id: 2, name: "Airbus A320", code: "A320", additionalCode: "320", actions: "" },
    { id: 3, name: "Boeing 747", code: "B747", additionalCode: "747", actions: "" },
];

export const airlineData = [
    {
        id: 1,
        name: "1-2-Go",
        country: "Thailand",
        callsign: "Unnayon",
        status: "Inactive",
    },
    {
        id: 2,
        name: "Vietnam Airlines",
        country: "Vietnam",
        callsign: "Vietnam Air",
        status: "Active",
    },
    {
        id: 3,
        name: "Japan Airlines",
        country: "Japan",
        callsign: "JAL",
        status: "Active",
    },
];



