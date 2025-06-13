import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

import * as modules from '../general-js/scripts';

const firebaseConfig = {
  apiKey: "AIzaSyDy-wU0BjvyQ1rkiOi8e52-qKZd9h7sMJo",
  authDomain: "budget-buddy-ad31d.firebaseapp.com",
  projectId: "budget-buddy-ad31d",
  storageBucket: "budget-buddy-ad31d.firebasestorage.app",
  messagingSenderId: "158907696524",
  appId: "1:158907696524:web:e5a55d4cb196739d4342a9",
  measurementId: "G-6VWVXYMM76"
};
const app = initializeApp(firebaseConfig);


// ==========================
//         DATABASE
// ==========================
export const db = getFirestore(app);



// ==========================
//     READING DOCUMENTS
// ==========================

// Get all docs
export const dbReadDocs = async (collectionToLookFor) => {
  const querySnapshot = await getDocs(collection(db, collectionToLookFor));
  let output = {};
  querySnapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    output[id] = data;
  });
  return output;
}

// Get specific doc
export const dbReadDoc = async (collection, document) => {
  const docRef = doc(db, collection, document)
  const docSnap = getDoc(docRef);
  
  if ((await docSnap).exists()) {
    return (await docSnap).data();
  }
  else {
    return null;
  }
}



// ==========================
//      ADDING DOCUMENTS
// ==========================

const createDataObject = async (transactions) => {
  // Get the current data in the collection
  const currentData = await dbReadDoc('data', auth.currentUser.uid);
  
  // Fill in the json depending on if data existed already or not
  const json = {}
  if (currentData.data == '') {
    json.total = '0';
    json.totalIncome = '0';
    json.totalExpenses = '0';
    json.transactions = [];
    json.history = [];
  }
  else {
    // Get current data as a json
    const oldDataStr = modules.encriptionModule.decompressFromBase64(currentData.data);
    const oldData = modules.encriptionModule.stringToJSON(oldDataStr);
    
    json.total = oldData.total;
    json.totalIncome = oldData.totalIncome;
    json.totalExpenses = oldData.totalExpenses;
    json.transactions = oldData.transactions;
    json.history = [];
  }
  
  // Add all transactions
  transactions.map(transaction => {
    json.transactions.push({
      "label": `${transaction['label']}`,
      "type": `${transaction['type']}`,
      "value": `${transaction['value']}`,
      "date": `${transaction['date']}`,
      "tag": ``
    })
  })
  
  // Sort the transactions by date
  json.transactions.sort((a, b) => {
    const [dayA, monthA, yearA] = [
      parseInt(a.date.slice(0, 2), 10),
      parseInt(a.date.slice(2, 4), 10) - 1,
      parseInt(a.date.slice(4), 10),
    ];
    const [dayB, monthB, yearB] = [
      parseInt(b.date.slice(0, 2), 10),
      parseInt(b.date.slice(2, 4), 10) - 1,
      parseInt(b.date.slice(4), 10),
    ];
    
    const dateA = new Date(yearA, monthA, dayA);
    const dateB = new Date(yearB, monthB, dayB);
    
    return dateA - dateB;
  })
  
  // Calculate total income & expenses
  transactions.map(transaction => {
    if (transaction.type == 'income') json.totalIncome = (parseFloat(json.totalIncome) + parseFloat(transaction.value)).toFixed(2);
    if (transaction.type == 'expense') json.totalExpenses = (parseFloat(json.totalExpenses) + parseFloat(transaction.value)).toFixed(2);
  })
  
  // Create each year obj in history
  let prevYear = json.transactions[0]?.date.slice(-4);
  let gain = 0;
  let loss = 0;
  json.transactions.map(transaction => {
    if (transaction.date.slice(-4) > prevYear) {
      json.history.push({ 'year': prevYear, 'gain': gain.toFixed(2), 'loss': loss.toFixed(2) })
      gain = 0;
      loss = 0;
      prevYear = transaction.date.slice(-4);
    }
    if (transaction.type == 'income') gain += parseFloat(transaction.value);
    if (transaction.type == 'expense') loss -= parseFloat(transaction.value);
  });
  json.history.push({ 'year': prevYear, 'gain': gain, 'loss': loss })
  
  // Calculate total net
  json.total = parseFloat((json.totalIncome) - (json.totalExpenses)).toFixed(2);
  
  return json;
}

// Add new document in the collection data
export const dbAddDoc = async (crypt='') => {
  try {
    const docRef = await setDoc(doc(db, "data", auth.currentUser.uid), {
      data: crypt,
      owner: auth.currentUser.uid
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Add new transaction to user's current data in the collection data
export const dbAddData = async (transactions) => {
  // Create a new data object with the transactions
  const json = await createDataObject(transactions)
  
  // Base64 & upload to firestore
  const str = modules.encriptionModule.jsonToString(json);
  const crypt = modules.encriptionModule.compressToBase64(str);
  dbAddDoc(crypt);
}

// Create new data object from scratch for new users to add to their data in the collection data
export const dbFillNewData = async (transactions) => {
  // Reformat CSV from KBC to my field names
  transactions.map(transaction => {
    // Create new keys with old values
    transaction['label'] = transaction['Free-format reference'];
    transaction['type'] = parseFloat(transaction['Amount']) > 0 ? 'income' : 'expense';
    transaction['value'] = transaction['Amount'].replace('-', '').replace(',', '.');
    transaction['date'] = transaction['Date'].replaceAll('/', '');
    
    // Delete old keys to not have duplicates
    delete transaction['Free-format reference'];
    delete transaction['Amount'];
    delete transaction['Date'];
  })
  
  // Create a new data object with the new transactions
  const json = await createDataObject(transactions);
  
  // Base64 & upload to firestore
  const str = modules.encriptionModule.jsonToString(json);
  const crypt = modules.encriptionModule.compressToBase64(str);
  dbAddDoc(crypt);
}



// ==========================
//         ANALYTICS
// ==========================
export const analytics = getAnalytics(app);



// ==========================
//       AUTHENTICATION
// ==========================
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)