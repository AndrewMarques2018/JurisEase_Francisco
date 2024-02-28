import { sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAuthentication } from './firebaseConfig'
import { getFirebaseErrorMessage } from './firebaseException'

let auth = await getAuthentication();

export async function verifyPassword(email, password) {
	console.log("Verificando password to", email)
	console.log("pass entry:", password)
	try {
	  // Autenticação com o Firebase
	  console.log("disparo da solicitação")
	  const userCredential = await signInWithEmailAndPassword(auth, email, password);
	  console.log("Retorno:", userCredential)
  
	  // Se a autenticação foi bem-sucedida, a senha é válida
	  if (userCredential.user) {
		return true;
	  } else {
		return false;
	  }
	} catch (error) {
	  // Se houve algum erro, a senha não é válida
	  return false;
	}
  }

export async function recoverPassword(email) {
	console.log("recovery pass:", email)
	await sendPasswordResetEmail(auth, email).then(() => {
		alert('Email enviado com sucesso');

	}).catch(error => {
		alert(error.message)
		console.log(error)
	});
}

export const register = async (email, password) => {
	let data = {};
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		localStorage.setItem('uid', user.uid);

		data.user = user;
		data.message = 'Sucesso ao cadastrar usuario';
		return data;

	} catch (error) {
		console.log(error.code)
		const errorMessage = await getFirebaseErrorMessage(error.code);
		data.error = errorMessage;
		return data;
	}
}

export const signIn = async (email, password) => {
	let data = {};
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		localStorage.setItem('uid', user.uid);
		data.user = user;
		data.message = 'Sucesso ao realisar login';
		return data;

	} catch (error) {
		console.log(error.code)
		const errorMessage = await getFirebaseErrorMessage(error.code);
		data.error = errorMessage;
		return data;
	}
}

export const logout = async () => {
	try {
		await signOut(auth);
		localStorage.removeItem('uid');
	} catch (error) {
		throw error;
	}
}

export const isUserAuthenticated = () => {
	const uid = localStorage.getItem('uid');

	return uid;
}