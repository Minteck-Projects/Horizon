const Discord = require('discord.js')
const client = new Discord.Client()
const Command = require('../libhorizon/commandRt')
let loginfo = "nothing"
var config = require('../config/config.json')
const fs = require('fs');
const os = require('os');
const shard = new Discord.ShardClientUtil(client);
const mode = require('../config/mode.json')
var JsonDB = require('node-json-db');
var db = new JsonDB("horigame/db.json", true, true);
let lstmsg

module.exports = class Horigame extends Command {

    static match(message) {
        if (config.enableHorigame) {
            if (message.guild) {
            if (message.content.startsWith("hg ")) {
            if (message.content == 'hg init') {
                try {
                    var data = db.getData("/game/" + message.author.id);
                } catch(error) {
                    lstmsg = message
                    initUser();
                };
                if (data) {
                message.channel.send(":no_entry: Le profil utilisateur de **" + message.author.username + "** existe déjà. Utilisez `hg reset` pour le réinitialiser")
            }}else{
                if (message.content == 'hg stats') {
                    try {
                        var data = db.getData("/game/" + message.author.id);
                    } catch(error) {
                        lstmsg = message
                        initErr();
                    };
                    if (data) {
                    var level = db.getData("/game/" + message.author.id + "/level")
                    var xp = db.getData("/game/" + message.author.id + "/xp")
                    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                    var xpBottle = db.getData("/game/" + message.author.id + "/bonus/xpBottle")
                    var goldPack = db.getData("/game/" + message.author.id + "/bonus/goldPack")
                    var ironPack = db.getData("/game/" + message.author.id + "/bonus/ironPack")
                    var woodPack = db.getData("/game/" + message.author.id + "/bonus/woodPack")
                    var totalXp = xp + ( level * 500 )
                    message.channel.send(":open_hands: **Bonjour " + message.author.username + ", voici vos statistiques :**\n\n:arrow_upper_right: **Niveau** : " + level + "\n:level_slider: **Points d'expérience pour ce niveau** : " + xp + "/500\n:up: **Total des points d'expérience** : " + totalXp + "\n:large_blue_diamond: **Diamants dans l'inventaire** : " + diamonds + "\n:large_orange_diamond: **Pépites d'or dans l'inventaire** : " + golds + "\n:flag_white: **Lingots de fer dans l'inventaire** : " + irons + "\n:pick:  **Planches de bois dans l'inventaire** : " + woods + "\n:milk: **Fioles d'expérience dans l'inventaire Bonus** : " + xpBottle + "\n:package: **Packs de *bois* dans l'inventaire Bonus** : " + woodPack + "\n:package: **Packs de *fer* dans l'inventaire Bonus** : " + ironPack + "\n:package: **Packs d'*or* dans l'inventaire Bonus** : " + goldPack)
                }}else{
                    if (message.content == 'hg reset') {
                        try {
                            var data = db.getData("/game/" + message.author.id);
                        } catch(error) {
                            lstmsg = message
                            initErr();
                        };
                        message.channel.send(":warning: Vous vous apprêtez à réinitialiser le profil utilisateur de **" + message.author.username + "**. Cette action est __irréversible__. **__SOYEZ BIEN SUR DE CE QUE VOUS FAITES !!!__**. Pour continuer tout de même, envoyez `hg reset --yes-i-know-what-im-doing`")
                    }else{
                        if (message.content == 'hg reset --yes-i-know-what-im-doing') {
                            try {
                                var data = db.getData("/game/" + message.author.id);
                            } catch(error) {
                                lstmsg = message
                                initErr();
                            };
                            message.channel.send(":file_cabinet: Le profil de **" + message.author.username + "** est en cours de réinitialisation, patientez...")
                            db.push("/game/" + message.author.id + "/level", 0);
                            db.push("/game/" + message.author.id + "/xp", 20);
                            db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                            db.push("/game/" + message.author.id + "/objects/irons", 0);
                            db.push("/game/" + message.author.id + "/objects/golds", 0);
                            db.push("/game/" + message.author.id + "/objects/woods", 5);
                            db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                            db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                            db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                            db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                            message.channel.send(":white_check_mark: Le profil utilisateur de **" + message.author.username + "** a été restauré aux valeurs par défaut.")
                        }else{
            if (message.content == 'hg reset --yes-i-know-what-im-doing') {
                try {
                    var data = db.getData("/game/" + message.author.id);
                } catch(error) {
                    lstmsg = message
                    initErr();
                };
                message.channel.send(":file_cabinet: Le profil de **" + message.author.username + "** est en cours de réinitialisation, patientez...")
                db.push("/game/" + message.author.id + "/level", 0);
                db.push("/game/" + message.author.id + "/xp", 20);
                db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                db.push("/game/" + message.author.id + "/objects/irons", 0);
                db.push("/game/" + message.author.id + "/objects/golds", 0);
                db.push("/game/" + message.author.id + "/objects/woods", 5);
                db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                message.channel.send(":white_check_mark: Le profil utilisateur de **" + message.author.username + "* a été restauré aux valeurs par défaut.")
            }else{
                if (message.content == 'hg shop') {
                    try {
                        var data = db.getData("/game/" + message.author.id);
                    } catch(error) {
                        lstmsg = message
                        initErr();
                    };
                    if (data) {
                    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                    var xp = db.getData("/game/" + message.author.id + "/xp")
                    message.channel.send(":shopping_bags: **Bienvenue dans la boutique Plug², " + message.author.username + " ! Voici les articles que nous avons actuellement :**\n\n:shopping_cart: **En stock :**\n1 :: `5⛏` :: 1 lingot de fer\n2 :: `5🏳️` :: 1 pépite d'or\n3 :: `5🔶` :: 1 diamant\n4 :: `3🔷` :: Grade Pionnier\n\n:gift: **Donner en cadeau :**\n1 :: `10⛏` :: Donner 10 planches de bois\n2 :: `10🏳️` :: Donner 10 lingots de fer\n3 :: `10🔶` :: Donner 10 pépites d'or\n4 :: `10🎚` :: Donner 10 points d'expérience\n\n:moneybag: **Votre solde :**\n     :level_slider: **Points d'expérience pour le niveau actuel** : " + xp + "/500\n     :large_blue_diamond: **Diamants** : " + diamonds + "\n     :large_orange_diamond: **Pépites d'or** : " + golds + "\n     :flag_white: **Lingots de fer** : " + irons + "\n     :pick: **Planches de bois** : " + woods + "\n\n**Commandes :**\nAcheter un article : `hg shop [IdentifiantArticle]`\n*La fonctionnalité de dons n'est pas encore disponible... Désolé !*")
                }}else{
                if (message.content.startsWith("hg shop ")) {
                    lstmsg = message
                    checkShop();
                }else{
            message.channel.send(":no_entry_sign: **" + message.content + "** n'est pas reconnu en temps que commande interne de Horigame. Vérifiez l'orthographe et réessayez. - `" + message.author.username + "`")
}}}}}}}}
try {
    var data = db.getData("/game/" + message.author.id);
} catch(error) {
};
if (data) {
    var userXp = db.getData("/game/" + message.author.id + "/xp");
    db.push("/game/" + message.author.id + "/xp", userXp + 10);
    var userXp = db.getData("/game/" + message.author.id + "/xp");
    if (userXp >= 500) {
        var userLevel = db.getData("/game/" + message.author.id + "/level");
        db.push("/game/" + message.author.id + "/level", userLevel + 1);
        db.push("/game/" + message.author.id + "/xp", 0);
        var planks = db.getData("/game/" + message.author.id + "/objects/woods");
        db.push("/game/" + message.author.id + "/objects/woods", planks + 15);
        var userLevel = db.getData("/game/" + message.author.id + "/level");
        message.author.send(":tools: Salut **" + message.author.username + "**, tu es maintenant au **niveau " + userLevel + "** ! Félicitations ! *(et tu gagne 15 planches de bois)*")
    }
}}}}}

function initErr() {
    lstmsg.channel.send(":no_entry: Aucun profil utilisateur correspondant à **" + lstmsg.author.username + "** n'a été trouvé. Exécutez la commande `hg init` pour en générer un...")
};

function initUser() {
    lstmsg.channel.send(":clock1: Patientez... L'initialisation du profil utilisateur de **" + lstmsg.author.username + "** est en cours...")
                db.push("/game/" + lstmsg.author.id + "/level", 0);
                db.push("/game/" + lstmsg.author.id + "/xp", 20);
                db.push("/game/" + lstmsg.author.id + "/objects/diamonds", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/irons", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/golds", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/woods", 5);
                db.push("/game/" + lstmsg.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/woodPack", 0);
                lstmsg.channel.send(":white_check_mark: Votre profil utilisateur à été initialisé correctement, vous pouvez maintenant commencer à jouer ! - `" + lstmsg.author.username + "`")
}

function checkShop() {
    let message = lstmsg
    let args = message.content.split(' ');
    args.shift();
    let object = args.join(' ')
    args = object.split(' ');
    args.shift();
    let selection = args.join(' ')
    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
    var xp = db.getData("/game/" + message.author.id + "/xp")
    if (selection == "1") {
        if (woods >= 5) {
            db.push("/game/" + message.author.id + "/objects/woods", woods - 5);
            db.push("/game/" + message.author.id + "/objects/irons", irons + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 lingot de fer** a été validée - `" + message.author.username + "`")
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            message.channel.send(":no_entry: Votre solde actuel (**" + woods + " planches de bois**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 planches de bois**.")
        }
    }else if (selection == "2") {
        if (irons >= 5) {
            db.push("/game/" + message.author.id + "/objects/irons", irons - 5);
            db.push("/game/" + message.author.id + "/objects/golds", golds + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 pépite d'or** a été validée - `" + message.author.username + "`")
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            message.channel.send(":no_entry: Votre solde actuel (**" + irons + " lingots de fer**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 lingots de fer**.")
        }
    }else if (selection == "3") {
        if (golds >= 5) {
            db.push("/game/" + message.author.id + "/objects/golds", golds - 5);
            db.push("/game/" + message.author.id + "/objects/diamonds", diamonds + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 diamant** a été validée - `" + message.author.username + "`")
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            message.channel.send(":no_entry: Votre solde actuel (**" + golds + " pépites d'or**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 pépites d'or**.")
        }
    }else if (selection == "4") {
        if (diamonds >= 3) {
            if (message.member.roles.find("id", config.pionnerRoleID)) {
                message.channel.send(":no_entry: Vous disposez déjà de cet article. Vous ne pouvez disposez que d'une seule unité de ce dernier.")
            }else{
            db.push("/game/" + message.author.id + "/objects/golds", diamonds - 3);
            message.member.addRole(config.pionnerRoleID,"A acheté via la Boutique Plug²")
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* du **grade Pionnier** a été validée - `" + message.author.username + "`")
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }}else{
            message.channel.send(":no_entry: Votre solde actuel (**" + diamonds + " diamants**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **3 diamants**.")
        }
    }else{
    message.channel.send(":no_entry_sign: L'article **" + selection + "** n'est pas ou plus disponible dans la **Boutique Plug²**. Vérifiez l'orthographe et réessayez. - `" + message.author.username + "`")
}}

function showLog() {
    if (config.keepLogs == true) {
    var date = new Date();
    var hour = date.getHours() + 1;
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var time = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
    console.log(time + " : " + loginfo)
    fs.appendFile("horigame.log", "\n" + time + " : " + loginfo, (error) => { /* handle error */ })
    }else{
        var date = new Date();
        var hour = date.getHours() + 1;
        hour = (hour < 10 ? "0" : "") + hour;
        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        var time = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
        console.log("[Horigame] " + time + " : " + loginfo)
}}