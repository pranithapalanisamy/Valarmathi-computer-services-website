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
const customers = [
  { name: "Ravi Kumar",        phone: "9876543210", email: "ravi.kumar@gmail.com" },
  { name: "Priya Lakshmi",     phone: "9865432109", email: "priya.lakshmi@yahoo.com" },
  { name: "Suresh Babu",       phone: "9754321098", email: "suresh.babu@gmail.com" },
  { name: "Anuradha Devi",     phone: "9643210987", email: "anuradha.d@outlook.com" },
  { name: "Manoj Rajesh",      phone: "9532109876", email: "manoj.raj@gmail.com" },
  { name: "Kavitha Srinivasan",phone: "9421098765", email: "kavitha.s@gmail.com" },
  { name: "Muthuraman P",      phone: "9310987654", email: "muthu.p@hotmail.com" },
  { name: "Geetha Krishnan",   phone: "9209876543", email: "geetha.k@gmail.com" },
  { name: "Arjun Pillai",      phone: "9198765432", email: "arjun.pillai@gmail.com" },
  { name: "Deepa Menon",       phone: "9087654321", email: "deepa.menon@yahoo.com" },
  { name: "Balaji Naidu",      phone: "8976543210", email: "balaji.n@gmail.com" },
  { name: "Chitra Selvam",     phone: "8865432109", email: "chitra.selvam@gmail.com" },
  { name: "Dinesh Kumar",      phone: "8754321098", email: "dinesh.k@outlook.com" },
  { name: "Eswari Palani",     phone: "8643210987", email: "eswari.p@gmail.com" },
  { name: "Harish Gowda",      phone: "8532109876", email: "harish.g@hotmail.com" },
  { name: "Indu Vijayan",      phone: "8421098765", email: "indu.v@gmail.com" },
  { name: "Jayakumar T",       phone: "8310987654", email: "jayakumar.t@gmail.com" },
  { name: "Kamala Venkat",     phone: "8209876543", email: "kamala.v@yahoo.com" },
  { name: "Logesh Pandian",    phone: "8198765432", email: "logesh.p@gmail.com" },
  { name: "Meena Subramanian", phone: "8087654321", email: "meena.sub@gmail.com" },
  { name: "Nandha Kumar",      phone: "7976543210", email: "nandha.k@gmail.com" },
  { name: "Oviya Rajendran",   phone: "7865432109", email: "oviya.r@outlook.com" },
  { name: "Prakash Anand",     phone: "7754321098", email: "prakash.a@gmail.com" },
  { name: "Ramya Suresh",      phone: "7643210987", email: "ramya.s@gmail.com" },
  { name: "Sathish Murugan",   phone: "7532109876", email: "sathish.m@gmail.com" },
  { name: "Thenmozhi Raj",     phone: "7421098765", email: "thenmo.r@hotmail.com" },
  { name: "Uma Ganesan",       phone: "7310987654", email: "uma.g@gmail.com" },
  { name: "Vasanth Kumar",     phone: "7209876543", email: "vasanth.k@yahoo.com" },
  { name: "Yamini Mohan",      phone: "7198765432", email: "yamini.m@gmail.com" },
  { name: "Zubair Ahmed",      phone: "9012345678", email: "zubair.a@gmail.com" },
];

const serviceMessages = [
  {
    service: "Laptop Repair",
    message: "My laptop screen is cracked and the keyboard has stopped responding. I need an urgent repair with a cost estimate.",
  },
  {
    service: "Data Recovery",
    message: "Hard drive crashed suddenly after a power cut. Need to recover 5 years of important business files and photos. Please quote urgently.",
  },
  {
    service: "Network Setup",
    message: "Setting up a new office with 20 workstations. Need structured cabling, switches, and WiFi access points configured. Please provide a full quote.",
  },
  {
    service: "AMC Service",
    message: "Looking for Annual Maintenance Contract for 15 computers in our school. Please send a package quote with monthly and yearly pricing.",
  },
  {
    service: "Hardware Upgrade",
    message: "Want to upgrade 3 desktop PCs: RAM from 8GB to 16GB and replace HDDs with 512GB SSDs. Please quote the parts and labor cost.",
  },
  {
    service: "OS Installation",
    message: "Need Windows 11 Pro installation and activation on 5 laptops. Also need Microsoft Office 365 setup. What will be the total cost?",
  },
  {
    service: "Virus & Malware Removal",
    message: "My PC is severely infected with malware. Getting pop-ups and the system is very slow. Need a full scan and cleanup with antivirus installation.",
  },
  {
    service: "Screen Replacement",
    message: "Laptop screen cracked after accidental drop. Model: Dell Inspiron 15. Need screen replacement with price quote and turnaround time.",
  },
  {
    service: "Remote Support",
    message: "Facing blue screen errors on my work PC randomly. Need remote troubleshooting session. When can we schedule and what's the fee?",
  },
  {
    service: "Printer Setup",
    message: "New HP LaserJet printer not connecting to our network. Need someone to configure network printing for 5 computers. Please quote.",
  },
  {
    service: "Computer Repair",
    message: "Desktop PC not turning on. Suspect power supply issue. Need diagnosis and repair quote. Also want to know the estimated timeline.",
  },
  {
    service: "Battery Replacement",
    message: "MacBook Pro battery draining very fast, lasting only 1–2 hours. Need battery replacement with original part. Please quote.",
  },
  {
    service: "CCTV Installation",
    message: "Want to install 4 CCTV cameras in my shop with night vision and mobile app access. Please provide full installation quote.",
  },
  {
    service: "Data Backup Solution",
    message: "Need a complete backup solution for our small business — both local NAS and cloud backup. Please quote hardware and setup cost.",
  },
  {
    service: "Software Installation",
    message: "Need Tally Prime, QuickBooks, and antivirus installed on 3 computers. Please quote software licensing and installation charges.",
  },
  {
    service: "Graphics Card Upgrade",
    message: "Want to upgrade my PC for video editing. Currently have GTX 1050. Budget is around ₹15,000. Please suggest and quote compatible options.",
  },
  {
    service: "Laptop Repair",
    message: "Laptop gets very hot and shuts down after 15–20 minutes of use. Need cooling pad and fan replacement. Please provide an estimate.",
  },
  {
    service: "Data Recovery",
    message: "Accidentally deleted important project files from USB drive. Is recovery possible? How much will it cost and how long will it take?",
  },
  {
    service: "Network Setup",
    message: "Home network is very slow with multiple devices. Need router replacement and extender setup. Please visit and quote the best solution.",
  },
  {
    service: "Computer Repair",
    message: "Office desktop shows 'No bootable device' error. May need OS reinstall or HDD replacement. Need urgent diagnosis and repair quote.",
  },
  {
    service: "Hardware Upgrade",
    message: "Want to build a new budget gaming PC under ₹40,000. Please quote parts list and assembly charges.",
  },
  {
    service: "Keyboard Replacement",
    message: "Laptop keyboard keys are sticky and some not working. HP Pavilion 15. Need replacement keyboard with installation cost.",
  },
  {
    service: "AMC Service",
    message: "Need AMC for 8 computers in our CA firm — quarterly service visits, emergency support, and parts replacement. Please quote.",
  },
  {
    service: "OS Installation",
    message: "My laptop has Windows 7 and needs to be upgraded to Windows 11. Will all my files be safe? Please quote the service.",
  },
  {
    service: "Remote Support",
    message: "QuickBooks software not opening after Windows update. Need remote fix. How soon can you connect and what's the charge?",
  },
  {
    service: "Screen Replacement",
    message: "HP laptop screen has a black vertical line running through the center. Is this fixable? Please quote parts and labor.",
  },
  {
    service: "Virus & Malware Removal",
    message: "Browser keeps opening unwanted pop-up ads even after clearing cache. Suspicious file downloads happening automatically. Please help.",
  },
  {
    service: "Laptop Repair",
    message: "Laptop charging port is loose and the charger falls off easily. Need port replacement. Lenovo IdeaPad 3. Please quote.",
  },
  {
    service: "Data Recovery",
    message: "External hard drive making clicking sounds and not detected by PC. Contains all client data. Please quote recovery options urgently.",
  },
  {
    service: "Network Setup",
    message: "Opening a new restaurant and need POS system connected to WiFi, CCTV, and 3 billing counters. Please quote full network setup.",
  },
];

const adminResponses = [
  "Thank you for contacting us! We can repair your laptop screen and keyboard. Estimated cost: ₹2,500–₹4,000. Please bring it to our center or call to schedule a home visit.",
  "Data recovery from crashed drives starts at ₹1,500. Success rate is ~90%. Please visit our center with the drive for initial diagnosis — no charge for diagnosis.",
  "We'd be happy to set up your office network! Our team will visit for a site survey. Initial estimate: ₹15,000–₹22,000 depending on cable runs and hardware.",
  "Our AMC packages start at ₹500/PC/month (quarterly visits included). For 15 computers, we offer 20% bulk discount. We'll email a detailed proposal.",
  "RAM upgrade: ₹800/PC (parts + labor). SSD replacement: ₹1,200/PC (parts + labor). For 3 PCs total: ₹6,000. We can complete this within the same day.",
  "Windows 11 + Office 365 setup for 5 laptops: ₹2,500 total (₹500/laptop). Available this Saturday 10 AM–5 PM. Please confirm your preferred time slot.",
];

const statuses = ["Pending", "Responded", "Approved", "Rejected"];
const statusWeights = [0.35, 0.30, 0.25, 0.10];

function pickWeighted(arr, weights) {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return arr[i];
  }
  return arr[arr.length - 1];
}

function randomDate(daysBack) {
  const now = new Date();
  const ms = now.getTime() - Math.floor(Math.random() * daysBack) * 86400000;
  return new Date(ms).toISOString().split("T")[0];
}

function generateId() {
  return "qr_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function generateQuotes() {
  const quotes = {};

  for (let i = 0; i < 30; i++) {
    const id = generateId();
    const customer = customers[i % customers.length];
    const svcMsg = serviceMessages[i % serviceMessages.length];
    const status = pickWeighted(statuses, statusWeights);
    const date = randomDate(45);

    const entry = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      service: svcMsg.service,
      message: svcMsg.message,
      status,
      date,
    };

    // Add response for Responded/Approved entries
    if (status === "Responded" || status === "Approved") {
      entry.response = adminResponses[i % adminResponses.length];
      entry.respondedAt = new Date(new Date(date).getTime() + 86400000).toISOString().split("T")[0];
    }

    if (status === "Rejected") {
      entry.response = "We are unable to fulfil this request at the moment. Please check back later or contact us for alternatives.";
      entry.respondedAt = new Date(new Date(date).getTime() + 86400000).toISOString().split("T")[0];
    }

    quotes[id] = entry;
  }

  return quotes;
}

async function seedQuotes() {
  console.log("⏳ Generating 30 sample quote requests...");
  const quotes = generateQuotes();
  console.log(`✅ Generated ${Object.keys(quotes).length} quotes`);
  console.log("⏳ Uploading to Firebase (quoteRequests)...");
  try {
    await set(ref(db, "quoteRequests"), quotes);
    console.log("🎉 Successfully seeded all quote requests to Firebase!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding quotes:", error);
    process.exit(1);
  }
}

seedQuotes();
