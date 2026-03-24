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
  measurementId: "G-SG7PR7N0HV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const initialServices = {
  "svc_computer_repair": {
    title: "Computer Repair",
    description: "Expert diagnostics and repair for all desktop and laptop issues. Fast turnaround times.",
    icon: "Monitor"
  },
  "svc_software_install": {
    title: "Software Installation",
    description: "Professional installation and configuration of operating systems and application software.",
    icon: "TerminalSquare"
  },
  "svc_network_setup": {
    title: "Network Setup",
    description: "Complete network design, installation, and optimization for home or business environments.",
    icon: "Server"
  },
  "svc_data_recovery": {
    title: "Data Recovery",
    description: "Advanced data recovery services for failing hard drives, SSDs, and accidentally deleted files.",
    icon: "Database"
  },
  "svc_virus_removal": {
    title: "Virus & Malware Removal",
    description: "Comprehensive scanning and removal of malicious software to restore system security.",
    icon: "ShieldAlert"
  },
  "svc_hardware_upgrade": {
    title: "Hardware Upgrades",
    description: "Boost your system's performance with RAM, SSD, and graphics card upgrades.",
    icon: "Cpu"
  }
};

async function seedData() {
  console.log("Seeding services...");
  try {
    await set(ref(db, "services"), initialServices);
    console.log("Successfully seeded services!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
