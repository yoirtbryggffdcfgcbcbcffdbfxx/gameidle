
/**
 * ============================================================================
 * QUANTUM CORE - BACKEND SCRIPT (Google Apps Script)
 * ============================================================================
 * 
 * Ce fichier contient le code source EXACT à copier-coller dans l'éditeur de script Google.
 * 
 * INSTRUCTIONS DE DÉPLOIEMENT :
 * 1. Allez sur https://script.google.com/
 * 2. Créez un nouveau projet.
 * 3. Copiez-collez tout ce code dans le fichier `Code.gs`.
 * 4. Enregistrez (Ctrl+S).
 * 5. Cliquez sur "Déployer" > "Nouveau déploiement".
 * 6. Type: "Application Web".
 * 7. Description: "Version Prod".
 * 8. Exécuter en tant que: "Moi".
 * 9. Qui peut accéder: "Tout le monde".
 * 10. Copiez l'URL générée (/exec).
 */

// Ces déclarations permettent à TypeScript de ne pas signaler d'erreurs
declare var LockService: any;
declare var SpreadsheetApp: any;
declare var ContentService: any;

function doGet(e: any) { return handleRequest(e); }
function doPost(e: any) { return handleRequest(e); }

function handleRequest(e: any) {
  var lock = LockService.getScriptLock();
  // On attend moins longtemps pour éviter de bloquer l'UI si ça lag
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
    // On force la conversion en String et on nettoie les espaces pour éviter les bugs "Toto " vs "Toto"
    var userId = (params.userId || postData.userId || "").toString().trim();
    var password = (params.password || postData.password || "").toString().trim();
    var saveData = params.saveData || postData.saveData;
    var slotId = params.slotId || postData.slotId; 

    if (!userId) return error("User ID missing");

    // On récupère tout le tableau
    var data = sheet.getDataRange().getValues();
    
    // --- FONCTION DE RECHERCHE CORRIGÉE ---
    // Retourne l'index réel du tableau (0, 1, 2...)
    function findArrayRowIndex(id: string) {
      for (var i = 1; i < data.length; i++) {
        // Comparaison stricte des chaînes
        if (String(data[i][0]) === String(id)) return i;
      }
      return -1;
    }

    // --- INSCRIPTION ---
    if (action === "register") {
      if (!password) return error("Password required");
      if (findArrayRowIndex(userId) !== -1) return error("Account already exists");

      var timestamp = new Date().toISOString();
      sheet.appendRow([userId, '{"type":"ACCOUNT_MASTER"}', timestamp, password]);
      return success("Account created");
    }

    // --- CONNEXION ---
    if (action === "login") {
      var idx = findArrayRowIndex(userId);
      if (idx === -1) return error("User not found");
      
      // Correction ici : on utilise l'index direct trouvé par la boucle
      var storedPass = String(data[idx][3]).trim(); 
      
      if (storedPass !== password) return error("Invalid password");

      return success("Logged in");
    }

    // --- SAUVEGARDE / CHARGEMENT (Gestion des Slots) ---
    var fullId = userId + "_" + slotId;

    if (action === "save") {
      // 1. Vérifier le mot de passe du compte maître
      var masterIdx = findArrayRowIndex(userId);
      if (masterIdx === -1) return error("Account not found");
      
      var masterPass = String(data[masterIdx][3]).trim();
      if (masterPass !== password) return error("Invalid password");

      // 2. Sauvegarder le slot
      var slotIdx = findArrayRowIndex(fullId);
      var timestamp = new Date().toISOString();

      if (slotIdx === -1) {
        // Création nouvelle ligne slot (On stocke aussi le mdp pour redondance/sécurité future)
        sheet.appendRow([fullId, saveData, timestamp, password]);
      } else {
        // Mise à jour ligne existante (Index + 1 car getRange est base 1)
        sheet.getRange(slotIdx + 1, 2).setValue(saveData);
        sheet.getRange(slotIdx + 1, 3).setValue(timestamp);
        sheet.getRange(slotIdx + 1, 4).setValue(password);
      }
      return success("Saved");
    }

    if (action === "load") {
      var slotIdx = findArrayRowIndex(fullId);
      if (slotIdx === -1) return jsonResponse({ status: "empty" });

      // Vérification mdp sur le slot (ou via le master si tu préfères, ici on vérifie le slot)
      var slotPass = String(data[slotIdx][3]).trim();
      // Si le slot n'a pas de mot de passe (vieux slots), on laisse passer, sinon on vérifie
      if (slotPass && slotPass !== password) return error("Invalid password");

      return jsonResponse({
        status: "found",
        data: data[slotIdx][1],
        lastSaveTime: data[slotIdx][2]
      });
    }

    return error("Unknown action");

  } catch (e: any) {
    return error(e.toString());
  } finally {
    lock.releaseLock();
  }
}

function error(msg: string) {
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: msg })).setMimeType(ContentService.MimeType.JSON);
}
function success(msg: string) {
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: msg })).setMimeType(ContentService.MimeType.JSON);
}
function jsonResponse(obj: any) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
