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

// ── 75 realistic South Indian + mixed Indian customers ────────────────────────
const customers = [
  { displayName: "Arjun Sharma",          email: "arjun.sharma@gmail.com" },
  { displayName: "Priya Nair",            email: "priya.nair@yahoo.com" },
  { displayName: "Karthik Rajan",         email: "karthik.rajan@gmail.com" },
  { displayName: "Divya Menon",           email: "divya.menon@outlook.com" },
  { displayName: "Rahul Verma",           email: "rahul.verma@gmail.com" },
  { displayName: "Sneha Iyer",            email: "sneha.iyer@gmail.com" },
  { displayName: "Vikram Patel",          email: "vikram.patel@hotmail.com" },
  { displayName: "Ananya Kumar",          email: "ananya.kumar@gmail.com" },
  { displayName: "Suresh Babu",           email: "suresh.babu@gmail.com" },
  { displayName: "Meera Krishnan",        email: "meera.krishnan@yahoo.com" },
  { displayName: "Arun Pillai",           email: "arun.pillai@gmail.com" },
  { displayName: "Lakshmi Devi",          email: "lakshmi.devi@outlook.com" },
  { displayName: "Manoj Reddy",           email: "manoj.reddy@gmail.com" },
  { displayName: "Kavitha Srinivasan",    email: "kavitha.srini@gmail.com" },
  { displayName: "Deepak Joshi",          email: "deepak.joshi@hotmail.com" },
  { displayName: "Pooja Chatterjee",      email: "pooja.chatterjee@gmail.com" },
  { displayName: "Ravi Anand",            email: "ravi.anand@yahoo.com" },
  { displayName: "Swathi Nambiar",        email: "swathi.nambiar@gmail.com" },
  { displayName: "Ganesh Rao",            email: "ganesh.rao@gmail.com" },
  { displayName: "Ramya Suresh",          email: "ramya.suresh@outlook.com" },
  { displayName: "Bala Murugan",          email: "bala.murugan@gmail.com" },
  { displayName: "Chitra Selvam",         email: "chitra.selvam@gmail.com" },
  { displayName: "Dinesh Naidu",          email: "dinesh.naidu@hotmail.com" },
  { displayName: "Eswari Palani",         email: "eswari.palani@gmail.com" },
  { displayName: "Harish Gowda",          email: "harish.gowda@gmail.com" },
  { displayName: "Indu Vijayan",          email: "indu.vijayan@yahoo.com" },
  { displayName: "Jayakumar Thangam",     email: "jayakumar.t@gmail.com" },
  { displayName: "Kamala Venkat",         email: "kamala.venkat@outlook.com" },
  { displayName: "Logesh Pandian",        email: "logesh.pandian@gmail.com" },
  { displayName: "Mala Subramanian",      email: "mala.sub@gmail.com" },
  { displayName: "Nandini Prasad",        email: "nandini.prasad@hotmail.com" },
  { displayName: "Om Prakash",            email: "om.prakash@gmail.com" },
  { displayName: "Padmini Lakshmanan",    email: "padmini.l@gmail.com" },
  { displayName: "Quresh Ali",            email: "quresh.ali@yahoo.com" },
  { displayName: "Rohan Kapoor",          email: "rohan.kapoor@gmail.com" },
  { displayName: "Savithri Rajendran",    email: "savithri.r@gmail.com" },
  { displayName: "Tarun Mishra",          email: "tarun.mishra@outlook.com" },
  { displayName: "Uma Ganesan",           email: "uma.ganesan@gmail.com" },
  { displayName: "Vasanth Kumar",         email: "vasanth.kumar@gmail.com" },
  { displayName: "Yamini Mohan",          email: "yamini.mohan@hotmail.com" },
  { displayName: "Sathish Murugan",       email: "sathish.murugan@gmail.com" },
  { displayName: "Thenmozhi Raj",         email: "thenmozhi.r@gmail.com" },
  { displayName: "Balaji Naidu",          email: "balaji.naidu@gmail.com" },
  { displayName: "Oviya Rajendran",       email: "oviya.raj@outlook.com" },
  { displayName: "Prakash Anand",         email: "prakash.anand@gmail.com" },
  { displayName: "Nandha Kumar",          email: "nandha.kumar@gmail.com" },
  { displayName: "Zubair Ahmed",          email: "zubair.ahmed@gmail.com" },
  { displayName: "Geetha Krishnan",       email: "geetha.krishnan@gmail.com" },
  { displayName: "Muthuraman P",          email: "muthuraman.p@yahoo.com" },
  { displayName: "Anuradha Devi",         email: "anuradha.devi@gmail.com" },
  { displayName: "Siva Shankar",          email: "siva.shankar@gmail.com" },
  { displayName: "Rohini Venkatesh",      email: "rohini.v@gmail.com" },
  { displayName: "Senthil Nathan",        email: "senthil.nathan@hotmail.com" },
  { displayName: "Bhuvana Ravi",          email: "bhuvana.ravi@gmail.com" },
  { displayName: "Prasanth Kumar",        email: "prasanth.kumar@yahoo.com" },
  { displayName: "Sangeetha Devi",        email: "sangeetha.devi@gmail.com" },
  { displayName: "Aravind Selvakumar",    email: "aravind.selva@gmail.com" },
  { displayName: "Malathi Rajaram",       email: "malathi.r@outlook.com" },
  { displayName: "Vijay Annamalai",       email: "vijay.anna@gmail.com" },
  { displayName: "Nithya Saravanan",      email: "nithya.saravanan@gmail.com" },
  { displayName: "Rajesh Kannan",         email: "rajesh.kannan@gmail.com" },
  { displayName: "Saranya Mohan",         email: "saranya.mohan@yahoo.com" },
  { displayName: "Muthu Lakshmi",         email: "muthu.lakshmi@gmail.com" },
  { displayName: "Periyasamy R",          email: "periyasamy.r@gmail.com" },
  { displayName: "Kaveri Sundar",         email: "kaveri.sundar@hotmail.com" },
  { displayName: "Rajeswari Balaji",      email: "rajeswari.b@gmail.com" },
  { displayName: "Elango Murugesan",      email: "elango.m@gmail.com" },
  { displayName: "Pavithra Natarajan",    email: "pavithra.n@outlook.com" },
  { displayName: "Selvam Periasamy",      email: "selvam.p@gmail.com" },
  { displayName: "Komal Sharma",          email: "komal.sharma@gmail.com" },
  { displayName: "Aditya Singh",          email: "aditya.singh@gmail.com" },
  { displayName: "Nisha Gupta",           email: "nisha.gupta@yahoo.com" },
  { displayName: "Sunil Mehta",           email: "sunil.mehta@gmail.com" },
  { displayName: "Rekha Pillai",          email: "rekha.pillai@gmail.com" },
  { displayName: "Abhishek Rao",          email: "abhishek.rao@hotmail.com" },
];

function randomDate(daysBack) {
  const now = Date.now();
  const ms = now - Math.floor(Math.random() * daysBack * 86400000);
  return new Date(ms).toISOString();
}

function generateUid(index) {
  return `seed_user_${String(index).padStart(3, "0")}_${Math.random().toString(36).substr(2, 8)}`;
}

function buildUsersObject() {
  const users = {};
  customers.forEach((c, i) => {
    const uid = generateUid(i + 1);
    users[uid] = {
      displayName: c.displayName,
      email: c.email,
      photoURL: null,
      role: "customer",       // all are regular customers
      createdAt: randomDate(180),  // joined within last 6 months
    };
  });
  return users;
}

async function seedUsers() {
  console.log(`⏳ Preparing ${customers.length} customer records...`);
  const users = buildUsersObject();
  console.log(`✅ Generated ${Object.keys(users).length} users`);
  console.log("⏳ Uploading to Firebase (users)...");
  try {
    // Use update instead of set so existing admin accounts are preserved
    const { getDatabase, ref, update } = await import("firebase/database");
    const dbRef = ref(db, "users");

    // Write each user individually to avoid overwriting existing users
    const { ref: dbRef2, update: dbUpdate } = await import("firebase/database");
    for (const [uid, data] of Object.entries(users)) {
      await dbUpdate(ref(db, `users/${uid}`), data);
    }
    console.log(`🎉 Successfully seeded ${Object.keys(users).length} customers to Firebase!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
