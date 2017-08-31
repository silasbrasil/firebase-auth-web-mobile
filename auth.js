'use strict'
/**
 * @description Modules to authentication with firebase to Web Browser
 * and cordova App.
 */
import firebase from 'firebase'
import Promise from 'Bluebird'


class Auth {
    /**
     * Config firebase modules with firebaseConfig and Google PLus Plugin with
     * webClient
     * @param {Object} firebaseConfig
     * @param {String} webClientId
     */
    constructor ( firebaseConfig, webClientId ) {
        this._webClientId = webClientId
        firebase.initializeApp( firebaseConfig )
    }

    /**
     * Get webClientId used on Google Plus Authentication
     * @return {String} webClientId
     */
    get webClientId () { return this._webClientId }

    /**
     * Loga com Email e Senha
     *  @param {Object} EmailAndPassword com email e password
     *  @return {Promise}
     */
    signInWithEmailAndPassword ( EmailAndPassword ) {
        const { email, password } = EmailAndPassword
        return firebase.auth().signInWithEmailAndPassword( email, password )
    }

    /**
     * Login com Google
     *  @return Promise com User do Firebase
     */
    signInWithGoogle () {
        if ( typeof cordova === 'obejct' ) {
            return new Promise((resolve, reject) => {
                window.plugins.googleplus.login(
                    { 'webClientId': this._webClientId },
                    result => {
                        let googleCredential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
                        firebase.auth().signInWithCredential(googleCredential)
                            .then(user => resolve(user))
                            .catch(error => reject(error))
                    },
                    error => {
                        console.log('## ERRO: ', error)
                        reject(new Error('Não foi possível acessar o Provedor do Google'))
                    })
            })
        } else {
            let provider = new firebase.auth.GoogleAuthProvider()
            return firebase.auth().signInWithPopup(provider)
        }
    }
}
