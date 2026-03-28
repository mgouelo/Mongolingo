import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    // exécute le script /databse/init.js  qui remet les valeurs de la BDD par défaut
    const { stdout, stderr } = await execPromise('node ./database/init.js');

    if (stderr && !stderr.includes("DeprecationWarning")) {
       console.warn("Avertissement lors de la réinitialisation :", stderr);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Base de données réinitialisée avec les données de départ !" 
    });

  } catch (error) {
    console.error("Erreur lors de la réinitialisation :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}