//
//  _   _            _
// | | | | ___  _ __(_)_______  _ __
// | |_| |/ _ \| '__| |_  / _ \| '_ \
// |  _  | (_) | |  | |/ / (_) | | | |
// |_| |_|\___/|_|  |_/___\___/|_| |_|
//
// Horizon Discord Bot version 1.4.3
//
// Créé par Horizon et Minteck
// Copyright (c) 2019, Horizon
//
// Horizon est distribué sous licence Minteck Projects PLA 1.0.
// Pour en savoir plus, vous pouvez accéder à ce site Internet :
//    http://projectpedia.referata.com/wiki/Licence:Minteck_Projects_PLA
//
// ChangeLog, Mise à jour 1.5 :
//  - Séparation des commandes en plusieurs fichiers
//  - Création de 'libhorizon' pour un chargement plus efficace et plus sûr
//
// ChangeLog, Mise à jour 1.4.3 :
//  - Finalisation du système de gestion audio
//  - Ajout de l'option --kernel-verbose
//
// ChangeLog, Mise à jour 1.4.2 :
//  - Multiples patches
//
// ChangeLog, Mise à jour 1.4.1 :
//  - Amélioration des commandes ><mj et ><ml
//  - Ajout de la commande de déboggage ><md
//
// ChangeLog, Mise à jour 1.4.3 :
//  - Application du décallage horaire d'Europe Centrale au log
//  - Ajout de l'option voiceChannel
//
// ChangeLog, Mise à jour 1.3.2 :
//  - Résolution en urgence d'un problème avec la commande ><l
//
// ChangeLog, Mise à jour 1.3.1 :
//  - Résolution en urgence d'un problème avec la commande ><d
//
// ChangeLog, Mise à jour 1.3 :
//  - Résolution du message d'error avec fs.writeFile
//  - Résolution du problème d'espacement du sendMessage
//  - Ajout d'une commande pour obtenir le journal système
//  - Ajout d'une commande pour changer le message de jeu
//
// ChangeLog, Mise à jour 1.2.1 :
//  - Correction d'un problème empêchant le démarrage du bot
//
// ChangeLog, Mise à jour 1.2 :
//  - Amélioration de la console (plus de détails)
//  - Traçabilité des refus d'accès aux utilisateurs
//  - Syntaxe globale pour la console
//  - Capture des erreurs de communication

const underscorelib = require('underscore');
const Discord = require('discord.js');
const os = require('os');
const fs = require('fs');
var childProcess = require('child_process');

function runScript(scriptPath, callback) {
    var invoked = false;

    var process = childProcess.fork(scriptPath);


    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });


    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

runScript('./libhorizon/configParse.js', function (err) {
    if (err) throw err;
	console.log('[libhorizonBootstraper] [configParse] La configuration à été initialisée correctement...');
	runScript('./libhorizon/clientRuntime.js', function (err) {
		if (err) throw err;
		console.log("[libhorizonBootstraper] [clientRuntime] Le client d'est arrêté");
	});
});