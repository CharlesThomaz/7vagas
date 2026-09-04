import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
    getDatabase,
    push,
    ref,
    serverTimestamp,
    set,
    update
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';

const firebaseConfig = {
    apiKey: 'AIzaSyA6bqDjxV9XQEwQiwE0NhyZ3z0RgvZ7LVw',
    authDomain: 'setelagoasvagas.firebaseapp.com',
    databaseURL: 'https://setelagoasvagas-default-rtdb.firebaseio.com',
    projectId: 'setelagoasvagas',
    storageBucket: 'setelagoasvagas.firebasestorage.app',
    messagingSenderId: '787832294268',
    appId: '1:787832294268:web:18bde002a631a61b78b2f9',
    measurementId: 'G-Y5DWQGVMB5'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'pt-BR';
const database = getDatabase(app);
const authPronto = new Promise(resolve => {
    onAuthStateChanged(auth, resolve, () => resolve(null));
});

window.obterUsuarioFirebase = async () => {
    await authPronto;
    return auth.currentUser;
};

window.criarContaFirebase = async ({ nome, email, senha }) => {
    const credencial = await createUserWithEmailAndPassword(auth, email, senha);

    await updateProfile(credencial.user, { displayName: nome });
    await sendEmailVerification(credencial.user);

    return credencial.user;
};

window.entrarFirebase = async ({ email, senha }) => {
    const credencial = await signInWithEmailAndPassword(auth, email, senha);
    return credencial.user;
};

window.enviarRedefinicaoSenhaFirebase = email =>
    sendPasswordResetEmail(auth, email);

window.entrarComGoogleFirebase = async () => {
    const provedor = new GoogleAuthProvider();
    provedor.setCustomParameters({ prompt: 'select_account' });

    const credencial = await signInWithPopup(auth, provedor);
    return credencial.user;
};

window.salvarPerfilUsuarioFirebase = async usuario => {
    if (!usuario?.uid) {
        throw new Error('Usuário inválido para salvar no banco de dados.');
    }

    const provedor = usuario.providerData?.[0]?.providerId || 'password';

    await update(ref(database, `usuarios/${usuario.uid}`), {
        nome: usuario.displayName || '',
        email: usuario.email || '',
        fotoUrl: usuario.photoURL || '',
        uid: usuario.uid,
        provedor,
        atualizadoEm: serverTimestamp()
    });
};

window.salvarLeadAnuncioFirebase = async ({ usuario, empresa, whatsapp, interesse }) => {
    const leadRef = push(ref(database, `leadsAnuncios/${usuario.uid}`));

    await set(leadRef, {
        empresa,
        whatsapp,
        interesse,
        nome: usuario.displayName || '',
        email: usuario.email || '',
        criadoEm: serverTimestamp()
    });
};

window.sairFirebase = () => signOut(auth);

// O script principal pode ser executado antes de este módulo terminar de
// carregar. Este evento permite que ele sincronize a sessão nesse caso.
window.dispatchEvent(new Event('firebase-auth-ready'));
