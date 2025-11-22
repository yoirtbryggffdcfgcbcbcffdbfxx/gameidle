
/**
 * ============================================================================
 * QUANTUM CORE - BACKEND SCRIPT (Google Apps Script)
 * ============================================================================
 * 
 * INSTRUCTIONS DE DÉPLOIEMENT :
 * 1. Copiez ce contenu dans Code.gs sur script.google.com
 * 2. Sauvegardez (Ctrl+S).
 * 3. Cliquez sur le bouton bleu "Déployer" > "Nouveau déploiement".
 * 4. Cliquez sur la roue dentée à côté de "Sélectionner le type" > "Application Web".
 * 5. Configurez :
 *    - Description : "Version Mise à Jour"
 *    - Exécuter en tant que : "Moi" (votre email)
 *    - Qui peut accéder : "Tout le monde" (IMPORTANT)
 * 6. Cliquez sur "Déployer".
 * 7. Si l'URL change, copiez-la dans les paramètres du jeu. Sinon, l'ancienne URL fonctionnera avec le nouveau code.
 */

// Declare Google Apps Script globals to satisfy TypeScript compiler
declare var LockService: any;
declare var SpreadsheetApp: any;
declare var ContentService: any;

function doGet(e: any) { return handleRequest(e); }
function doPost(e: any) { return handleRequest(e); }

function handleRequest(e: any) {
  var lock = LockService.getScriptLock();
  // On attend 10 sec max pour le verrou
  if (!lock.tryLock(10000)) {
    return error("Server busy, try again.");
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var params = e.parameter || {};
    var postData: any = {};
    if (e.postData && e.postData.contents) {
      try { postData = JSON.parse(e.postData.contents); } catch(err) {}
    }

    var action = params.action || postData.action || "load";
    
    // Nettoyage des entrées
    var userId = (params.userId || postData.userId || "").toString().trim();
    var password = (params.password || postData.password || "").toString().trim();
    var saveData = params.saveData || postData.saveData;
    var slotId = params.slotId || postData.slotId; 

    // --- ACTION PUBLIQUE : HEURE SERVEUR ---
    // Permet de synchroniser le jeu sur une horloge impossible à tricher
    if (action === "getTime") {
      return success(new Date().toISOString());
    }

    if (!userId) return error("User ID missing");

    // On récupère tout le tableau pour chercher dedans
    var data = sheet.getDataRange().getValues();
    
    // --- FONCTION DE RECHERCHE ---
    function findArrayRowIndex(id: string) {
      for (var i = 1; i < data.length; i++) {
        // Comparaison stricte des chaînes (Colonne A = Index 0)
        if (String(data[i][0]) === String(id)) return i;
      }
      return -1;
    }

    // --- INSCRIPTION ---
    if (action === "register") {
      if (!password) return error("Password required");
      if (findArrayRowIndex(userId) !== -1) return error("Account already exists");

      var timestamp = new Date().toISOString();
      // Structure: [ID, DATA/TYPE, TIMESTAMP, PASSWORD]
      sheet.appendRow([userId, '{"type":"ACCOUNT_MASTER"}', timestamp, password]);
      return success("Account created");
    }

    // --- CONNEXION (Vérification simple) ---
    if (action === "login") {
      var idx = findArrayRowIndex(userId);
      if (idx === -1) return error("User not found");
      
      var storedPass = String(data[idx][3]).trim(); 
      
      if (storedPass !== password) return error("Invalid password");

      return success("Logged in");
    }

    // --- GESTION DES SLOTS DE SAUVEGARDE ---
    // L'ID du slot est "User_SlotNumber" (ex: Joueur1_1)
    var fullId = userId + "_" + slotId;

    if (action === "save") {
      // 1. Vérifier le mot de passe du compte maître (User) avant de toucher au slot
      var masterIdx = findArrayRowIndex(userId);
      if (masterIdx === -1) return error("Account not found");
      
      var masterPass = String(data[masterIdx][3]).trim();
      if (masterPass !== password) return error("Invalid password");

      // 2. Sauvegarder le slot
      var slotIdx = findArrayRowIndex(fullId);
      var timestamp = new Date().toISOString();

      if (slotIdx === -1) {
        // Création nouvelle ligne pour ce slot
        // Col A: fullId, Col B: Data, Col C: Time, Col D: Password (copie du master pour redondance/secu)
        sheet.appendRow([fullId, saveData, timestamp, password]);
      } else {
        // Mise à jour ligne existante (Index + 1 car les sheets commencent à la ligne 1)
        // setValues est plus efficace que plusieurs setValue
        // On met à jour Data (Col 2), Time (Col 3), Pass (Col 4)
        var range = sheet.getRange(slotIdx + 1, 2, 1, 3); 
        range.setValues([[saveData, timestamp, password]]);
      }
      return success("Saved");
    }

    if (action === "load") {
      var slotIdx = findArrayRowIndex(fullId);
      
      // Si le slot n'existe pas, on renvoie "empty" pour que le jeu sache qu'il est vide
      if (slotIdx === -1) return jsonResponse({ status: "empty" });

      // Vérification mot de passe sur le slot
      var slotPass = String(data[slotIdx][3]).trim();
      if (slotPass && slotPass !== password) return error("Invalid password");

      return jsonResponse({
        status: "found",
        data: data[slotIdx][1],      // La sauvegarde codée en Base64
        lastSaveTime: data[slotIdx][2] // La date serveur de la sauvegarde
      });
    }

    return error("Unknown action");

  } catch (e: any) {
    return error(e.toString());
  } finally {
    lock.releaseLock();
  }
}

// --- HELPERS ---

function error(msg: string) {
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: msg })).setMimeType(ContentService.MimeType.JSON);
}

function success(msg: string) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: msg })).setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(obj: any) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
