require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

const seedDemoData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured in .env");
    }
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for demo data seeding...');

    // 0. Create Admin
    let adminCreated = false;
    let admin = await User.findOne({ email: 'admin@busbooking.com' });
    if (!admin) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@busbooking.com',
        phone: '9800000000',
        password: 'Admin@123',
        role: 'admin',
        status: 'Active'
      });
      adminCreated = true;
    } else {
      console.log('Admin already exists');
    }

    // 1. Create Customers
    const customersData = [
      { name: 'Aarav Sharma', email: 'demo.user1@example.com', phone: '9841000001' },
      { name: 'Suman Thapa', email: 'demo.user2@example.com', phone: '9841000002' },
      { name: 'Riya Shrestha', email: 'demo.user3@example.com', phone: '9841000003' },
      { name: 'Bibek Gurung', email: 'demo.user4@example.com', phone: '9841000004' },
      { name: 'Anisha Karki', email: 'demo.user5@example.com', phone: '9841000005' },
      { name: 'Roshan Adhikari', email: 'demo.user6@example.com', phone: '9841000006' },
      { name: 'Prakash Rai', email: 'demo.user7@example.com', phone: '9841000007' },
      { name: 'Sneha Tamang', email: 'demo.user8@example.com', phone: '9841000008' },
      { name: 'Nabin KC', email: 'demo.user9@example.com', phone: '9841000009' },
      { name: 'Pooja Joshi', email: 'demo.user10@example.com', phone: '9841000010' }
    ];

    let customersCreated = 0;
    for (const cust of customersData) {
      let user = await User.findOne({ email: cust.email });
      if (!user) {
        await User.create({
          name: cust.name,
          email: cust.email,
          phone: cust.phone,
          password: 'Demo@123',
          role: 'customer',
          status: 'Active'
        });
        customersCreated++;
      }
    }

    // 2. Create Drivers
    const driversData = [
      { name: 'Rajesh Thapa', email: 'demo.driver1@example.com', phone: '9851000001', origin: 'Kathmandu', destination: 'Pokhara' },
      { name: 'Bikash Gurung', email: 'demo.driver2@example.com', phone: '9851000002', origin: 'Pokhara', destination: 'Kathmandu' },
      { name: 'Dipak Shrestha', email: 'demo.driver3@example.com', phone: '9851000003', origin: 'Kathmandu', destination: 'Birgunj' },
      { name: 'Sanjay Karki', email: 'demo.driver4@example.com', phone: '9851000004', origin: 'Birgunj', destination: 'Kathmandu' },
      { name: 'Manoj Rai', email: 'demo.driver5@example.com', phone: '9851000005', origin: 'Kathmandu', destination: 'Nepalgunj' },
      { name: 'Anil Tamang', email: 'demo.driver6@example.com', phone: '9851000006', origin: 'Nepalgunj', destination: 'Kathmandu' },
      { name: 'Ramesh Adhikari', email: 'demo.driver7@example.com', phone: '9851000007', origin: 'Kathmandu', destination: 'Janakpur' },
      { name: 'Kiran KC', email: 'demo.driver8@example.com', phone: '9851000008', origin: 'Janakpur', destination: 'Kathmandu' }
    ];

    let driversCreated = 0;
    const driverDocs = {};
    for (const d of driversData) {
      let user = await User.findOne({ email: d.email });
      if (!user) {
        user = await User.create({
          name: d.name,
          email: d.email,
          phone: d.phone,
          password: 'Demo@123',
          role: 'driver',
          status: 'Active'
        });
      }
      
      let driver = await Driver.findOne({ user: user._id });
      if (!driver) {
        driver = await Driver.create({
          user: user._id,
          name: d.name,
          mobileNumber: d.phone,
          driverStatus: 'Approved',
          isOnline: true,
          address: 'Kathmandu, Nepal',
          emergencyContact: { name: 'Emergency', phone: '9800000000', relation: 'Family' },
          route: { origin: d.origin, destination: d.destination },
          drivingLicenceNumber: `DL-${Math.floor(100000 + Math.random() * 900000)}`,
          drivingLicenceStatus: 'Approved',
          rcStatus: 'Approved',
          insuranceStatus: 'Approved',
          fitnessStatus: 'Approved',
          requiredDocumentsStatus: 'Approved'
        });
        driversCreated++;
      }
      driverDocs[d.name] = driver;
    }

    // 3. Create Buses
    const busesData = [
      { num: 'BA 1 KHA 1001', model: 'Tata Bus', cap: 40, origin: 'Kathmandu', destination: 'Pokhara', driverName: 'Rajesh Thapa' },
      { num: 'BA 1 KHA 1002', model: 'Ashok Leyland', cap: 45, origin: 'Pokhara', destination: 'Kathmandu', driverName: 'Bikash Gurung' },
      { num: 'BA 1 KHA 1003', model: 'Tata Starbus', cap: 40, origin: 'Kathmandu', destination: 'Birgunj', driverName: 'Dipak Shrestha' },
      { num: 'BA 1 KHA 1004', model: 'Ashok Leyland', cap: 45, origin: 'Kathmandu', destination: 'Nepalgunj', driverName: 'Sanjay Karki' },
      { num: 'BA 1 KHA 1005', model: 'Tata Bus', cap: 35, origin: 'Kathmandu', destination: 'Janakpur', driverName: 'Manoj Rai' }
    ];

    let busesCreated = 0;
    for (const b of busesData) {
      let vehicle = await Vehicle.findOne({ vehicleNumber: b.num });
      if (!vehicle) {
        let driverId = driverDocs[b.driverName] ? driverDocs[b.driverName]._id : null;
        vehicle = await Vehicle.create({
          vehicleNumber: b.num,
          vehicleType: 'Bus',
          vehicleCategory: 'Standard Bus',
          vehicleModel: b.model,
          vehicleName: b.model + ' Express',
          seatingCapacity: b.cap,
          ownerName: 'Demo Transport Co',
          ownerMobileNumber: '9800000001',
          assignedDriver: driverId,
          vehicleStatus: 'Active',
          route: { origin: b.origin, destination: b.destination, stops: [] },
          busDetails: {
            busType: 'Standard',
            seatLayout: '2+2',
            availableSeats: b.cap
          }
        });
        busesCreated++;
        
        if (driverId) {
          await Driver.findByIdAndUpdate(driverId, { assignedVehicle: vehicle._id });
        }
      }
    }

    // 4. Create Cars
    const carsData = [
      { num: 'BA 2 CHA 2001', model: 'Toyota Corolla', cap: 4, fuel: 'Petrol', origin: 'Kathmandu', destination: 'Pokhara', driverName: 'Anil Tamang' },
      { num: 'BA 2 CHA 2002', model: 'Suzuki Dzire', cap: 4, fuel: 'Petrol', origin: 'Pokhara', destination: 'Kathmandu', driverName: 'Ramesh Adhikari' },
      { num: 'BA 2 CHA 2003', model: 'Hyundai Aura', cap: 4, fuel: 'Petrol', origin: 'Kathmandu', destination: 'Birgunj', driverName: 'Kiran KC' },
      { num: 'BA 2 CHA 2004', model: 'Tata Nexon EV', cap: 5, fuel: 'Electric', origin: 'Kathmandu', destination: 'Nepalgunj' },
      { num: 'BA 2 CHA 2005', model: 'Hyundai i20', cap: 5, fuel: 'Diesel', origin: 'Kathmandu', destination: 'Janakpur' }
    ];

    let carsCreated = 0;
    for (const c of carsData) {
      let vehicle = await Vehicle.findOne({ vehicleNumber: c.num });
      if (!vehicle) {
        let driverId = c.driverName && driverDocs[c.driverName] ? driverDocs[c.driverName]._id : null;
        vehicle = await Vehicle.create({
          vehicleNumber: c.num,
          vehicleType: 'Car',
          vehicleCategory: 'Standard Car',
          vehicleModel: c.model,
          vehicleName: c.model + ' Cab',
          seatingCapacity: c.cap,
          ownerName: 'Demo Transport Co',
          ownerMobileNumber: '9800000001',
          assignedDriver: driverId,
          vehicleStatus: 'Active',
          route: { origin: c.origin, destination: c.destination, stops: [] },
          carDetails: {
            ac: true,
            fuelType: c.fuel
          }
        });
        carsCreated++;
        
        if (driverId) {
          await Driver.findByIdAndUpdate(driverId, { assignedVehicle: vehicle._id });
        }
      }
    }

    console.log('\n--- SEEDING COMPLETE ---');
    console.log(`Admin created: ${adminCreated}`);
    console.log(`Customers created: ${customersCreated}`);
    console.log(`Drivers created: ${driversCreated}`);
    console.log(`Buses created: ${busesCreated}`);
    console.log(`Cars created: ${carsCreated}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDemoData();
