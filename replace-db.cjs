const fs = require("fs");
let code = fs.readFileSync("server.ts", "utf-8");

const importStatement = `import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

let firestoreDb: any = null;
try {
  if (fs.existsSync("firebase-applet-config.json")) {
    const firebaseConfig = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
    const firebaseApp = initializeApp(firebaseConfig);
    firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || "(default)");
  }
} catch (e) {
  console.error("Firebase config not found or invalid. Proceeding with in-memory DB.");
}

let inMemoryDb: any = null;

export async function initFirestoreDb() {
  if (!firestoreDb) {
    inMemoryDb = { applicants: DEFAULT_APPLICANTS, notifications: DEFAULT_NOTIFICATIONS, mabaAccounts: DEFAULT_MABA_ACCOUNTS, contacts: DEFAULT_CONTACTS, faqs: DEFAULT_FAQS };
    return;
  }
  try {
    const snap = await getDoc(doc(firestoreDb, "database", "main"));
    if (snap.exists()) {
      const data = snap.data();
      // Restore base64
      for (const app of (data.applicants || [])) {
         if (app.signature === "stored_in_signatures_col") {
             const sigSnap = await getDoc(doc(firestoreDb, "signatures", app.id));
             if (sigSnap.exists()) app.signature = sigSnap.data().base64;
         }
         if (app.documents) {
             for (const key of Object.keys(app.documents)) {
                 if (app.documents[key].base64 === "stored_in_documents_col") {
                     const docSnap = await getDoc(doc(firestoreDb, "documents", \`\${app.id}_\${key}\`));
                     if (docSnap.exists()) app.documents[key].base64 = docSnap.data().base64;
                 }
             }
         }
         if (app.payment?.buktiBayar?.base64 === "stored_in_documents_col") {
             const docSnap = await getDoc(doc(firestoreDb, "documents", \`\${app.id}_buktiBayar\`));
             if (docSnap.exists()) app.payment.buktiBayar.base64 = docSnap.data().base64;
         }
      }
      inMemoryDb = data;
    } else {
      inMemoryDb = { applicants: DEFAULT_APPLICANTS, notifications: DEFAULT_NOTIFICATIONS, mabaAccounts: DEFAULT_MABA_ACCOUNTS, contacts: DEFAULT_CONTACTS, faqs: DEFAULT_FAQS };
    }
    console.log("Loaded DB from Firestore.");
  } catch (err) {
    console.error("Failed to load from Firestore", err);
    inMemoryDb = { applicants: DEFAULT_APPLICANTS, notifications: DEFAULT_NOTIFICATIONS, mabaAccounts: DEFAULT_MABA_ACCOUNTS, contacts: DEFAULT_CONTACTS, faqs: DEFAULT_FAQS };
  }
}

function readDatabase() {
  return inMemoryDb;
}

function saveDatabase(data: any) {
  inMemoryDb = data;
  if (!firestoreDb) return;
  
  (async () => {
    try {
       const dbToSave = JSON.parse(JSON.stringify(data));
       for (const app of dbToSave.applicants) {
           if (app.signature && app.signature.startsWith("data:image")) {
               await setDoc(doc(firestoreDb, "signatures", app.id), { base64: app.signature });
               app.signature = "stored_in_signatures_col";
           }
           if (app.documents) {
               for (const key of Object.keys(app.documents)) {
                   if (app.documents[key].base64 && app.documents[key].base64.startsWith("data:")) {
                       await setDoc(doc(firestoreDb, "documents", \`\${app.id}_\${key}\`), { base64: app.documents[key].base64 });
                       app.documents[key].base64 = "stored_in_documents_col";
                   }
               }
           }
           if (app.payment?.buktiBayar?.base64 && app.payment.buktiBayar.base64.startsWith("data:")) {
               await setDoc(doc(firestoreDb, "documents", \`\${app.id}_buktiBayar\`), { base64: app.payment.buktiBayar.base64 });
               app.payment.buktiBayar.base64 = "stored_in_documents_col";
           }
       }
       await setDoc(doc(firestoreDb, "database", "main"), dbToSave);
    } catch (err) {
       console.error("Failed to sync to Firestore", err);
    }
  })();
}
`;

// Insert the import statements below the other imports
code = code.replace(/import dotenv from "dotenv";\ndotenv.config\(\);/, `import dotenv from "dotenv";\ndotenv.config();\n${importStatement}`);

// Remove the old readDatabase and saveDatabase definitions
code = code.replace(/function readDatabase\(\) \{[\s\S]*?\/\/ Helper to save to DB atomically using tmp files and maintaining a backup\nfunction saveDatabase\(data: any\) \{[\s\S]*?\}\n/, '');

// Add initFirestoreDb to startServer
code = code.replace(/async function startServer\(\) \{/, `async function startServer() {\n  await initFirestoreDb();`);

fs.writeFileSync("server.ts", code);
console.log("Replacement done");
