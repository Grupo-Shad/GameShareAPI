import admin from "firebase-admin";
import fs from "fs";

// Inicializa Firebase Admin solo una vez
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(
      "./gameshareapp-d2395-firebase-adminsdk-fbsvc-0e421fb2b2.json",
      "utf8"
    )
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const authenticateFirebase = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error al verificar token Firebase:", error);
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
