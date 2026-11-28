import type { ZoneAlert, ZoneMeter, ZoneUser } from "../types/zoneAdmin";

export const zoneName = "Mangalore North";

export const initialZoneMeters: ZoneMeter[] = [
    { id: "m-20418", meterNumber: "MNG-20418", customer: "Rahul Sharma", email: "rahul.sharma@email.com", address: "12, Kadri Hills, Mangalore", meterType: "Smart meter", status: "Active", lastReading: 16743.2, lastSync: "Today, 10:42 AM", monthlyUsage: 348.9, installedOn: "2023-08-16" },
    { id: "m-20419", meterNumber: "MNG-20419", customer: "Ananya Rao", email: "ananya.rao@email.com", address: "8, Bejai Main Road, Mangalore", meterType: "Smart meter", status: "Active", lastReading: 12538.6, lastSync: "Today, 10:35 AM", monthlyUsage: 292.4, installedOn: "2022-11-03" },
    { id: "m-20420", meterNumber: "MNG-20420", customer: "Vikram Hegde", email: "vikram.h@email.com", address: "41, Kottara Chowki, Mangalore", meterType: "Prepaid meter", status: "Offline", lastReading: 9872.1, lastSync: "Yesterday, 7:18 PM", monthlyUsage: 0, installedOn: "2021-04-29" },
    { id: "m-20421", meterNumber: "MNG-20421", customer: "Meera Pai", email: "meera.pai@email.com", address: "3, Urwa Market, Mangalore", meterType: "Smart meter", status: "Active", lastReading: 22109.7, lastSync: "Today, 10:21 AM", monthlyUsage: 410.2, installedOn: "2024-01-11" },
    { id: "m-20422", meterNumber: "MNG-20422", customer: "Arjun Shetty", email: "arjun.s@email.com", address: "19, Derebail, Mangalore", meterType: "Smart meter", status: "Maintenance", lastReading: 11084.3, lastSync: "Nov 26, 2:10 PM", monthlyUsage: 126.7, installedOn: "2020-09-07" },
    { id: "m-20423", meterNumber: "MNG-20423", customer: "Nisha D'Souza", email: "nisha.ds@email.com", address: "5, Kulshekar, Mangalore", meterType: "Prepaid meter", status: "Active", lastReading: 18326.9, lastSync: "Today, 9:57 AM", monthlyUsage: 305.1, installedOn: "2023-05-22" },
    { id: "m-20424", meterNumber: "MNG-20424", customer: "Kiran Bhat", email: "kiran.bhat@email.com", address: "27, Ashok Nagar, Mangalore", meterType: "Smart meter", status: "Active", lastReading: 14520.4, lastSync: "Today, 9:46 AM", monthlyUsage: 267.8, installedOn: "2022-02-14" },
    { id: "m-20425", meterNumber: "MNG-20425", customer: "Priya Kamath", email: "priya.k@email.com", address: "14, Lalbagh, Mangalore", meterType: "Smart meter", status: "Offline", lastReading: 7610.2, lastSync: "Nov 25, 8:32 PM", monthlyUsage: 0, installedOn: "2021-12-01" },
    { id: "m-20426", meterNumber: "MNG-20426", customer: "Devraj Alva", email: "devraj.alva@email.com", address: "6, Bendoor, Mangalore", meterType: "Prepaid meter", status: "Active", lastReading: 19882.8, lastSync: "Today, 9:31 AM", monthlyUsage: 382.6, installedOn: "2024-06-19" },
    { id: "m-20427", meterNumber: "MNG-20427", customer: "Sana Ahmed", email: "sana.ahmed@email.com", address: "33, Falnir, Mangalore", meterType: "Smart meter", status: "Active", lastReading: 13240.1, lastSync: "Today, 9:18 AM", monthlyUsage: 318.5, installedOn: "2023-10-28" },
    { id: "m-20428", meterNumber: "MNG-20428", customer: "Rohan Nayak", email: "rohan.nayak@email.com", address: "2, Bondel, Mangalore", meterType: "Smart meter", status: "Maintenance", lastReading: 9044.8, lastSync: "Nov 27, 4:05 PM", monthlyUsage: 88.4, installedOn: "2019-07-12" },
    { id: "m-20429", meterNumber: "MNG-20429", customer: "Divya Prabhu", email: "divya.p@email.com", address: "17, Kadri Kambla, Mangalore", meterType: "Smart meter", status: "Active", lastReading: 17402.5, lastSync: "Today, 8:54 AM", monthlyUsage: 337.9, installedOn: "2022-05-30" },
];

export const initialZoneUsers: ZoneUser[] = [
    { id: "zu-01", name: "Sowmya Kini", email: "sowmya.kini@mdms.in", phone: "+91 98450 22011", role: "Zone Admin", status: "Active", lastActive: "Today, 10:36 AM", joinedOn: "2024-02-12" },
    { id: "zu-02", name: "Naveen Kumar", email: "naveen.kumar@mdms.in", phone: "+91 98450 22012", role: "Field Operator", status: "Active", lastActive: "Today, 9:55 AM", joinedOn: "2024-03-05" },
    { id: "zu-03", name: "Fatima Lobo", email: "fatima.lobo@mdms.in", phone: "+91 98450 22013", role: "Customer Support", status: "Active", lastActive: "Today, 9:12 AM", joinedOn: "2024-04-18" },
    { id: "zu-04", name: "Prakash Shetty", email: "prakash.shetty@mdms.in", phone: "+91 98450 22014", role: "Field Operator", status: "Invited", lastActive: "Invite pending", joinedOn: "2024-11-20" },
    { id: "zu-05", name: "Asha D'Mello", email: "asha.dmello@mdms.in", phone: "+91 98450 22015", role: "Customer Support", status: "Active", lastActive: "Yesterday, 5:42 PM", joinedOn: "2024-06-09" },
    { id: "zu-06", name: "Harish Poojary", email: "harish.p@mdms.in", phone: "+91 98450 22016", role: "Field Operator", status: "Suspended", lastActive: "Nov 22, 11:08 AM", joinedOn: "2023-11-01" },
    { id: "zu-07", name: "Sanjana Rao", email: "sanjana.rao@mdms.in", phone: "+91 98450 22017", role: "Customer Support", status: "Active", lastActive: "Today, 8:48 AM", joinedOn: "2024-08-27" },
];

export const initialZoneAlerts: ZoneAlert[] = [
    { id: "za-01", title: "Unexpected consumption spike", detail: "Usage is 42% above the customer's 30-day average.", meterNumber: "MNG-20421", location: "Urwa Market", severity: "Critical", status: "Open", createdAt: "Today, 10:12 AM" },
    { id: "za-02", title: "Meter stopped reporting", detail: "No reading has been received for more than 16 hours.", meterNumber: "MNG-20420", location: "Kottara Chowki", severity: "Warning", status: "Open", createdAt: "Today, 9:44 AM" },
    { id: "za-03", title: "Repeated connection drops", detail: "The device has disconnected 8 times in the last 24 hours.", meterNumber: "MNG-20425", location: "Lalbagh", severity: "Warning", status: "Acknowledged", createdAt: "Yesterday, 8:32 PM" },
    { id: "za-04", title: "Voltage outside safe range", detail: "Voltage fell below the configured 210 V threshold.", meterNumber: "MNG-20428", location: "Bondel", severity: "Critical", status: "Open", createdAt: "Yesterday, 4:07 PM" },
    { id: "za-05", title: "Scheduled maintenance reminder", detail: "Preventive inspection is due within the next 7 days.", meterNumber: "MNG-20422", location: "Derebail", severity: "Info", status: "Resolved", createdAt: "Nov 26, 2:10 PM" },
    { id: "za-06", title: "High evening demand", detail: "Zone peak demand reached 91% of its configured limit.", meterNumber: "Zone wide", location: "Mangalore North", severity: "Warning", status: "Acknowledged", createdAt: "Nov 25, 7:48 PM" },
];

export const monthlyConsumption = [
    { label: "Jun", usage: 18.4, previous: 17.2 },
    { label: "Jul", usage: 20.1, previous: 18.8 },
    { label: "Aug", usage: 19.2, previous: 19.6 },
    { label: "Sep", usage: 21.8, previous: 20.4 },
    { label: "Oct", usage: 22.6, previous: 21.1 },
    { label: "Nov", usage: 24.3, previous: 22.7 },
];

export const hourlyDemand = [
    { label: "00", usage: 18 }, { label: "02", usage: 12 }, { label: "04", usage: 9 },
    { label: "06", usage: 16 }, { label: "08", usage: 39 }, { label: "10", usage: 52 },
    { label: "12", usage: 48 }, { label: "14", usage: 44 }, { label: "16", usage: 61 },
    { label: "18", usage: 88 }, { label: "20", usage: 96 }, { label: "22", usage: 63 },
];
