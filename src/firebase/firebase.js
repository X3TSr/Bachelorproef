import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
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



// Multilingual keyword mapping for automatic tagging
const TAG_KEYWORDS = {
  'Food': {
    en: ['restaurant', 'cafe', 'supermarket', 'grocery', 'bakery', 'food', 'meal', 'dinner', 'lunch', 'breakfast', 'drink'],
    fr: ['restaurant', 'café', 'supermarché', 'épicerie', 'boulangerie', 'nourriture', 'repas', 'dîner', 'déjeuner', 'petit déjeuner', 'boisson'],
    nl: ['restaurant', 'café', 'supermarkt', 'winkel', 'bakkerij', 'eten', 'maaltijd', 'diner', 'lunch', 'ontbijt', 'drank']
  },
  'Marketing': {
    en: ['facebook ads', 'google ads', 'seo', 'campaign', 'promotion', 'advertisement', 'marketing', 'advertising'],
    fr: ['publicité facebook', 'publicité google', 'seo', 'campagne', 'promotion', 'annonce', 'marketing', 'publicité'],
    nl: ['facebook advertenties', 'google advertenties', 'seo', 'campagne', 'promotie', 'advertentie', 'marketing', 'reclame']
  },
  'Social Contribution': {
    en: ['donation', 'charity', 'ngo', 'non-profit', 'social cause', 'support', 'social contribution'],
    fr: ['don', 'charité', 'ONG', 'organisation à but non lucratif', 'cause sociale', 'soutien', 'contribution sociale'],
    nl: ['donatie', 'liefdadigheid', 'ngo', 'non-profit', 'sociaal doel', 'steun', 'maatschappelijke bijdrage']
  },
  'Taxes': {
    en: ['tax', 'vat', 'income tax', 'tax return', 'taxes', 'tax payment'],
    fr: ['taxe', 'TVA', 'impôt sur le revenu', 'déclaration fiscale', 'impôts', 'paiement des impôts'],
    nl: ['belasting', 'btw', 'inkomstenbelasting', 'belastingaangifte', 'belastingen', 'belastingbetaling']
  },
  'Travel': {
    en: ['hotel', 'airbnb', 'flight', 'booking.com', 'train', 'bus', 'travel', 'trip', 'vacation', 'holiday', 'transportation'],
    fr: ['hôtel', 'airbnb', 'vol', 'booking.com', 'train', 'bus', 'voyage', 'trajet', 'vacances', 'transport'],
    nl: ['hotel', 'airbnb', 'vlucht', 'booking.com', 'trein', 'bus', 'reis', 'trip', 'vakantie', 'vervoer']
  },
  'Water & Electricity': {
    en: ['electricity', 'water', 'utility', 'heating', 'cooling', 'utilities'],
    fr: ['électricité', 'eau', 'service public', 'chauffage', 'climatisation', 'services publics'],
    nl: ['elektriciteit', 'water', 'nutsvoorziening', 'verwarming', 'koeling', 'nutsbedrijven']
  },
  'Transport': {
    en: ['bus', 'tram', 'fuel', 'diesel', 'parking', 'taxi', 'uber', 'lyft', 'transport', 'vehicle', 'car', 'motorcycle'],
    fr: ['bus', 'tram', 'carburant', 'diesel', 'parking', 'taxi', 'transport', 'véhicule', 'voiture', 'moto'],
    nl: ['bus', 'tram', 'brandstof', 'diesel', 'parking', 'taxi', 'vervoer', 'voertuig', 'auto', 'motorfiets']
  },
  'Shopping': {
    en: ['amazon', 'bol.com', 'ikea', 'shop', 'mall', 'clothing', 'electronics', 'furniture', 'shopping'],
    fr: ['amazon', 'bol.com', 'ikea', 'magasin', 'centre commercial', 'vêtements', 'électronique', 'meubles', 'shopping'],
    nl: ['amazon', 'bol.com', 'ikea', 'winkel', 'winkelcentrum', 'kleding', 'elektronica', 'meubels', 'winkelen']
  },
  'Bills': {
    en: ['phone bill', 'internet', 'subscription', 'streaming', 'bill', 'invoice', 'payment', 'service'],
    fr: ['facture téléphone', 'internet', 'abonnement', 'streaming', 'facture', 'invoice', 'paiement', 'service'],
    nl: ['telefoonrekening', 'internet', 'abonnement', 'streaming', 'rekening', 'factuur', 'betaling', 'dienst']
  },
  'Health': {
    en: ['pharmacy', 'doctor', 'dentist', 'hospital', 'health', 'medical', 'wellness', 'fitness', 'gym', 'healthcare'],
    fr: ['pharmacie', 'médecin', 'dentiste', 'hôpital', 'santé', 'médical', 'bien-être', 'fitness', 'salle de sport', 'soins de santé'],
    nl: ['apotheek', 'arts', 'tandarts', 'ziekenhuis', 'gezondheid', 'medisch', 'wellness', 'fitness', 'sportschool', 'gezondheidszorg']
  },
  'Entertainment': {
    en: ['cinema', 'netflix', 'concert', 'event', 'theater', 'music', 'entertainment', 'game', 'hobby', 'leisure', 'D&D'],
    fr: ['cinéma', 'netflix', 'concert', 'événement', 'théâtre', 'musique', 'divertissement', 'jeu', 'loisir', 'hobby', 'D&D'],
    nl: ['bioscoop', 'netflix', 'concert', 'evenement', 'theater', 'muziek', 'entertainment', 'spel', 'hobby', 'vrije tijd', 'D&D']
  }
};

// Helper to normalize strings: lowercase + remove accents
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD') // separate accents
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .trim();
}

function getTagForTransaction(label) {
  const normalizedLabel = normalize(label);
  for (const [tag, langs] of Object.entries(TAG_KEYWORDS)) {
    for (const keywords of Object.values(langs)) {
      for (const kw of keywords) {
        const normalizedKw = normalize(kw);
        if (normalizedLabel.includes(normalizedKw)) {
          return tag;
        }
      }
    }
  }
  return '';
}

// Helper to generate unique IDs for transactions
function generateUID() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}


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
    // Preserve existing transactions but ensure each has a uid
    json.transactions = (oldData.transactions || []).map(t => ({
      ...t,
      uid: t.uid && String(t.uid).trim() !== '' ? String(t.uid).trim() : generateUID()
    }));
    json.history = [];
  }
  
  // Add all transactions (convert and add metadata)
  for (const transaction of transactions) {
    const obj = {
      label: `${transaction['label']}`,
      type: `${transaction['type']}`,
      value: `${transaction['value']}`,
      date: `${transaction['date']}`,
      // Use provided tag if given, otherwise auto-detect from the label
      tag: transaction['tag'] && String(transaction['tag']).trim() !== '' ? String(transaction['tag']).trim() : getTagForTransaction(transaction['label']),
      // Preserve uid if provided, otherwise generate one
      uid: transaction['uid'] && String(transaction['uid']).trim() !== '' ? String(transaction['uid']).trim() : generateUID(),
    };
    json.transactions.push(obj);
  }
  
  // Sort the transactions by date using a yyyyMMdd key for faster comparisons
  json.transactions.sort((a, b) => {
    const keyA = a.date.slice(4) + a.date.slice(2, 4) + a.date.slice(0, 2);
    const keyB = b.date.slice(4) + b.date.slice(2, 4) + b.date.slice(0, 2);
    return keyA.localeCompare(keyB);
  });
  
  // Update totals by iterating only the newly added transactions (last N entries) to avoid reprocessing existing
  const newCount = transactions.length;
  if (newCount > 0) {
    const startIndex = json.transactions.length - newCount;
    for (let i = startIndex; i < json.transactions.length; i++) {
      const t = json.transactions[i];
      if (t.type == 'income') json.totalIncome = (parseFloat(json.totalIncome) + parseFloat(t.value)).toFixed(2);
      if (t.type == 'expense') json.totalExpenses = (parseFloat(json.totalExpenses) + parseFloat(t.value)).toFixed(2);
    }
  }

  // Create history: iterate all transactions once to build yearly gain/loss
  if (json.transactions.length) {
    let prevYear = json.transactions[0].date.slice(-4);
    let gain = 0;
    let loss = 0;
    for (const transaction of json.transactions) {
      const year = transaction.date.slice(-4);
      if (year > prevYear) {
        json.history.push({ year: prevYear, gain: gain.toFixed(2), loss: loss.toFixed(2) });
        gain = 0;
        loss = 0;
        prevYear = year;
      }
      if (transaction.type == 'income') gain += parseFloat(transaction.value);
      if (transaction.type == 'expense') loss -= parseFloat(transaction.value);
    }
    json.history.push({ year: prevYear, gain: gain, loss: loss });
  }
  
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
    // Assign UID for each imported transaction
    transaction['uid'] = generateUID();
    
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



// ===========================
//      UPDATE DOCUMENTS
// ===========================
export const dbUpdateTransaction = async (updatedTransaction) => {
  // Get current data
  const currentData = await dbReadDoc('data', auth.currentUser.uid);
  if (!currentData || !currentData.data) return;
  
  // Decrypt and parse data
  const oldDataStr = modules.encriptionModule.decompressFromBase64(currentData.data);
  const oldData = modules.encriptionModule.stringToJSON(oldDataStr);
  
  // Update the transaction by matching fields
  let found = false;
  oldData.transactions = oldData.transactions.map(t => {
    // Prefer matching by uid when available
    if (updatedTransaction.uid && t.uid === updatedTransaction.uid) {
      found = true;
      return { ...t, ...updatedTransaction };
    }
    // Fallback for legacy transactions without uid: match by identifying fields
    if (!updatedTransaction.uid && (
      t.label === updatedTransaction.label &&
      t.type === updatedTransaction.type &&
      t.date === updatedTransaction.date
    )) {
      found = true;
      return { ...t, ...updatedTransaction };
    }
    return t;
  });
  
  if (found) {
    // Encrypt and update Firestore using updateDoc
    const str = modules.encriptionModule.jsonToString(oldData);
    const crypt = modules.encriptionModule.compressToBase64(str);
    const docRef = doc(db, "data", auth.currentUser.uid);
    await updateDoc(docRef, { data: crypt });
  }
};

// Delete transaction from user's data
export const dbDeleteTransaction = async (transactionToDelete) => {
  try {
    const currentData = await dbReadDoc('data', auth.currentUser.uid);
    if (!currentData || !currentData.data) return;

    // Decrypt and parse data
    const oldDataStr = modules.encriptionModule.decompressFromBase64(currentData.data);
    const oldData = modules.encriptionModule.stringToJSON(oldDataStr);

    // Find index of transaction to delete (match by uid when possible)
    let index = -1;
    if (transactionToDelete.uid) {
      index = oldData.transactions.findIndex(t => t.uid === transactionToDelete.uid);
    }
    // Fallback: if uid not provided or not found, try matching by fields (legacy)
    if (index === -1) {
      index = oldData.transactions.findIndex(t => 
        t.label === transactionToDelete.label &&
        t.type === transactionToDelete.type &&
        t.value === transactionToDelete.value &&
        t.date === transactionToDelete.date
      );
    }

    if (index === -1) return; // nothing to delete

    // Remove the transaction
    oldData.transactions.splice(index, 1);

    // Recompute totals
    let totalIncome = 0;
    let totalExpenses = 0;
    for (const t of oldData.transactions) {
      if (t.type == 'income') totalIncome += parseFloat(t.value);
      if (t.type == 'expense') totalExpenses += parseFloat(t.value);
    }
    oldData.totalIncome = parseFloat(totalIncome).toFixed(2);
    oldData.totalExpenses = parseFloat(totalExpenses).toFixed(2);
    oldData.total = parseFloat(oldData.totalIncome - oldData.totalExpenses).toFixed(2);

    // Rebuild history grouped by year
    if (oldData.transactions.length) {
      // Sort transactions by date key (yyyyMMdd)
      oldData.transactions.sort((a, b) => {
        const keyA = a.date.slice(4) + a.date.slice(2, 4) + a.date.slice(0, 2);
        const keyB = b.date.slice(4) + b.date.slice(2, 4) + b.date.slice(0, 2);
        return keyA.localeCompare(keyB);
      });

      oldData.history = [];
      let prevYear = oldData.transactions[0].date.slice(-4);
      let gain = 0;
      let loss = 0;
      for (const t of oldData.transactions) {
        const year = t.date.slice(-4);
        if (year > prevYear) {
          oldData.history.push({ year: prevYear, gain: gain.toFixed(2), loss: loss.toFixed(2) });
          gain = 0;
          loss = 0;
          prevYear = year;
        }
        if (t.type == 'income') gain += parseFloat(t.value);
        if (t.type == 'expense') loss -= parseFloat(t.value);
      }
      oldData.history.push({ year: prevYear, gain: gain.toFixed(2), loss: loss.toFixed(2) });
    } else {
      oldData.history = [];
    }

    // Encrypt and update Firestore
    const str = modules.encriptionModule.jsonToString(oldData);
    const crypt = modules.encriptionModule.compressToBase64(str);
    const docRef = doc(db, "data", auth.currentUser.uid);
    await updateDoc(docRef, { data: crypt });

  } catch (e) {
    console.error('Error deleting transaction: ', e);
  }
};



// ==========================
//         ANALYTICS
// ==========================
export const analytics = getAnalytics(app);



// ==========================
//       AUTHENTICATION
// ==========================
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)