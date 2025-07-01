import admin from "firebase-admin";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendSharedListEmail = async ({ uid, listaNombre, compartidoPor }) => {
  if (!uid || !listaNombre || !compartidoPor) {
    throw new Error("Faltan parámetros para el correo de lista compartida");
  }

  try {
    const user = await admin.auth().getUser(uid);
    const email = user.email;
    const displayName = user.displayName || "Usuario";

    if (!email) {
      console.log(`El usuario ${uid} no tiene email`);
      return;
    }

    const subject = "¡Te compartieron una wishlist!";
    const html = `
      <p>Hola ${displayName},</p>
      <p><strong>${compartidoPor}</strong> te compartió la lista: <strong>${listaNombre}</strong>.</p>
      <p>Iniciá sesión en la app para verla.</p>
    `;

    await transporter.sendMail({
      from: `"Tu App" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log(`✅ Mail enviado a ${email}`);
  } catch (err) {
    console.log(`❌ Error al enviar mail a UID ${uid}:`, err);
  }
};

export default sendSharedListEmail;
