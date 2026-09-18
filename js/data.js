// js/data.js

// Initial mock data if localStorage is empty
const initialVehicles = [
    {
        id: 1,
        name: "Carlos Andrade",
        unit: "Bloco A - Ap 102",
        phone: "(11) 98765-4321",
        plate: "ABC-1234",
        model: "Honda Civic - Preto",
        type: "Carro",
        spotType: "Fixa",
        authStatus: "Autorizado",
        status: "Fora", // Fora, Presente
        entryTime: null
    },
    {
        id: 2,
        name: "Mariana Silva",
        unit: "Visitante - Ap 405",
        phone: "(11) 91234-5678",
        plate: "XYZ-9876",
        model: "Toyota Corolla - Prata",
        type: "Carro",
        spotType: "Esporádica",
        authStatus: "Pendente",
        status: "Fora",
        entryTime: null
    },
    {
        id: 3,
        name: "João Mendes",
        unit: "Bloco B - Ap 201",
        phone: "(11) 97777-8888",
        plate: "DEF-5678",
        model: "Yamaha MT-03 - Azul",
        type: "Moto",
        spotType: "Fixa",
        authStatus: "Autorizado",
        status: "Presente",
        entryTime: "08:15"
    },
    {
        id: 4,
        name: "Ana Luiza",
        unit: "Visitante - Ap 102",
        phone: "(11) 94444-3333",
        plate: "GHI-9012",
        model: "Jeep Compass - Branco",
        type: "Carro",
        spotType: "Esporádica",
        authStatus: "Não Autorizado",
        status: "Fora",
        entryTime: null
    }
];

class DataService {
    constructor() {
        this.initData();
    }

    initData() {
        if (!localStorage.getItem('parking_vehicles')) {
            localStorage.setItem('parking_vehicles', JSON.stringify(initialVehicles));
        }
        if (!localStorage.getItem('parking_logs')) {
            localStorage.setItem('parking_logs', JSON.stringify([]));
        }
    }

    getVehicles() {
        return JSON.parse(localStorage.getItem('parking_vehicles'));
    }

    getVehicle(id) {
        const vehicles = this.getVehicles();
        return vehicles.find(v => v.id === id);
    }

    updateVehicleStatus(id, newStatus, actionTime) {
        const vehicles = this.getVehicles();
        const index = vehicles.findIndex(v => v.id === id);
        
        if (index !== -1) {
            vehicles[index].status = newStatus;
            vehicles[index].entryTime = newStatus === 'Presente' ? actionTime : null;
            localStorage.setItem('parking_vehicles', JSON.stringify(vehicles));
            
            // Log action
            this.addLog({
                vehicleId: id,
                action: newStatus === 'Presente' ? 'Entrada Autorizada' : 'Saída Registrada',
                time: actionTime,
                plate: vehicles[index].plate
            });
            
            return vehicles[index];
        }
        return null;
    }

    addVehicle(vehicleData) {
        const vehicles = this.getVehicles();
        const maxId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) : 0;
        
        const newVehicle = {
            ...vehicleData,
            id: maxId + 1,
            status: 'Fora',
            entryTime: null
        };
        
        vehicles.push(newVehicle);
        localStorage.setItem('parking_vehicles', JSON.stringify(vehicles));
        return newVehicle;
    }

    updateVehicleInfo(id, updatedData) {
        const vehicles = this.getVehicles();
        const index = vehicles.findIndex(v => v.id === id);
        
        if (index !== -1) {
            vehicles[index] = { ...vehicles[index], ...updatedData };
            localStorage.setItem('parking_vehicles', JSON.stringify(vehicles));
            return vehicles[index];
        }
        return null;
    }

    deleteVehicle(id) {
        let vehicles = this.getVehicles();
        vehicles = vehicles.filter(v => v.id !== id);
        localStorage.setItem('parking_vehicles', JSON.stringify(vehicles));
    }

    addLog(log) {
        const logs = JSON.parse(localStorage.getItem('parking_logs'));
        logs.push({ ...log, timestamp: new Date().toISOString() });
        localStorage.setItem('parking_logs', JSON.stringify(logs));
    }
}

const dataService = new DataService();
