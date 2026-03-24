import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCmhF__oRrevuWM-dPQ-p7wym2eBHGvxig",
  authDomain: "pranitha-final-project.firebaseapp.com",
  databaseURL: "https://pranitha-final-project-default-rtdb.firebaseio.com",
  projectId: "pranitha-final-project",
  storageBucket: "pranitha-final-project.firebasestorage.app",
  messagingSenderId: "1052172715537",
  appId: "1:1052172715537:web:5717360c1b9c522a7d93b0",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ── Data pools ────────────────────────────────────────────────────────────────
const names = [
  "Arjun Sharma", "Priya Nair", "Karthik Rajan", "Divya Menon", "Rahul Verma",
  "Sneha Iyer", "Vikram Patel", "Ananya Kumar", "Suresh Babu", "Meera Krishnan",
  "Arun Pillai", "Lakshmi Devi", "Manoj Reddy", "Kavitha Srinivasan", "Deepak Joshi",
  "Pooja Chatterjee", "Ravi Anand", "Swathi Nambiar", "Ganesh Rao", "Ramya Suresh",
  "Bala Murugan", "Chitra Selvam", "Dinesh Naidu", "Eswari Palani", "Harish Gowda",
  "Indu Vijayan", "Jayakumar Thangam", "Kamala Venkat", "Logesh Pandian", "Mala Subramanian",
  "Nandini Prasad", "Om Prakash", "Padmini Lakshmanan", "Quresh Ali", "Rohan Kapoor",
  "Savithri Rajendran", "Tarun Mishra", "Uma Ganesan", "Vasanth Kumar", "Yamini Mohan",
];

const phones = [
  "9876543210", "9845123456", "9123456789", "9988776655", "9765432109",
  "9654321098", "9543210987", "9432109876", "9321098765", "9210987654",
  "8876543210", "8765432109", "8654321098", "8543210987", "8432109876",
  "7987654321", "7876543210", "7765432109", "7654321098", "7543210987",
  "6654321098", "6543210987", "6432109876", "6321098765", "6210987654",
  "9012345678", "9001234567", "8901234567", "8890123456", "7890123456",
  "7780012345", "6789012345", "6678901234", "9678901234", "9567890123",
  "9456789012", "9345678901", "9234567890", "9123678901", "9012367890",
];

const emails = [
  "arjun.sharma@gmail.com", "priya.nair@yahoo.com", "karthik.raj@gmail.com",
  "divya.menon@outlook.com", "rahul.v@gmail.com", "sneha.iyer@gmail.com",
  "vikram.p@hotmail.com", "ananya.k@gmail.com", "suresh.b@gmail.com",
  "meera.k@yahoo.com", "arun.pillai@gmail.com", "lakshmi.d@outlook.com",
  "manoj.r@gmail.com", "kavitha.s@gmail.com", "deepak.j@hotmail.com",
  "pooja.c@gmail.com", "ravi.a@yahoo.com", "swathi.n@gmail.com",
  "ganesh.r@gmail.com", "ramya.s@outlook.com", "bala.m@gmail.com",
  "chitra.sel@gmail.com", "dinesh.n@hotmail.com", "eswari.p@gmail.com",
  "harish.g@gmail.com", "indu.v@yahoo.com", "jayakumar.t@gmail.com",
  "kamala.v@outlook.com", "logesh.p@gmail.com", "mala.sub@gmail.com",
  "nandini.pr@hotmail.com", "om.prakash@gmail.com", "padmini.l@gmail.com",
  "quresh.ali@yahoo.com", "rohan.k@gmail.com", "savithri.r@gmail.com",
  "tarun.m@outlook.com", "uma.g@gmail.com", "vasanth.k@gmail.com",
  "yamini.m@hotmail.com",
];

const services = [
  "Computer Repair",
  "Laptop Repair",
  "Data Recovery",
  "Virus & Malware Removal",
  "Hardware Upgrade",
  "Software Installation",
  "Network Setup",
  "OS Installation",
  "Screen Replacement",
  "Battery Replacement",
  "Keyboard Replacement",
  "Printer Setup & Repair",
];

const deviceTypes = [
  "Desktop PC", "Laptop", "MacBook", "All-in-One PC", "Gaming PC",
  "HP Laptop", "Dell Laptop", "Lenovo ThinkPad", "Asus Laptop", "Acer Laptop",
];

const issues = [
  "System not booting, getting blue screen error on startup.",
  "Laptop overheating and shutting down during use.",
  "Hard drive making clicking noise, need data recovered urgently.",
  "Virus infection — system running very slow with pop-ups.",
  "Want to upgrade RAM from 8GB to 16GB for better performance.",
  "Need Windows 11 installation with all drivers.",
  "Home WiFi setup and router configuration needed.",
  "Screen cracked after drop, need replacement.",
  "Battery draining too fast, replacement needed.",
  "Keyboard keys not responding properly.",
  "Printer not connecting to laptop, need configuration.",
  "System freezing randomly, need diagnosis.",
  "Need antivirus software installation and full scan.",
  "SSD upgrade from HDD for faster performance.",
  "Multiple programs not opening, registry errors showing.",
  "Need all data transferred from old laptop to new one.",
  "Laptop fan making loud noise.",
  "Cannot connect to internet, network adapter issue.",
  "Microsoft Office installation and activation needed.",
  "Graphics card upgrade for video editing work.",
];

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

const statuses = ["pending", "confirmed", "in-progress", "completed", "cancelled"];
const statusWeights = [0.25, 0.25, 0.15, 0.25, 0.10]; // weighted distribution

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(arr, weights) {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return arr[i];
  }
  return arr[arr.length - 1];
}

function randomDate(daysBack, daysForward = 30) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - daysBack);
  const end = new Date(now);
  end.setDate(now.getDate() + daysForward);
  const time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(time).toISOString().split("T")[0]; // YYYY-MM-DD
}

function generateId() {
  return "bk_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// ── Generate 55 bookings ──────────────────────────────────────────────────────
function generateBookings() {
  const bookings = {};
  const total = 55;

  for (let i = 0; i < total; i++) {
    const idx = i % names.length;
    const id = generateId();
    const status = pickWeighted(statuses, statusWeights);
    const bookingDate = randomDate(60, 20); // dates from 60 days ago to 20 days ahead
    const createdDaysAgo = Math.floor(Math.random() * 70);
    const createdAt = new Date(Date.now() - createdDaysAgo * 86400000 - Math.random() * 86400000).toISOString();
    const service = pick(services);

    bookings[id] = {
      name: names[idx],
      phone: phones[idx],
      email: emails[idx],
      service,
      serviceType: service, // also stored as serviceType for UserDashboard compatibility
      deviceType: pick(deviceTypes),
      issue: pick(issues),
      date: bookingDate,
      timeSlot: pick(timeSlots),
      status,
      createdAt,
      userId: `demo_user_${(idx % 10) + 1}`,
    };
  }

  return bookings;
}

async function seedBookings() {
  console.log("⏳ Generating 55 sample bookings...");
  const bookings = generateBookings();
  console.log(`✅ Generated ${Object.keys(bookings).length} bookings`);
  console.log("⏳ Uploading to Firebase...");
  try {
    await set(ref(db, "bookings"), bookings);
    console.log("🎉 Successfully seeded all bookings to Firebase!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding bookings:", error);
    process.exit(1);
  }
}

seedBookings();
